import React from 'react';
import { ArrowRight, MapPin, CheckCircle, Clock, Navigation } from 'lucide-react';

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
          {/* Left Content */}
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              City-Scale Food Rescue Operations
            </div>
            <h1 className="hero-title">
              Zero Waste.<br />
              <span>Zero Hunger.</span>
            </h1>
            <p className="hero-subtitle">
              The operating system for urban food rescue. We instantly match surplus food from restaurants, events, and homes with verified NGOs and volunteer fleets to deliver meals before they go to waste.
            </p>
            <div className="hero-btns">
              <button className="hero-btn-primary" onClick={() => scrollTo('donate')}>
                🍱 Donate Surplus Food
              </button>
              <button className="hero-btn-secondary" onClick={() => scrollTo('sos-request')}>
                Request Help <ArrowRight size={18} />
              </button>
            </div>
            <div className="trust-badges">
              <span className="trust-badge">✅ Verified NGO Network</span>
              <span className="trust-badge">🚴 Live GPS Routing</span>
              <span className="trust-badge">📍 Local Impact</span>
            </div>
          </div>

          {/* Right — Live Rescue Operations Panel */}
          <div className="hero-visual">
            <div className="ops-panel">
              <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>
                🔴 Active Rescue Right Now
              </p>
              
              <div className="ops-stat-row">
                <div className="ops-stat">
                  <span className="ops-stat-num">34</span>
                  <span className="ops-stat-label">Live Donations</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-stat-num">12</span>
                  <span className="ops-stat-label">Volunteers Near</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-stat-num">8</span>
                  <span className="ops-stat-label">Active Requests</span>
                </div>
              </div>

              <div className="ops-live-match">
                <div className="ops-live-match-header">
                  <span className="ops-match-pulse"><span className="ops-match-dot"></span> Volunteer Assigned</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>Just now</span>
                </div>
                <h4 className="ops-match-title">Wedding Meals & Curry</h4>
                <p className="ops-match-desc" style={{ marginBottom: '12px' }}>Rescuing 40 meals from A1 Mahal</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                    <MapPin size={14} color="var(--orange)" /> <span><strong>Pickup:</strong> Anna Nagar</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                    <Navigation size={14} color="var(--green-primary)" /> <span><strong>Drop:</strong> Children's Shelter</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>2,480</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)', textTransform: 'uppercase', fontWeight: 600 }}>Meals Today</span>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>28</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)', textTransform: 'uppercase', fontWeight: 600 }}>NGO Partners</span>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>124</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)', textTransform: 'uppercase', fontWeight: 600 }}>Active Fleet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION A: LIVE IMPACT STRIP ───────────────────────── */}
      <div className="impact-strip">
        <div className="container impact-strip-grid">
          <div className="impact-item">
            <div className="impact-icon">🍱</div>
            <div>
              <div className="impact-val">24,850</div>
              <div className="impact-lbl">Meals Rescued Today</div>
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-icon">👨‍👩‍👧</div>
            <div>
              <div className="impact-val">5,120</div>
              <div className="impact-lbl">Families Served</div>
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-icon">⏱️</div>
            <div>
              <div className="impact-val">18 mins</div>
              <div className="impact-lbl">Avg. Pickup Time</div>
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-icon">📍</div>
            <div>
              <div className="impact-val">12 Zones</div>
              <div className="impact-lbl">Active Service Areas</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION B: HOW FOOD RESCUE WORKS ────────────────────────────── */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ Operations</div>
            <h2 className="section-title">The Rescue Workflow</h2>
            <p className="section-sub">A seamlessly integrated pipeline that moves surplus food from donor to beneficiary in under 60 minutes.</p>
          </div>
          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-num">1</div>
              <span className="timeline-icon">📱</span>
              <div className="timeline-title">Donor Lists Surplus</div>
              <div className="timeline-desc">Hotels, events, or homes upload details. AI assesses freshness and urgency.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">2</div>
              <span className="timeline-icon">🔔</span>
              <div className="timeline-title">Smart Dispatch</div>
              <div className="timeline-desc">Algorithm pings the nearest verified NGO and assigns a volunteer rider.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">3</div>
              <span className="timeline-icon">🚴</span>
              <div className="timeline-title">Route & Pickup</div>
              <div className="timeline-desc">Volunteer arrives via live GPS, verifies food quality, and securely packs it.</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">4</div>
              <span className="timeline-icon">✅</span>
              <div className="timeline-title">Delivery Complete</div>
              <div className="timeline-desc">Food reaches the shelter. Impact proof and photos are uploaded to the dashboard.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION C: NEARBY ACTIVE REQUESTS ────────────────────────────── */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📡 Live Feed</div>
            <h2 className="section-title">Nearby Active Requests</h2>
            <p className="section-sub">See real needs happening right now in your city. Can you help fulfill them?</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="live-req-card">
              <div className="live-req-icon">🍲</div>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '8px', display: 'inline-block' }}>High Priority</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>Dinner for 18 children</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '8px' }}>📍 Hope Shelter, Perambur</p>
                <button className="btn-action-sm" style={{ color: 'var(--green-primary)', fontWeight: 600, fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Fulfill Request →</button>
              </div>
            </div>
            <div className="live-req-card">
              <div className="live-req-icon">🍱</div>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '8px', display: 'inline-block' }}>Volunteer Needed</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>Surplus Rice & Dal (30 kg)</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '8px' }}>📍 Grand Hotel, Velachery</p>
                <button className="btn-action-sm" style={{ color: 'var(--green-primary)', fontWeight: 600, fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Accept Pickup →</button>
              </div>
            </div>
            <div className="live-req-card">
              <div className="live-req-icon">🥪</div>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '8px', display: 'inline-block' }}>Medium Priority</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>Packed meals for elderly</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '8px' }}>📍 Old Age Home, T Nagar</p>
                <button className="btn-action-sm" style={{ color: 'var(--green-primary)', fontWeight: 600, fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Fulfill Request →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION D: VERIFIED NGO NETWORK ────────────────────────────── */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🏢 Partner Network</div>
            <h2 className="section-title">Verified NGO Network</h2>
            <p className="section-sub">We collaborate with trusted organizations to ensure food safety, fair distribution, and maximum impact.</p>
          </div>
          
          <div className="action-grid">
            {[
              { name: 'Feeding India', area: 'Chennai Central', time: '< 15 mins', del: '1,240' },
              { name: 'No Food Waste', area: 'Coimbatore', time: '< 20 mins', del: '987' },
              { name: 'Annai Trust', area: 'Madurai South', time: '< 18 mins', del: '876' },
              { name: 'Hope Foundation', area: 'Trichy', time: '< 25 mins', del: '643' }
            ].map((ngo, i) => (
              <div key={i} className="card card-sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--green-mint)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏛️</div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem' }}>{ngo.name}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--green-primary)', fontWeight: 700 }}>✅ Verified Partner</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '16px' }}>
                  <div><strong>Zone:</strong><br/>{ngo.area}</div>
                  <div><strong>Response:</strong><br/>{ngo.time}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                  {ngo.del} Deliveries Completed
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn btn-secondary" onClick={() => scrollTo('ngo-dashboard')}>View All 28+ Partners</button>
          </div>
        </div>
      </section>

      {/* ── SECTION E: RESCUE STORIES ────────────────────────────── */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✨ Impact</div>
            <h2 className="section-title">Rescue Stories</h2>
            <p className="section-sub">Real impact achieved by our donors and volunteers this week.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { img: '🎉', title: 'Wedding Leftovers', desc: '42 portions of premium meals rescued from a marriage hall in Adyar and delivered to a local orphanage within 45 minutes.', color: '#DBEAFE' },
              { img: '🌧️', title: 'Monsoon Relief', desc: 'During heavy rains, home cooks prepared and pooled 120 hot meals, distributed safely by our fleet to stranded families.', color: '#DCFCE7' },
              { img: '🏢', title: 'Corporate Cafe', desc: 'An IT park cafeteria pledged their daily surplus. Now, 50 fresh meals reliably reach an elderly care home every evening.', color: '#FEE2E2' }
            ].map((story, i) => (
              <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: story.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  {story.img}
                </div>
                <div style={{ padding: '24px' }}>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>{story.title}</h4>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: 1.6 }}>{story.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION F: SOS EMERGENCY ───────────────────────────── */}
      <section className="section" id="sos-request" style={{ background: 'linear-gradient(135deg, var(--red-sos), #991B1B)' }}>
        <div className="container">
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
              <span style={{ width: '8px', height: '8px', background: '#FCA5A5', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
              EMERGENCY NETWORK ACTIVE
            </div>
            <h2 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
              Need Food Urgently?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.8 }}>
              If a family, shelter, or street community is starving right now, send an SOS. Our algorithm bypasses normal queues and blasts a priority alert to the nearest available fleet.
            </p>
            <button className="btn" style={{ background: 'white', color: 'var(--red-sos)', height: '60px', padding: '0 40px', fontSize: '1.1rem' }}>
              🚨 Broadcast SOS Alert Now
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
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <button className="footer-link">Donate Food</button>
              <button className="footer-link">Request Food</button>
              <button className="footer-link">Track Delivery</button>
            </div>
            <div>
              <div className="footer-col-title">Community</div>
              <button className="footer-link">Become Volunteer</button>
              <button className="footer-link">Partner NGO</button>
              <button className="footer-link">Success Stories</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2024 Food For Hungry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
