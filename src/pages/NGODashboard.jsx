import React, { useState } from 'react';
import { MapPin, CheckCircle, Phone } from 'lucide-react';

const ngos = [
  { name: 'Feeding India Chennai', area: 'Chennai, TN', deliveries: 1240, volunteers: 34, emoji: '🏛️', verified: true },
  { name: 'Annai Trust', area: 'Coimbatore, TN', deliveries: 876, volunteers: 22, emoji: '🤝', verified: true },
  { name: 'Hope Foundation', area: 'Madurai, TN', deliveries: 643, volunteers: 18, emoji: '🌱', verified: true },
  { name: 'Serve India', area: 'Salem, TN', deliveries: 421, volunteers: 12, emoji: '❤️', verified: true },
  { name: 'No Food Waste NGO', area: 'Trichy, TN', deliveries: 987, volunteers: 29, emoji: '♻️', verified: true },
  { name: 'Goonj Tamil Nadu', area: 'Tirunelveli, TN', deliveries: 554, volunteers: 16, emoji: '🌟', verified: true },
];

const NGODashboard = () => {
  return (
    <div style={{ background: 'white', padding: '80px 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏢 NGO Network</div>
          <h2 className="section-title">Our Verified NGO Partners</h2>
          <p className="section-sub">Join 28+ trusted hunger relief organizations making a real difference across Tamil Nadu.</p>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
          {[
            { icon: '🏢', num: '28+', label: 'Partner NGOs', color: '#DCFCE7' },
            { icon: '🍱', num: '24,800', label: 'Meals Delivered', color: '#FED7AA' },
            { icon: '📍', num: '12', label: 'Cities Covered', color: '#DBEAFE' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-icon-circle" style={{ background: s.color }}>{s.icon}</div>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* NGO Cards */}
        <div className="ngo-grid">
          {ngos.map((ngo, i) => (
            <div key={i} className="ngo-card">
              <div className="ngo-card-top">
                <div className="ngo-avatar">{ngo.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{ngo.name}</p>
                  {ngo.verified && <span className="ngo-verified">✅ Verified</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '14px' }}>
                <MapPin size={14} /> {ngo.area}
              </div>
              <div className="ngo-stat-row">
                <div className="ngo-stat-item">
                  <span className="ngo-stat-val">{ngo.deliveries}</span>
                  <span className="ngo-stat-lbl">Deliveries</span>
                </div>
                <div className="ngo-stat-item">
                  <span className="ngo-stat-val">{ngo.volunteers}</span>
                  <span className="ngo-stat-lbl">Volunteers</span>
                </div>
                <div className="ngo-stat-item">
                  <span className="ngo-stat-val">4.8★</span>
                  <span className="ngo-stat-lbl">Rating</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Connect</button>
                <button className="btn btn-secondary btn-sm"><Phone size={15} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px', padding: '40px', background: 'var(--green-mint)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <h3 style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>Is Your NGO Ready to Join?</h3>
          <p style={{ color: 'var(--text-soft)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>Register as a verified partner and start receiving food donations in your area today.</p>
          <button className="btn btn-primary">Register Your NGO</button>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
