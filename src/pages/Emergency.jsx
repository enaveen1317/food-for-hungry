import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Emergency = () => {
  const [urgency, setUrgency] = useState('high');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ background: '#FFF5F5', padding: '80px 0' }}>
      <div className="container">
        <div style={{
          background: "linear-gradient(135deg, rgba(220, 38, 38, 0.92) 0%, rgba(153, 27, 27, 0.8) 100%), url('/request-bg.png') no-repeat center center",
          backgroundSize: 'cover',
          borderRadius: '24px',
          padding: '48px 40px',
          marginBottom: '40px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
              🆘 Emergency Food Request
            </div>
            <h2 style={{ fontFamily: 'Poppins', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Request food support for families, shelters, elderly homes, or communities in need.</h2>
            <p style={{ opacity: 0.85, fontSize: '0.95rem' }}>We respond to urgent requests within 30 minutes. All requests are verified.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>30 min</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Avg. Response Time</div>
          </div>
        </div>

        {submitted && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={24} color="var(--green-primary)" />
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)' }}>SOS Request Sent! Help is coming. 🙏</p>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.875rem' }}>Nearby volunteers have been notified. You'll receive a call within 30 minutes.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left — Need Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-section">
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  🙏 Who Needs Food?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Requester Name *</label>
                    <input className="form-input" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization (Optional)</label>
                    <input className="form-input" placeholder="Shelter, Orphanage, Old-age Home..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category of Need *</label>
                    <select className="form-select">
                      <option>Individual / Family</option>
                      <option>Shelter / Orphanage</option>
                      <option>Old Age Home</option>
                      <option>Street Community</option>
                      <option>Disaster Relief</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Number of People *</label>
                      <input className="form-input" type="number" placeholder="e.g. 10" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Meal Type</label>
                      <select className="form-select">
                        <option>Any food</option>
                        <option>Cooked Meal</option>
                        <option>Dry Groceries</option>
                        <option>Baby Food</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Urgency Level *</label>
                    <div className="chip-group">
                      <button type="button" className={`chip ${urgency === 'critical' ? 'active' : ''}`} style={urgency === 'critical' ? { borderColor: 'var(--red-sos)', color: 'var(--red-sos)', background: '#FEF2F2' } : {}} onClick={() => setUrgency('critical')}>🔴 Critical</button>
                      <button type="button" className={`chip chip-orange ${urgency === 'high' ? 'active' : ''}`} onClick={() => setUrgency('high')}>🟠 High</button>
                      <button type="button" className={`chip ${urgency === 'medium' ? 'active' : ''}`} onClick={() => setUrgency('medium')}>🟡 Medium</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <input className="form-input" type="datetime-local" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Location & Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-section">
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  📍 Location & Contact
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Address *</label>
                    <textarea className="form-input form-textarea" placeholder="House no., street, area..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input className="form-input" placeholder="Near temple, school, bus stop..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input className="form-input" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-input form-textarea" style={{ minHeight: '90px' }} placeholder="Any additional details that will help us serve you better..." />
                  </div>
                  {/* SOS highlight */}
                  <div style={{ background: '#FEF2F2', border: '1px solid var(--red-border)', borderRadius: '14px', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--red-sos)', marginBottom: '4px', fontSize: '0.95rem' }}>⚡ Urgent? Use SOS Mode</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>SOS requests get priority and are dispatched within 30 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Bar */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-md)', border: '1px solid #EEF2F7', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Submitting this request?</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>Our team will verify and dispatch help as soon as possible.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary">Save Request</button>
              <button type="submit" className="btn btn-danger btn-lg">
                🆘 Send SOS Request <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Emergency;
