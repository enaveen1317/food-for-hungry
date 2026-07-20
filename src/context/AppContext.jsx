import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { haversineKm } from '../utils/haversine';
import { api } from '../services/api';

const AppContext = createContext();

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setValue];
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────
export function getTier(points) {
  if (points >= 3000) return { name: 'Diamond', min: 3000, max: Infinity, next: null, color: '#60a5fa' };
  if (points >= 1501) return { name: 'Platinum', min: 1501, max: 3000, next: 'Diamond', color: '#a78bfa' };
  if (points >= 501)  return { name: 'Gold',     min: 501,  max: 1500, next: 'Platinum', color: '#f59e0b' };
  return                      { name: 'Silver',   min: 0,    max: 500,  next: 'Gold',    color: '#94a3b8' };
}

export function getTierProgress(points) {
  const tier = getTier(points);
  if (!tier.next) return { pct: 100, ptsAway: 0, nextTier: null };
  const range = tier.max - tier.min;
  const earned = points - tier.min;
  const ptsAway = tier.max - points + 1;
  return { pct: Math.min(100, Math.round((earned / range) * 100)), ptsAway, nextTier: tier.next };
}

// ─── Location coordinate lookup (Chennai area) ───────────────────────────────
const LOCATION_COORDS = {
  'Anna Nagar':       { lat: 13.0850, lng: 80.2101 },
  'T. Nagar':         { lat: 13.0418, lng: 80.2341 },
  'T Nagar':          { lat: 13.0418, lng: 80.2341 },
  'Adyar':            { lat: 13.0067, lng: 80.2571 },
  'Velachery':        { lat: 12.9815, lng: 80.2180 },
  'Tambaram':         { lat: 12.9249, lng: 80.1000 },
  'Porur':            { lat: 13.0380, lng: 80.1573 },
  'Perambur':         { lat: 13.1118, lng: 80.2330 },
  'Kodambakkam':      { lat: 13.0533, lng: 80.2237 },
  'Mylapore':         { lat: 13.0368, lng: 80.2676 },
  'Nungambakkam':     { lat: 13.0569, lng: 80.2425 },
  'Egmore':           { lat: 13.0732, lng: 80.2609 },
  'Guindy':           { lat: 13.0067, lng: 80.2206 },
  'Chromepet':        { lat: 12.9516, lng: 80.1462 },
  'Ambattur':         { lat: 13.1143, lng: 80.1548 },
  'Sholinganallur':   { lat: 12.9010, lng: 80.2279 },
  'Hope Shelter':     { lat: 13.0720, lng: 80.2350 },
  'Central Depot':    { lat: 13.0826, lng: 80.2752 },
  'KK Nagar':         { lat: 13.0500, lng: 80.1950 },
  'Coimbatore':       { lat: 11.0168, lng: 76.9558 },
  'Madurai':          { lat: 9.9252, lng: 78.1198 },
  'Trichy':           { lat: 10.7905, lng: 78.7047 },
  'Salem':            { lat: 11.6643, lng: 78.1460 },
  'Tirunelveli':      { lat: 8.7139, lng: 77.7567 },
};

export function getCoords(locationStr) {
  if (!locationStr) return { lat: 13.0827, lng: 80.2707 };
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (locationStr.toLowerCase().includes(key.toLowerCase())) return val;
  }
  const hash = (locationStr.length * 13 + locationStr.charCodeAt(0)) % 100;
  const hash2 = (locationStr.length * 17 + (locationStr.charCodeAt(locationStr.length - 1) || 0)) % 100;
  return { 
    lat: 13.0827 + (hash / 100 - 0.5) * 0.1, 
    lng: 80.2707 + (hash2 / 100 - 0.5) * 0.1 
  };
}

