import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp, getCoords } from '../context/AppContext';

function applyTamilNaduMask(L, map) {
  fetch('https://nominatim.openstreetmap.org/search?state=Tamil%20Nadu&country=India&polygon_geojson=1&format=json')
    .then(res => res.json())
    .then(data => {
      if (data && data[0] && data[0].geojson) {
        const geom = data[0].geojson;
        const worldRing = [
          [90, -180], [90, 180], [-90, 180], [-90, -180]
        ];
        const rings = [worldRing];
        const flip = (coords) => coords.map(c => [c[1], c[0]]);
        if (geom.type === 'Polygon') {
          rings.push(flip(geom.coordinates[0]));
        } else if (geom.type === 'MultiPolygon') {
          geom.coordinates.forEach(poly => rings.push(flip(poly[0])));
        }
        L.polygon(rings, {
          color: '#f8fafc', fillColor: '#f8fafc', fillOpacity: 1, stroke: false
        }).addTo(map);
        L.geoJSON(geom, {
          style: { color: '#16a34a', weight: 2.5, opacity: 0.5, fill: false }
        }).addTo(map);
      }
    }).catch(err => console.log('Mask error:', err));
}

const HotspotLeafletMap = ({ hotspots }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    import('leaflet').then((L) => {
      L = L.default || L;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      const map = L.map(mapRef.current, { 
        zoomControl: true, 
        scrollWheelZoom: true,
        minZoom: 6,
        maxBounds: [[7.5, 75.5], [14.0, 81.0]],
      }).setView([10.8, 78.5], 7);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19, subdomains: 'abcd',
      }).addTo(map);

      applyTamilNaduMask(L, map);

      // Add hotspots as markers
      hotspots.forEach(h => {
        if (!h.coords) return;
        L.circleMarker([h.coords.lat, h.coords.lng], {
          radius: h.requests > 20 ? 12 : h.requests > 10 ? 8 : 6,
          fillColor: h.dot,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map).bindPopup(`<b style="font-family:Poppins">${h.area}</b><br>Needs food for ${h.requests} people`);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    }
  }, [loaded]);

  return <div ref={mapRef} style={{ width: '100%', height: '380px', borderRadius: '0 0 20px 20px', zIndex: 0 }} />;
}

const HungerHeatmap = () => {
  const { requests, volunteers, donations } = useApp();

  const dynamicHotspots = Object.values(requests.reduce((acc, req) => {
    const area = req.loc || 'Unknown Location';
    if (!acc[area]) {
      acc[area] = { area, coords: getCoords(area), requests: 0, status: 'low', color: '#DBEAFE', dot: '#2563EB' };
    }
    acc[area].requests += req.ppl || 1; 
    const r = acc[area].requests;
    
    if (r >= 20) { acc[area].status = 'critical'; acc[area].color = '#FEE2E2'; acc[area].dot = '#DC2626'; }
    else if (r >= 10) { acc[area].status = 'high'; acc[area].color = '#FEF3C7'; acc[area].dot = '#D97706'; }
    else if (r >= 5) { acc[area].status = 'medium'; acc[area].color = '#DCFCE7'; acc[area].dot = '#16A34A'; }
    
    return acc;
  }, {})).sort((a, b) => b.requests - a.requests);

  const criticalCount = dynamicHotspots.filter(h => h.status === 'critical').length;
  const activeDonors = donations.filter(d => d.progress < 5).length;
  const activeVolunteers = volunteers.filter(v => v.status === 'Delivering' || v.status === 'Available').length;

  return (
    <div className="screen-fit-section" style={{ background: 'var(--cream)', padding: '20px 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🗺️ Live Heatmap</div>
          <h2 className="section-title">Hunger Heatmap</h2>
          <p className="section-sub">See real-time hunger hotspots, donor availability, and active delivery zones near you.</p>
        </div>

        <div className="grid-main-aside" style={{ alignItems: 'start' }}>
          {/* Map Visual */}
          <div className="heatmap-container">
            <div className="heatmap-header">
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>Live Map — Tamil Nadu</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem' }}>Updated every 2 minutes</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-red">🔴 High Demand</span>
                <span className="badge badge-green">🟢 Donor Active</span>
              </div>
            </div>
            <div
              className="heatmap-map"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '0 0 20px 20px',
                position: 'relative',
                minHeight: '380px',
              }}
            >
              <HotspotLeafletMap hotspots={dynamicHotspots} />

              {/* Floating info badge over the map */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '16px',
                  padding: '14px 24px',
                  textAlign: 'center',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  pointerEvents: 'none',
                  minWidth: '220px',
                  zIndex: 10,
                }}
              >
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>
                  🗺️ Live Hunger Map
                </p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.78rem', marginTop: '2px' }}>Tamil Nadu — 12 Cities</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>● {criticalCount} Critical Zones</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--green-primary)', fontWeight: 700 }}>● {activeDonors} Donors Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Hotspots List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #EEF2F7', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px' }}>🔥 Hunger Hotspots</p>
              {dynamicHotspots.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>No active SOS requests right now.</p>
              ) : dynamicHotspots.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: h.color, borderRadius: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: h.dot }}></div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.area}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>Needs food for {h.requests} people</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: h.dot, textTransform: 'capitalize' }}>{h.status}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #EEF2F7', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px' }}>📊 Live Stats</p>
              {[
                { label: 'Active Donors Nearby', val: activeDonors, icon: '🍱' },
                { label: 'On-duty Volunteers', val: activeVolunteers, icon: '🚴' },
                { label: 'Total Pending People', val: dynamicHotspots.reduce((sum, h) => sum + h.requests, 0), icon: '👥' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-soft)', fontSize: '0.875rem' }}>
                    <span>{s.icon}</span> {s.label}
                  </div>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--text-dark)' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HungerHeatmap;
