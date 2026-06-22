import React, { useState } from 'react';
import { Heart, Users, Building2, Truck, ArrowRight, MapPin, CheckCircle } from 'lucide-react';

const Home = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">
          {/* Left */}
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Live: 34 donations active right now
            </div>
            <h1 className="hero-title">
              Share Surplus Food.<br />
              <span>Feed Hungry Lives.</span>
            </h1>
            <p className="hero-subtitle">
              A trusted platform that connects homes, restaurants, events, and hotels with nearby NGOs, volunteers, and people in need — reducing food waste and delivering meals with dignity.
            </p>
            <div className="hero-btns">
              <button className="hero-btn-primary" onClick={() => scrollTo('donate')}>
                🍱 Donate Food
              </button>
              <button className="hero-btn-secondary" onClick={() => scrollTo('request')}>
                Request Help <ArrowRight size={18} />
              </button>
            </div>
            <div className="trust-badges">
              <span className="trust-badge">✅ Verified NGOs</span>
              <span className="trust-badge">🚴 Safe Delivery</span>
              <span className="trust-badge">📍 Nearby Pickup</span>
              <span className="trust-badge">🗣️ Tamil / English</span>
            </div>
          </div>

          {/* Right — Glass Card */}
          <div className="hero-visual">
            <div className="hero-glass-card">
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Who we connect
              </p>
              <div className="hero-grid-4">
                <div className="hero-mini-card" onClick={() => scrollTo('donate')}>
                  <span className="icon">🍽️</span>
                  <p>Donors</p>
                </div>
                <div className="hero-mini-card" onClick={() => scrollTo('volunteer-dashboard')}>
                  <span className="icon">🚴</span>
                  <p>Volunteers</p>
                </div>
                <div className="hero-mini-card" onClick={() => scrollTo('ngo-dashboard')}>
                  <span className="icon">🏢</span>
                  <p>NGOs</p>
                </div>
                <div className="hero-mini-card" onClick={() => scrollTo('request')}>
                  <span className="icon">👨‍👩‍👧</span>
                  <p>Families</p>
                </div>
              </div>
            </div>

            {/* Live stats bar */}
            <div className="hero-live-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">2,480</span>
                <span className="hero-stat-label">Meals Today</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">28</span>
                <span className="hero-stat-label">NGO Partners</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">340</span>
                <span className="hero-stat-label">Volunteers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE IMPACT STATS ───────────────────────── */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📊 Live Impact</div>
            <h2 className="section-title">Together We're Making a Difference</h2>
            <p className="section-sub">Real-time numbers from our growing community of donors, volunteers, and NGO partners.</p>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon-circle" style={{ background: '#DCFCE7' }}>🍱</div>
              <span className="stat-num">24,800</span>
              <span className="stat-label">Meals Shared</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon-circle" style={{ background: '#FED7AA' }}>👨‍👩‍👧</div>
              <span className="stat-num">5,120</span>
              <span className="stat-label">Families Supported</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon-circle" style={{ background: '#DBEAFE' }}>🏢</div>
              <span className="stat-num">28</span>
              <span className="stat-label">Partner NGOs</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon-circle" style={{ background: '#F3E8FF' }}>🚚</div>
              <span className="stat-num">8,340</span>
              <span className="stat-label">Deliveries Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ───────────────────────────── */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🚀 Get Started</div>
            <h2 className="section-title">How Would You Like to Help?</h2>
          </div>
          <div className="action-grid">
            <div className="action-card action-card-green" onClick={() => scrollTo('donate')}>
              <div className="action-card-icon" style={{ background: '#BBF7D0' }}>🍱</div>
              <div className="action-card-title">Donate Food</div>
              <div className="action-card-desc">Have extra food from home, event, hotel or restaurant? Share it now.</div>
              <button className="action-card-arrow">Start Donating <ArrowRight size={16} /></button>
            </div>
            <div className="action-card action-card-orange" onClick={() => scrollTo('request')}>
              <div className="action-card-icon" style={{ background: '#FED7AA' }}>🙏</div>
              <div className="action-card-title">Request Food</div>
              <div className="action-card-desc">Need meals for family, shelter or elderly people? Submit a request.</div>
              <button className="action-card-arrow" style={{ color: 'var(--orange)' }}>Request Now <ArrowRight size={16} /></button>
            </div>
            <div className="action-card action-card-blue" onClick={() => scrollTo('volunteer-dashboard')}>
              <div className="action-card-icon" style={{ background: '#BFDBFE' }}>🚴</div>
              <div className="action-card-title">Become Volunteer</div>
              <div className="action-card-desc">Help pick up and deliver food in your area. Make a daily difference.</div>
              <button className="action-card-arrow" style={{ color: '#2563EB' }}>Join as Volunteer <ArrowRight size={16} /></button>
            </div>
            <div className="action-card action-card-cream" onClick={() => scrollTo('ngo-dashboard')}>
              <div className="action-card-icon" style={{ background: '#DCFCE7' }}>🏢</div>
              <div className="action-card-title">Partner as NGO</div>
              <div className="action-card-desc">Join as a verified hunger relief organization and scale your impact.</div>
              <button className="action-card-arrow">Register NGO <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ Process</div>
            <h2 className="section-title">How Food For Hungry Works</h2>
            <p className="section-sub">From donation to delivery in 4 simple steps.</p>
          </div>
          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-num">1</div>
              <span className="timeline-icon">📦</span>
              <div className="timeline-title">Donor Uploads Food</div>
              <div className="timeline-desc">Add food type, quantity, location, and pickup time in under 2 minutes.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">2</div>
              <span className="timeline-icon">🔔</span>
              <div className="timeline-title">NGO / Volunteer Alerted</div>
              <div className="timeline-desc">Smart matching sends instant alerts to nearby verified partners.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">3</div>
              <span className="timeline-icon">🚴</span>
              <div className="timeline-title">Pickup & Delivery</div>
              <div className="timeline-desc">Volunteer collects food and transports it safely to people in need.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">4</div>
              <span className="timeline-icon">❤️</span>
              <div className="timeline-title">Food Reaches Families</div>
              <div className="timeline-desc">Delivery proof and impact update sent. Your kindness is tracked.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOS EMERGENCY ───────────────────────────── */}
      <section className="section section-cream">
        <div className="container">
          <div className="sos-section">
            <div className="sos-badge">
              🆘 Emergency Alert
            </div>
            <h2 style={{ fontFamily: 'Poppins', fontSize: '2.2rem', fontWeight: 800, color: 'var(--red-sos)', marginBottom: '12px' }}>
              Need Food Urgently?
            </h2>
            <p style={{ color: 'var(--text-soft)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.8 }}>
              Are you or someone nearby starving right now? Send an SOS request and our volunteers will respond within minutes.
            </p>
            <button className="btn btn-danger btn-lg" onClick={() => {
              const el = document.getElementById('request');
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
            }}>
              🆘 Send SOS Request
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="navbar-logo-icon">🍽️</div>
                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>Food For Hungry</span>
              </div>
              <p className="footer-tagline">"No food should go to waste when someone nearby is hungry."</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                  <button key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'var(--transition)' }}>{icon}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              {['Donate Food', 'Request Food', 'Track Delivery', 'Hunger Heatmap'].map(l => (
                <button key={l} className="footer-link">{l}</button>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Community</div>
              {['Become Volunteer', 'Partner NGO', 'Corporate CSR', 'Success Stories'].map(l => (
                <button key={l} className="footer-link">{l}</button>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              {['About Us', 'Privacy Policy', 'Terms of Use', 'Support'].map(l => (
                <button key={l} className="footer-link">{l}</button>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2024 Food For Hungry. All rights reserved.</p>
            <p className="footer-copy">Made with ❤️ to fight hunger</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
