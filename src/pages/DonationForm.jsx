import React, { useState } from 'react';
import { Upload, Mic, Camera, MapPin, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const DonationForm = () => {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState('');

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const steps = [
    { num: 1, label: 'Food Info' },
    { num: 2, label: 'Freshness' },
    { num: 3, label: 'Pickup' },
    { num: 4, label: 'Packaging' },
    { num: 5, label: 'Review' }
  ];

  const estimatedPeople = qty ? Math.floor(parseInt(qty) * 2.5) : 0;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(220, 252, 231, 0.9) 100%), url('/hero-bg.jpg') no-repeat center center",
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      padding: '80px 0',
      minHeight: '100vh'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div className="section-tag">📦 List Surplus</div>
          <h2 className="section-title">Rescue Your Food</h2>
          <p className="section-sub">Join thousands of donors fighting hunger. It takes just 2 minutes to list your surplus.</p>
        </div>

        {/* Stepper */}
        <div className="stepper-container">
          {steps.map(s => (
            <div key={s.num} className={`stepper-step ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
              <div className="stepper-circle">{step > s.num ? '✓' : s.num}</div>
              <span className="stepper-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="card" style={{ padding: '40px' }}>
          {step === 1 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>What are you donating?</h3>
              
              <div className="form-group">
                <label className="form-label">Food Title <span style={{ color: 'var(--red-sos)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="e.g. Leftover Wedding Meals (Rice & Curry)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select className="form-input">
                    <option>Cooked Meals</option>
                    <option>Raw Ingredients</option>
                    <option>Baked Goods / Bread</option>
                    <option>Packaged Food</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity (kg/portions)</label>
                  <input type="number" className="form-input" placeholder="e.g. 20" value={qty} onChange={e => setQty(e.target.value)} />
                </div>
              </div>

              {qty && parseInt(qty) > 0 && (
                <div style={{ background: 'var(--green-mint)', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.5rem' }}>❤️</div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)' }}>Estimated Impact</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--green-primary)', fontWeight: 600 }}>This donation can serve approximately {estimatedPeople} people.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Freshness & Quality</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Time Prepared</label>
                  <input type="time" className="form-input" defaultValue="14:00" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Best Before</label>
                  <input type="time" className="form-input" defaultValue="20:00" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Current Storage Condition</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary btn-sm active" style={{ flex: 1 }}>Hot / Warm</button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, borderColor: 'var(--border)', color: 'var(--text-soft)', background: '#F8FAFC' }}>Room Temp</button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, borderColor: 'var(--border)', color: 'var(--text-soft)', background: '#F8FAFC' }}>Refrigerated</button>
                </div>
              </div>

              <div style={{ background: '#FFF7ED', border: '1px solid var(--orange-light)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle color="var(--orange)" size={20} style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>Priority Pickup Recommended</p>
                  <p style={{ fontSize: '0.8rem', color: '#C2410C', marginTop: '4px' }}>Cooked meals kept warm should be distributed within 4 hours of preparation.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Pickup Details</h3>
              
              <div className="form-group">
                <label className="form-label">Pickup Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="form-input" placeholder="Search address..." style={{ paddingLeft: '40px' }} />
                  <MapPin size={18} color="var(--text-soft)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
                </div>
                <div style={{ height: '120px', background: '#E2E8F0', borderRadius: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 600 }}>🗺️ Location Preview Loaded</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input type="tel" className="form-input" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Window</label>
                  <select className="form-input">
                    <option>Next 1 Hour</option>
                    <option>Next 2 Hours</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Packaging & Proof</h3>
              
              <div className="form-group">
                <label className="form-label">Food Photo (For AI Quality Check)</label>
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer', transition: 'var(--transition)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)' }}>
                    <Camera size={24} color="var(--green-primary)" />
                  </div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>Click to upload food photo</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '6px' }}>Show packaging clearly for faster NGO approval.</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Packaging Type</label>
                <select className="form-input">
                  <option>Packed in individual boxes</option>
                  <option>Bulk containers (needs serving)</option>
                  <option>Loose / requires packaging</option>
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={32} color="var(--green-primary)" />
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.6rem', fontWeight: 800 }}>Ready to Rescue!</h3>
                <p style={{ color: 'var(--text-soft)' }}>Review your details before dispatching to our network.</p>
              </div>
              
              <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Food Type</span>
                  <span style={{ fontWeight: 600 }}>Wedding Meals (Cooked)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Quantity</span>
                  <span style={{ fontWeight: 600 }}>20 Portions</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Pickup Area</span>
                  <span style={{ fontWeight: 600 }}>Anna Nagar, Chennai</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Estimated Impact</span>
                  <span style={{ fontWeight: 700, color: 'var(--green-primary)' }}>~50 Meals Rescued</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--blue-soft)', padding: '16px', borderRadius: '12px', color: '#1E40AF', fontSize: '0.85rem', marginBottom: '24px' }}>
                <AlertCircle size={20} />
                <span>By submitting, you confirm the food is safe for human consumption and was handled safely.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button className="btn btn-primary" onClick={nextStep}>Next Step <ArrowRight size={18} /></button>
            ) : (
              <button className="btn btn-primary" onClick={() => alert('Donation Submitted to the Network!')}>Confirm & Dispatch</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
