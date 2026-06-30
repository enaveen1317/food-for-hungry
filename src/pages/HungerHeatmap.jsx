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
    <div className="screen-fit-section" style={{ background: 'var(--cream)' }}>
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
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>Live Map — Chennai & TN</p>
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
              {/* ✅ Real Google Maps Embed — Chennai, Tamil Nadu */}
              <iframe
                title="Live Hunger Map — Chennai & Tamil Nadu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497706.5!2d80.27071814355469!3d13.082697828125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1719641000000!5m2!1sen!2sin"
                width="100%"
                height="380"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

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
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>● 5 Critical Zones</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--green-primary)', fontWeight: 700 }}>● 18 Donors Active</span>
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
