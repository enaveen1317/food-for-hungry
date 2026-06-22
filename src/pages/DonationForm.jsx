import React, { useState } from 'react';
import { ArrowRight, Upload, CheckCircle } from 'lucide-react';

const DonationForm = () => {
  const [veg, setVeg] = useState('veg');
  const [volunteerPickup, setVolunteerPickup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ background: 'var(--cream)', padding: '80px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">🍱 Food Donation</div>
          <h2 className="section-title">Share Your Surplus Food</h2>
          <p className="section-sub">Help us reduce food waste and feed families in need. Fill in the details below.</p>
        </div>

        {submitted && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px',
            padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <CheckCircle size={24} color="var(--green-primary)" />
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)' }}>Donation Submitted Successfully! 🎉</p>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.875rem' }}>Nearby NGOs and volunteers have been notified. Thank you!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-section">
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  🍽️ Food Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Food Title *</label>
                    <input className="form-input" placeholder="e.g. Dal Rice, Wedding Feast Leftovers" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Food Category *</label>
                    <select className="form-select">
                      <option>Select category</option>
                      <option>Cooked Meals</option>
                      <option>Raw Groceries</option>
                      <option>Bakery Items</option>
                      <option>Packed Food</option>
                      <option>Fruits & Vegetables</option>
                      <option>Beverages</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Food Type *</label>
                    <div className="chip-group">
                      <button type="button" className={`chip ${veg === 'veg' ? 'active' : ''}`} onClick={() => setVeg('veg')}>🌿 Vegetarian</button>
                      <button type="button" className={`chip chip-orange ${veg === 'nonveg' ? 'active' : ''}`} onClick={() => setVeg('nonveg')}>🍗 Non-Vegetarian</button>
                      <button type="button" className={`chip ${veg === 'vegan' ? 'active' : ''}`} onClick={() => setVeg('vegan')}>🌱 Vegan</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input className="form-input" placeholder="e.g. 5 kg, 20 plates" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">People Served</label>
                      <input className="form-input" type="number" placeholder="~20 people" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Prepared Time *</label>
                      <input className="form-input" type="datetime-local" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Best Before *</label>
                      <input className="form-input" type="datetime-local" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-section">
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  📍 Pickup & Contact
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Pickup Address *</label>
                    <textarea className="form-input form-textarea" placeholder="Full address with landmark..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number *</label>
                    <input className="form-input" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Packaging Status</label>
                    <select className="form-select">
                      <option>Properly packaged</option>
                      <option>Loosely covered</option>
                      <option>Needs packaging help</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Food Photo</label>
                    <div className="upload-box">
                      <Upload size={36} color="var(--text-soft)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>Click to upload food photo</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: '#F9FAFB', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem' }}>Request Volunteer Pickup</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>We'll arrange a volunteer to collect food</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={volunteerPickup} onChange={() => setVolunteerPickup(!volunteerPickup)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-input form-textarea" style={{ minHeight: '80px' }} placeholder="Any special instructions..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '20px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)', border: '1px solid #EEF2F7', marginTop: '8px'
          }}>
            <button type="button" className="btn btn-secondary">Save as Draft</button>
            <button type="submit" className="btn btn-primary btn-lg">
              Submit Donation <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
