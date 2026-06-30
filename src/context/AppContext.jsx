import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
import { haversineKm } from '../utils/haversine';

const AppContext = createContext();

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
  // Deterministic fallback based on string length and first char code
  const hash = (locationStr.length * 13 + locationStr.charCodeAt(0)) % 100;
  const hash2 = (locationStr.length * 17 + (locationStr.charCodeAt(locationStr.length - 1) || 0)) % 100;
  return { 
    lat: 13.0827 + (hash / 100 - 0.5) * 0.1, 
    lng: 80.2707 + (hash2 / 100 - 0.5) * 0.1 
  };
}

export const AppProvider = ({ children }) => {
  // ── Statistics ─────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    mealsToday: 24850,
    familiesServed: 5120,
    avgPickupMins: 18,
    activeZones: 12
  });

  // ── Donations State ────────────────────────────────────────────────────────
  const [donations, setDonations] = useState([
    {
      id: 'DON-8492',
      donor: 'A1 Mahal (Wedding)',
      food: 'Leftover Wedding Meals (Rice & Curry)',
      qty: '40 Portions',
      category: 'Cooked Meals',
      prepTime: '14:00',
      bestBefore: '20:00',
      storage: 'Hot / Warm',
      address: 'Anna Nagar, Chennai',
      contact: '+91 98765 43210',
      window: 'Next 2 Hours',
      packaging: 'Packed in individual boxes',
      status: 'Volunteer Assigned',
      progress: 3,
      eta: '12 mins',
      volunteer: 'Rahul S.',
      ngo: 'Hope Shelter',
      time: '14:30 PM',
      date: 'Today'
    },
    {
      id: 'DON-8211',
      donor: 'Krishna Bakery',
      food: 'Bakery Surplus (Breads)',
      qty: '15 kg',
      category: 'Baked Goods',
      status: 'delivered',
      progress: 5,
      ngo: 'Annai Trust',
      date: 'Yesterday'
    },
    {
      id: 'DON-7934',
      donor: 'Hotel Saravana Bhavan',
      food: 'Corporate Event Meals',
      qty: '120 Portions',
      category: 'Cooked Meals',
      status: 'delivered',
      progress: 5,
      ngo: 'Green Bowl Restaurant',
      date: 'Last Week'
    }
  ]);

  // ── Urgent Requests ────────────────────────────────────────────────────────
  const [requests, setRequests] = useState([
    { id: 1, name: 'Ravi & Family', loc: 'Dharavi Colony, Chennai', ppl: 8, urgent: true, dispatched: false, volunteer: null },
    { id: 2, name: 'Anbu Night Shelter', loc: 'Adyar Bridge Camp', ppl: 25, urgent: true, dispatched: false, volunteer: null },
    { id: 3, name: 'Old Age Home, T Nagar', loc: 'T Nagar West', ppl: 40, urgent: false, dispatched: false, volunteer: null }
  ]);

  // ── Volunteers State ───────────────────────────────────────────────────────
  const [volunteers, setVolunteers] = useState([
    { name: 'Rahul S.', area: 'T Nagar', status: 'Delivering', deliveries: 48, points: 1285, avatar: '🚴', tier: 'Gold' },
    { name: 'Karthik R.', area: 'Anna Nagar', status: 'Available', deliveries: 3, points: 120, avatar: '🚴', tier: 'Silver' },
    { name: 'Meena S.', area: 'Adyar', status: 'Available', deliveries: 1, points: 40, avatar: '🚴', tier: 'Silver' },
    { name: 'Pradeep K.', area: 'Velachery', status: 'Available', deliveries: 5, points: 200, avatar: '🚴', tier: 'Silver' },
    { name: 'Divya T.', area: 'T Nagar', status: 'Break', deliveries: 2, points: 80, avatar: '🚴', tier: 'Silver' }
  ]);

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-992',
      donor: 'A1 Mahal (Wedding)',
      food: 'Rice & Veg Curry — 40 portions',
      pickup: 'Anna Nagar',
      drop: 'Hope Shelter, T Nagar',
      urgency: 'high',
      distanceKm: 3.2,
      distanceRemaining: 2.4,
      payout: '45 pts',
      status: 'active',
      pickupTime: 'Ready now',
      dropTime: 'Deliver by 15:30',
      proofUploaded: false,
      donationId: 'DON-8492',
      eta: 12,
      assignedAt: Date.now() - 15 * 60 * 1000, // started 15 min ago
    },
    {
      id: 'TSK-995',
      donor: 'Grand Bakery',
      food: 'Bread & Buns — 200 pcs',
      pickup: 'Velachery',
      drop: 'Children Home, KK Nagar',
      urgency: 'medium',
      distanceKm: 6.5,
      distanceRemaining: 6.5,
      payout: '60 pts',
      status: 'available',
      pickupTime: 'Ready at 16:00',
      dropTime: 'Deliver by 18:00',
      proofUploaded: false,
      donationId: null,
      eta: 22,
      assignedAt: null,
    },
    {
      id: 'TSK-988',
      donor: 'Saravana Stores Canteen',
      food: 'Idli & Sambar — 60 portions',
      pickup: 'Nungambakkam',
      drop: 'Hope Shelter, Egmore',
      urgency: 'medium',
      distanceKm: 2.8,
      distanceRemaining: 2.8,
      payout: '38 pts',
      status: 'available',
      pickupTime: 'Ready at 16:30',
      dropTime: 'Deliver by 18:30',
      proofUploaded: false,
      donationId: null,
      eta: 10,
      assignedAt: null,
    }
  ]);

  // ── Activity Logs ──────────────────────────────────────────────────────────
  const [logs, setLogs] = useState([
    { time: '14:32', type: 'MATCH', text: 'Donation DON-8492 automatically matched to Hope Shelter.' },
    { time: '14:28', type: 'DONATION', text: 'New donation of 40 portions listed by A1 Mahal.' },
    { time: '14:15', type: 'DELIVERY', text: 'Volunteer Suresh completed delivery to Annai Trust.' },
    { time: '14:05', type: 'SOS', text: 'SOS alert raised from Central Station (25 people).' },
    { time: '13:50', type: 'USER', text: 'New NGO "Feeding Hearts" registration pending approval.' }
  ]);

  // ── GPS & Shift State (NEW) ────────────────────────────────────────────────
  const [gpsHistory, setGpsHistory] = useState([
    { lat: 13.0418, lng: 80.2341, ts: Date.now() - 120000 }
  ]);
  const [distanceKm, setDistanceKm] = useState(14.2); // seeded with shift distance so far
  const [driverPos, setDriverPos]   = useState({ lat: 13.0650, lng: 80.2250 }); // current live position
  const [driverStatus, setDriverStatus] = useState('Delivering'); // 'Available'|'Delivering'|'Offline'|'Break'

  // Shift timer
  const [shiftState, setShiftState] = useState({
    isRunning: true,
    startTime: Date.now() - (3 * 3600 + 15 * 60) * 1000, // seeded 3h15m ago
    pausedAt: null,
    totalPausedMs: 0,
  });

  // ── GPS accumulation (called by useGpsSimulator) ────────────────────────
  const lastGpsRef = useRef({ lat: 13.0650, lng: 80.2250 });

  const addGpsPoint = useCallback((lat, lng) => {
    const prev = lastGpsRef.current;
    const segKm = haversineKm(prev.lat, prev.lng, lat, lng);
    lastGpsRef.current = { lat, lng };

    // Only accumulate if driver is active (not offline/break)
    setDriverPos({ lat, lng });
    setGpsHistory(h => [...h.slice(-199), { lat, lng, ts: Date.now() }]); // keep last 200 pts
    setDistanceKm(d => parseFloat((d + segKm).toFixed(3)));

    // Decrease distanceRemaining on active task
    setTasks(prev => prev.map(t => {
      if ((t.status === 'active' || t.status === 'pickup') && t.distanceRemaining > 0) {
        const newRem = Math.max(0, parseFloat((t.distanceRemaining - segKm).toFixed(3)));
        const newEta = newRem > 0 ? Math.ceil((newRem / 20) * 60) : 0; // 20 km/h avg speed → minutes
        return { ...t, distanceRemaining: newRem, eta: newEta };
      }
      return t;
    }));
  }, []);

  // ── Shift controls ─────────────────────────────────────────────────────────
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

  // ── Helper ─────────────────────────────────────────────────────────────────
  const getCurrentTimeStr = () => {
    const d = new Date();
    return d.toTimeString().substring(0, 5);
  };

  const addLog = (type, text) => {
    setLogs(prev => [{ time: getCurrentTimeStr(), type, text }, ...prev]);
  };

  // ── Donate ─────────────────────────────────────────────────────────────────
  const submitDonation = (details) => {
    const randomId = 'DON-' + Math.floor(1000 + Math.random() * 9000);
    const newDon = {
      id: randomId,
      donor: details.donor || 'Self',
      food: details.foodTitle || 'Surplus Food',
      qty: `${details.qty} ${details.unit || 'Portions'}`,
      category: details.category || 'Cooked Meals',
      prepTime: details.prepTime || '14:00',
      bestBefore: details.bestBefore || '20:00',
      storage: details.storage || 'Room Temp',
      address: details.address || 'Anna Nagar, Chennai',
      contact: details.contact || '+91 98765 43210',
      window: details.window || 'Next 2 Hours',
      packaging: details.packaging || 'Loose / requires packaging',
      status: 'Volunteer Assigned',
      progress: 3,
      time: 'Just now',
      date: 'Today',
      volunteer: 'Rahul S.',
      ngo: details.ngo || 'Hope Shelter'
    };
    
    const newTask = {
      id: 'TSK-' + Math.floor(1000 + Math.random() * 9000),
      donor: newDon.donor,
      food: `${newDon.food} — ${newDon.qty}`,
      pickup: newDon.address,
      drop: newDon.ngo,
      urgency: 'high',
      distanceKm: 4.5,
      distanceRemaining: 4.5,
      payout: '50 pts',
      status: 'active',
      pickupTime: 'Ready now',
      dropTime: 'Deliver in 1 hour',
      proofUploaded: false,
      donationId: randomId,
      eta: 15,
      assignedAt: Date.now()
    };

    setDonations(prev => [newDon, ...prev]);
    setTasks(prev => [newTask, ...prev.map(t => t.status === 'active' ? { ...t, status: 'completed' } : t)]);
    addLog('DONATION', `New donation ${randomId} of ${newDon.qty} listed by ${newDon.donor}.`);
    return randomId;
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
  const acceptDonationNGO = (donationId) => {
    setDonations(prev => prev.map(d => d.id === donationId ? { ...d, status: 'accepted', progress: 2 } : d));
    addLog('MATCH', `Donation ${donationId} accepted by NGO.`);
  };

  const dispatchRiderNGO = (donationId, volunteerName) => {
    const donObj = donations.find(d => d.id === donationId);
    if (!donObj) return;
    setDonations(prev => prev.map(d =>
      d.id === donationId ? { ...d, status: 'Volunteer Assigned', progress: 3, volunteer: volunteerName, eta: '10 mins' } : d
    ));
    setVolunteers(prev => prev.map(v => v.name === volunteerName ? { ...v, status: 'Delivering' } : v));
    const newTask = {
      id: 'TSK-' + Math.floor(100 + Math.random() * 900),
      donor: donObj.donor,
      food: `${donObj.food} — ${donObj.qty}`,
      pickup: donObj.address.split(',')[0],
      drop: donObj.ngo || 'Hope Shelter',
      urgency: 'high',
      distanceKm: 2.5,
      distanceRemaining: 2.5,
      payout: '50 pts',
      status: 'active',
      pickupTime: 'Ready now',
      dropTime: 'Deliver soon',
      proofUploaded: false,
      donationId,
      eta: 8,
      assignedAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    addLog('MATCH', `Volunteer ${volunteerName} dispatched for donation ${donationId}.`);
  };

  const dispatchSOSRequest = (requestId, volunteerName) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, dispatched: true, volunteer: volunteerName } : r));
    setVolunteers(prev => prev.map(v => v.name === volunteerName ? { ...v, status: 'Delivering' } : v));
    const reqObj = requests.find(r => r.id === requestId);
    const newTask = {
      id: 'TSK-' + Math.floor(100 + Math.random() * 900),
      donor: reqObj ? reqObj.name : 'SOS Requester',
      food: `Emergency Food Support — ${reqObj ? reqObj.ppl : 10} people`,
      pickup: 'Central Depot',
      drop: reqObj ? reqObj.loc : 'Requested Address',
      urgency: 'high',
      distanceKm: 3.0,
      distanceRemaining: 3.0,
      payout: '60 pts',
      status: 'active',
      pickupTime: 'Ready now',
      dropTime: 'Deliver immediately',
      proofUploaded: false,
      requestId,
      eta: 10,
      assignedAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    addLog('SOS', `Rider ${volunteerName} dispatched for emergency request #${requestId}.`);
  };

  // ── Volunteer Actions ──────────────────────────────────────────────────────
  const acceptTaskVolunteer = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'active', assignedAt: Date.now() } : t));
    setDriverStatus('Delivering');
    setVolunteers(prev => prev.map(v => v.name === 'Rahul S.' ? { ...v, status: 'Delivering' } : v));
    addLog('MATCH', `Task ${taskId} accepted by rider.`);
  };

  const markPickedUpVolunteer = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'pickup' } : t));
    if (task.donationId) {
      setDonations(prev => prev.map(d => d.id === task.donationId ? { ...d, status: 'Picked up', progress: 4 } : d));
    }
    addLog('DELIVERY', `Rider picked up food for task ${taskId}.`);
  };

  const uploadProofVolunteer = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, proofUploaded: true } : t));
    addLog('DELIVERY', `Delivery proof uploaded for task ${taskId}.`);
  };

  const markDeliveredVolunteer = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', distanceRemaining: 0, eta: 0 } : t));

    // ── Reward point calculation ──────────────────────────────────────────
    const basePoints = 20;
    const distBonus  = Math.floor((task.distanceKm || 0) * 2);  // +2 per km
    const onTimeBonus = task.assignedAt
      ? (Date.now() - task.assignedAt < 45 * 60 * 1000 ? 10 : 0) // on time if < 45 min
      : 0;
    const ratingBonus = 5; // simulated rating always >= 4.5 for demo
    const ptsEarned = basePoints + distBonus + onTimeBonus + ratingBonus;

    if (task.donationId) {
      setDonations(prev => prev.map(d =>
        d.id === task.donationId ? { ...d, status: 'delivered', progress: 5 } : d
      ));
      const donObj = donations.find(d => d.id === task.donationId);
      if (donObj) {
        const qtyVal = parseInt(donObj.qty) || 20;
        setStats(prev => ({
          ...prev,
          mealsToday: prev.mealsToday + qtyVal,
          familiesServed: prev.familiesServed + Math.ceil(qtyVal / 4)
        }));
      }
    }

    setVolunteers(prev => prev.map(v => {
      if (v.name === 'Rahul S.') {
        const newPoints = v.points + ptsEarned;
        return { ...v, status: 'Available', deliveries: v.deliveries + 1, points: newPoints, tier: getTier(newPoints).name };
      }
      return v;
    }));

    setDriverStatus('Available');
    addLog('DELIVERY', `Rahul S. completed task ${task.id}. +${ptsEarned} pts earned!`);
  };

  return (
    <AppContext.Provider value={{
      stats, donations, requests, volunteers, tasks, logs,
      // GPS & shift
      gpsHistory, distanceKm, driverPos, driverStatus, shiftState,
      addGpsPoint, startShift, pauseShift, resumeShift, endShift, setStatus,
      // Actions
      submitDonation, submitSOS,
      acceptDonationNGO, dispatchRiderNGO, dispatchSOSRequest,
      acceptTaskVolunteer, markPickedUpVolunteer, uploadProofVolunteer, markDeliveredVolunteer,
      // Helpers
      getTier, getTierProgress, getCoords,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