export const AppProvider = ({ children }) => {
  // ── Real Backend State ─────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    mealsToday: 0,
    familiesServed: 0,
    avgPickupMins: 0,
    activeZones: 0
  });

  const [donations, setDonations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useLocalStorage('ffh_requests', []);
  const [logs, setLogs] = useLocalStorage('ffh_logs', []);
  
  const [volunteers, setVolunteers] = useLocalStorage('ffh_volunteers', [
    { name: 'Rahul S.', area: 'T Nagar', status: 'Available', deliveries: 48, points: 1285, avatar: '🚴', tier: 'Gold' },
    { name: 'Karthik R.', area: 'Anna Nagar', status: 'Available', deliveries: 3, points: 120, avatar: '🚴', tier: 'Silver' },
    { name: 'Meena S.', area: 'Adyar', status: 'Available', deliveries: 1, points: 40, avatar: '🚴', tier: 'Silver' },
    { name: 'Pradeep K.', area: 'Velachery', status: 'Available', deliveries: 5, points: 200, avatar: '🚴', tier: 'Silver' },
  ]);

  const fetchLiveState = useCallback(async () => {
    try {
      const [dons, tsks, stts] = await Promise.all([
        api.getDonations(),
        api.getTasks(),
        api.getStats()
      ]);
      setDonations(dons || []);
      setTasks(tsks || []);
      if (stts) setStats(stts);
    } catch (err) {
      console.error("Failed to fetch live state", err);
    }
  }, []);

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 5000);
    return () => clearInterval(interval);
  }, [fetchLiveState]);

  // ── GPS & Shift State (NEW) ────────────────────────────────────────────────
  const [gpsHistory, setGpsHistory] = useState([]);
  const [distanceKm, setDistanceKm] = useState(0); 
  const [driverPos, setDriverPos]   = useState({ lat: 13.0650, lng: 80.2250 }); 
  const [driverStatus, setDriverStatus] = useState('Available'); 

  const [shiftState, setShiftState] = useState({
    isRunning: false,
    startTime: null,
    pausedAt: null,
    totalPausedMs: 0,
  });

  const lastGpsRef = useRef({ lat: 13.0650, lng: 80.2250 });

  const addGpsPoint = useCallback((lat, lng) => {
    const prev = lastGpsRef.current;
    const segKm = haversineKm(prev.lat, prev.lng, lat, lng);
    lastGpsRef.current = { lat, lng };

    setDriverPos({ lat, lng });
    setGpsHistory(h => [...h.slice(-199), { lat, lng, ts: Date.now() }]);
    setDistanceKm(d => parseFloat((d + segKm).toFixed(3)));

    setTasks(prev => prev.map(t => {
      if ((t.status === 'active' || t.status === 'pickup') && t.distance_remaining > 0) {
        const newRem = Math.max(0, parseFloat((t.distance_remaining - segKm).toFixed(3)));
        const newEta = newRem > 0 ? Math.ceil((newRem / 20) * 60) : 0;
        return { ...t, distance_remaining: newRem, eta: newEta };
      }
      return t;
    }));
  }, []);

  const startShift = () => {
    setShiftState({ isRunning: true, startTime: Date.now(), pausedAt: null, totalPausedMs: 0 });
    setDriverStatus('Available');
    setDistanceKm(0);
    setGpsHistory([]);
  };

  const pauseShift = () => {
    setShiftState(s => ({ ...s, isRunning: false, pausedAt: Date.now() }));
    setDriverStatus('Break');
  };

  const resumeShift = () => {
    setShiftState(s => ({
      ...s,
      isRunning: true,
      totalPausedMs: s.totalPausedMs + (Date.now() - (s.pausedAt || Date.now())),
      pausedAt: null,
    }));
    setDriverStatus('Available');
  };

  const endShift = () => {
    setShiftState(s => ({ ...s, isRunning: false }));
    setDriverStatus('Offline');
  };

  const setStatus = (status) => setDriverStatus(status);

  const getCurrentTimeStr = () => {
    const d = new Date();
    return d.toTimeString().substring(0, 5);
  };

  const addLog = (type, text) => {
    setLogs(prev => [{ time: getCurrentTimeStr(), type, text }, ...prev]);
  };

  // ── Donate ─────────────────────────────────────────────────────────────────
  const submitDonation = async (details) => {
    const res = await api.submitDonation(details);
    if (res && res.success) {
      addLog('DONATION', `New donation ${res.id} listed.`);
      await fetchLiveState();
      return res.id;
    }
  };

  // ── SOS ────────────────────────────────────────────────────────────────────
  const submitSOS = (reqDetails) => {
    const newId = requests.length + 1;
    const newReq = {
      id: newId,
      name: reqDetails.name || 'Anonymous',
      loc: reqDetails.address || 'Chennai City Center',
      ppl: parseInt(reqDetails.peopleCount) || 10,
      urgent: reqDetails.urgency === 'critical' || reqDetails.urgency === 'high',
      dispatched: false,
      volunteer: null
    };
    setRequests(prev => [newReq, ...prev]);
    addLog('SOS', `SOS alert raised by ${newReq.name} for ${newReq.ppl} people.`);
  };

  // ── NGO Actions ────────────────────────────────────────────────────────────
  const acceptDonationNGO = async (donationId) => {
    await api.acceptDonation(donationId);
    addLog('MATCH', `Donation ${donationId} accepted by NGO.`);
    await fetchLiveState();
  };

  const dispatchRiderNGO = async (donationId, volunteerName) => {
    await api.dispatchVolunteer(donationId, volunteerName);
    setVolunteers(prev => prev.map(v => v.name === volunteerName ? { ...v, status: 'Delivering' } : v));
    addLog('MATCH', `Volunteer ${volunteerName} dispatched for donation ${donationId}.`);
    await fetchLiveState();
  };

  const dispatchSOSRequest = (requestId, volunteerName) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, dispatched: true, volunteer: volunteerName } : r));
    setVolunteers(prev => prev.map(v => v.name === volunteerName ? { ...v, status: 'Delivering' } : v));
    addLog('SOS', `Rider ${volunteerName} dispatched for emergency request #${requestId}.`);
  };

  // ── Volunteer Actions ──────────────────────────────────────────────────────
  const acceptTaskVolunteer = async (taskId) => {
    await api.updateTaskStatus(taskId, 'active');
    setDriverStatus('Delivering');
    setVolunteers(prev => prev.map(v => v.name === 'Rahul S.' ? { ...v, status: 'Delivering' } : v));
    addLog('MATCH', `Task ${taskId} accepted by rider.`);
    await fetchLiveState();
  };

  const markPickedUpVolunteer = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    await api.updateTaskStatus(taskId, 'pickup', task.donation_id);
    addLog('DELIVERY', `Rider picked up food for task ${taskId}.`);
    await fetchLiveState();
  };

  const uploadProofVolunteer = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, proofUploaded: true } : t));
    addLog('DELIVERY', `Delivery proof uploaded for task ${taskId}.`);
  };

  const markDeliveredVolunteer = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await api.updateTaskStatus(taskId, 'completed', task.donation_id);

    const basePoints = 20;
    const distBonus  = Math.floor((task.distance_km || 0) * 2);
    const ptsEarned = basePoints + distBonus + 5;

    setVolunteers(prev => prev.map(v => {
      if (v.name === 'Rahul S.') {
        const newPoints = v.points + ptsEarned;
        return { ...v, status: 'Available', deliveries: v.deliveries + 1, points: newPoints, tier: getTier(newPoints).name };
      }
      return v;
    }));

    setDriverStatus('Available');
    addLog('DELIVERY', `Completed task ${task.id}. +${ptsEarned} pts earned!`);
    await fetchLiveState();
  };

  return (
    <AppContext.Provider value={{
      stats, donations, requests, volunteers, tasks, logs,
      gpsHistory, distanceKm, driverPos, driverStatus, shiftState,
      addGpsPoint, startShift, pauseShift, resumeShift, endShift, setStatus,
      submitDonation, submitSOS,
      acceptDonationNGO, dispatchRiderNGO, dispatchSOSRequest,
      acceptTaskVolunteer, markPickedUpVolunteer, uploadProofVolunteer, markDeliveredVolunteer,
      getTier, getTierProgress, getCoords, fetchLiveState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
