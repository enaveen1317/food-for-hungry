import { useEffect, useRef } from 'react';
import { haversineKm } from '../utils/haversine';

/**
 * GPS Simulator Hook
 *
 * Emits a new GPS coordinate every `intervalMs` milliseconds.
 * When the driver is "Delivering", the marker interpolates along a route.
 * When "Available", a gentle random walk simulates idle movement.
 * When "Offline" or "Break", no points are emitted.
 *
 * The hook calls `addGpsPoint(lat, lng)` provided by AppContext,
 * which handles Haversine accumulation and state updates.
 *
 * To replace with a real GPS feed (e.g., browser Geolocation API or WebSocket):
 *   Remove the setInterval block and subscribe to your real data source,
 *   then call addGpsPoint(lat, lng) on each new fix.
 *
 * @param {string} driverStatus  - 'Available' | 'Delivering' | 'Offline' | 'Break'
 * @param {Function} addGpsPoint - ctx.addGpsPoint(lat, lng)
 * @param {object} currentRoute  - { pickupLat, pickupLng, dropLat, dropLng } (used when delivering)
 * @param {number} intervalMs    - How often to emit (default 4000 ms)
 * @returns {{ lat: number, lng: number }} current simulated position
 */
export function useGpsSimulator(driverStatus, addGpsPoint, currentRoute = null, intervalMs = 4000) {
  // Starting position: T. Nagar, Chennai
  const posRef = useRef({ lat: 13.0418, lng: 80.2341 });
  const progressRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Don't emit if offline or on break
    if (driverStatus === 'Offline' || driverStatus === 'Break') {
      return;
    }

    intervalRef.current = setInterval(() => {
      let newLat, newLng;

      if (driverStatus === 'Delivering' && currentRoute) {
        // Interpolate along the delivery route
        const { pickupLat, pickupLng, dropLat, dropLng } = currentRoute;
        progressRef.current = Math.min(progressRef.current + 0.035, 0.97);
        const t = progressRef.current;
        newLat = pickupLat + (dropLat - pickupLat) * t;
        newLng = pickupLng + (dropLng - pickupLng) * t;
      } else {
        // Available: small random walk to simulate idle GPS drift
        newLat = posRef.current.lat + (Math.random() - 0.5) * 0.0008;
        newLng = posRef.current.lng + (Math.random() - 0.5) * 0.0008;
      }

      // Calculate segment distance for logging (context does the accumulation)
      const segKm = haversineKm(posRef.current.lat, posRef.current.lng, newLat, newLng);

      posRef.current = { lat: newLat, lng: newLng };
      addGpsPoint(newLat, newLng, segKm);
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [driverStatus, currentRoute, intervalMs, addGpsPoint]);

  return posRef.current;
}
