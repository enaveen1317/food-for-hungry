import React from 'react';
import { MapPin, AlertCircle, TrendingUp } from 'lucide-react';

const hotspots = [
  { area: 'Dharavi, Chennai', requests: 24, status: 'critical', color: '#FEE2E2', dot: '#DC2626' },
  { area: 'Adyar, Chennai', requests: 18, status: 'high', color: '#FEF3C7', dot: '#D97706' },
  { area: 'Velachery', requests: 12, status: 'medium', color: '#DCFCE7', dot: '#16A34A' },
  { area: 'Anna Nagar', requests: 9, status: 'low', color: '#DBEAFE', dot: '#2563EB' },
  { area: 'T Nagar', requests: 7, status: 'low', color: '#DBEAFE', dot: '#2563EB' },
];

const HungerHeatmap = () => {
  return (
    <div style={{ background: 'var(--cream)', padding: '80px 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🗺️ Live Heatmap</div>
          <h2 className="section-title">Hunger Heatmap</h2>
          <p className="section-sub">See real-time hunger hotspots, donor availability, and active delivery zones near you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Map Visual */}
          <div className="heatmap-container">
            <div className="heatmap-header">
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>Live Map — Chennai & TN</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem' }}>Updated every 2 minutes</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-red">🔴 High Demand</span>
                <span className="badge badge-green">🟢 Donor Active</span>
              </div>
            </div>
            <div className="heatmap-map">
              {/* Decorative map with blobs */}
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Hotspot blobs */}
                {[
                  { top: '20%', left: '30%', size: 80, color: 'rgba(220,38,38,0.3)', label: 'Dharavi' },
                  { top: '50%', left: '60%', size: 60, color: 'rgba(249,115,22,0.3)', label: 'Adyar' },
                  { top: '70%', left: '25%', size: 50, color: 'rgba(22,163,74,0.3)', label: 'Velachery' },
                  { top: '35%', left: '70%', size: 40, color: 'rgba(37,99,235,0.25)', label: 'Anna Nagar' },
                  { top: '60%', left: '45%', size: 35, color: 'rgba(22,163,74,0.25)', label: 'T Nagar' },
                ].map((blob, i) => (
                  <div key={i} style={{ position: 'absolute', top: blob.top, left: blob.left, width: blob.size, height: blob.size, borderRadius: '50%', background: blob.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#333', animation: 'pulse 3s infinite', animationDelay: `${i * 0.5}s` }}>
                    📍
                  </div>
                ))}
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-lg)' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>🗺️ Live Hunger Map</p>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem' }}>Tamil Nadu — 12 Cities</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>● 5 Critical Zones</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--green-primary)', fontWeight: 700 }}>● 18 Donors Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Hotspots List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #EEF2F7', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px' }}>🔥 Hunger Hotspots</p>
              {hotspots.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: h.color, borderRadius: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: h.dot }}></div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.area}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{h.requests} requests</p>
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
                { label: 'Active Donors Nearby', val: '18', icon: '🍱' },
                { label: 'On-duty Volunteers', val: '7', icon: '🚴' },
                { label: 'Pending Pickups', val: '12', icon: '📦' },
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
