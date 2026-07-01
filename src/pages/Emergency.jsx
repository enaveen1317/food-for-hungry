import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Shield, MapPin, Phone, FileText, Users, Utensils, Zap, BookmarkIcon } from 'lucide-react';
import emergencyHeroBg from '../assets/emergency-hero-bg.png';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const Emergency = () => {
  const { t } = useLanguage();
  const { submitSOS } = useApp();

  const [name, setName]               = useState('');
  const [org, setOrg]                 = useState('');
  const [category, setCategory]       = useState('Individual / Family');
  const [peopleCount, setPeopleCount] = useState('');
  const [mealType, setMealType]       = useState('Any food');
  const [urgency, setUrgency]         = useState('high');
  const [preferredTime, setPreferredTime] = useState('');
  const [address, setAddress]         = useState('');
  const [landmark, setLandmark]       = useState('');
  const [phone, setPhone]             = useState('');
  const [notes, setNotes]             = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [saved, setSaved]             = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    submitSOS({ name, org, category, peopleCount, mealType, urgency, preferredTime, address, landmark, phone, notes });
    setSubmitted(true);
    setName(''); setOrg(''); setCategory('Individual / Family');
    setPeopleCount(''); setMealType('Any food'); setUrgency('high');
    setPreferredTime(''); setAddress(''); setLandmark('');
    setPhone(''); setNotes('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: '#FFF5F5', minHeight: '100vh', fontFamily: "'Inter','Poppins',sans-serif", paddingTop: '20px' }}>
      <style>{`
        @keyframes sos-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes sos-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes sos-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .sos-in { animation: sos-in 0.45s ease both; }
        .sos-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .sos-input:focus { outline: none; border-color: #DC2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.12) !important; }
        .sos-btn-danger:hover { background: #B91C1C !important; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(220,38,38,0.45) !important; }
        .sos-btn-secondary:hover { background: #F0FDF4 !important; border-color: #16A34A !important; transform: translateY(-2px); }
        .sos-chip:hover { transform: translateY(-1px); }
        .sos-card { transition: box-shadow 0.2s, transform 0.2s; }
        .sos-card:hover { box-shadow: 0 20px 50px rgba(16,24,40,0.12) !important; transform: translateY(-2px); }
        .sos-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px !important; }
      `}</style>

      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '48px 32px' }}>

        {/* ── HERO BANNER ───────────────────────────────────────── */}
        <div className="sos-in" style={{
          position: 'relative', borderRadius: '24px', overflow: 'hidden',
          marginBottom: '48px', minHeight: '260px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // Lighter shadow so the white space is clean
        }}>
          {/* Photo */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#B91C1C',
            backgroundImage: `url(${emergencyHeroBg})`,
            backgroundSize: '55% auto', // Decreased scale even further
            backgroundPosition: 'right 20%', 
            backgroundRepeat: 'no-repeat',
          }} />
          {/* Gradient overlay — strong left, fades right so faces show */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(185,28,28,1) 0%, rgba(185,28,28,0.95) 45%, rgba(185,28,28,0.7) 65%, transparent 100%)',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '16px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '800px', minHeight: '180px' }}>
            
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px', padding: '6px 12px', marginBottom: '20px', width: 'max-content'
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'white', background: '#EF4444', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                SOS
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>
                Emergency Food Request
              </span>
            </div>

            {/* Title */}
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: 'white', lineHeight: 1.25, marginBottom: '12px', letterSpacing: '-0.01em' }}>
              Request food support for families,<br />
              shelters, elderly homes, or communities in need.
            </h2>
            
            {/* Subtitle */}
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              We respond to urgent requests within 30 minutes. All requests are verified.
            </p>

            {/* Unified Stats Box */}
            <div style={{
              display: 'flex', alignItems: 'stretch',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px',
              padding: '16px 24px', width: 'max-content', gap: '32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              {/* Left Stat */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  <Clock size={32} color="#FCA5A5" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'white', fontWeight: 700, marginBottom: '2px' }}>Avg. Response Time</span>
                  <span style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: 'white', lineHeight: 1 }}>30 min</span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>

              {/* Right Stat */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  <Shield size={32} color="#86EFAC" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'white', fontWeight: 700, marginBottom: '2px' }}>All requests verified</span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>Your request is safe<br/>and confidential.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── SUCCESS TOAST ─────────────────────────────────────── */}
        {submitted && (
          <div className="sos-in" style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px',
            padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 4px 20px rgba(34,197,94,0.15)',
          }}>
            <CheckCircle size={26} color="#16A34A" />
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#14532D', fontSize: '0.95rem', marginBottom: '3px' }}>
                🙏 SOS Request Sent! Help is coming.
              </p>
              <p style={{ fontSize: '0.82rem', color: '#166534' }}>
                Nearby volunteers have been notified. You'll receive a call within 30 minutes.
              </p>
            </div>
          </div>
        )}

        {/* ── SAVED DRAFT TOAST ─────────────────────────────────── */}
        {saved && (
          <div className="sos-in" style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px',
            padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 4px 20px rgba(59,130,246,0.15)',
          }}>
            <BookmarkIcon size={26} color="#2563EB" />
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#1E3A8A', fontSize: '0.95rem', marginBottom: '3px' }}>
                💾 Request Saved
              </p>
              <p style={{ fontSize: '0.82rem', color: '#1E40AF' }}>
                Your request has been saved as a draft locally.
              </p>
            </div>
          </div>
        )}

        {/* ── FORM ──────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>

            {/* LEFT — Who Needs Food */}
            <div className="sos-card sos-in" style={{
              background: 'white', borderRadius: '20px', padding: '32px',
              border: '1px solid #EEF2F7', boxShadow: '0 10px 30px rgba(16,24,40,0.07)',
              animationDelay: '0.08s', display: 'flex', flexDirection: 'column',
            }}>
              <h3 style={{
                fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#0F172A',
                marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
              }}>
                🙏 Who Needs Food?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                {/* Requester Name */}
                <div>
                  <label style={lbl}>Requester Name *</label>
                  <input className="sos-input" style={inp} placeholder="Your full name" required value={name} onChange={e => setName(e.target.value)} />
                </div>

                {/* Organization */}
                <div>
                  <label style={lbl}>Organization (Optional)</label>
                  <input className="sos-input" style={inp} placeholder="Shelter, Orphanage, Old-age Home..." value={org} onChange={e => setOrg(e.target.value)} />
                </div>

                {/* Category */}
                <div>
                  <label style={lbl}>Category of Need *</label>
                  <input className="sos-input" style={inp} type="text" list="category-options" placeholder="Select or type..." value={category} onChange={e => setCategory(e.target.value)} required />
                  <datalist id="category-options">
                    <option value="🏠 Individual / Family" />
                    <option value="🏫 Shelter / Orphanage" />
                    <option value="👴 Old Age Home" />
                    <option value="🏘️ Street Community" />
                    <option value="🆘 Disaster Relief" />
                  </datalist>
                </div>

                {/* People + Meal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={lbl}>Number of People *</label>
                    <div style={{ position: 'relative' }}>
                      <Users size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input className="sos-input" style={{ ...inp, paddingLeft: '36px' }} type="number" list="people-options" placeholder="e.g. 10" required value={peopleCount} onChange={e => setPeopleCount(e.target.value)} />
                      <datalist id="people-options">
                        <option value="5" />
                        <option value="10" />
                        <option value="20" />
                        <option value="50" />
                        <option value="100" />
                        <option value="500" />
                      </datalist>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Meal Type</label>
                    <div style={{ position: 'relative' }}>
                      <Utensils size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input className="sos-input" style={{ ...inp, paddingLeft: '36px' }} type="text" list="meal-type-options" placeholder="Select or type..." value={mealType} onChange={e => setMealType(e.target.value)} />
                      <datalist id="meal-type-options">
                        <option value="Any food" />
                        <option value="Cooked Meal" />
                        <option value="Dry Groceries" />
                        <option value="Baby Food" />
                      </datalist>
                    </div>
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label style={lbl}>Urgency Level *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                      { id: 'critical', label: '🔴 Critical', active: { bg: '#FEF2F2', border: '#DC2626', color: '#DC2626' } },
                      { id: 'high',     label: '⚡ High',     active: { bg: '#FFF7ED', border: '#F97316', color: '#EA580C' } },
                      { id: 'medium',   label: '🟡 Medium',   active: { bg: '#FEFCE8', border: '#EAB308', color: '#CA8A04' } },
                    ].map(u => {
                      const isActive = urgency === u.id;
                      return (
                        <button key={u.id} type="button" className="sos-chip" onClick={() => setUrgency(u.id)} style={{
                          flex: 1, padding: '9px 6px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
                          fontFamily: 'Poppins', transition: 'all 0.2s',
                          border: `1.5px solid ${isActive ? u.active.border : '#E5E7EB'}`,
                          background: isActive ? u.active.bg : 'white',
                          color: isActive ? u.active.color : '#6B7280',
                          boxShadow: isActive ? `0 3px 12px ${u.active.border}30` : 'none',
                        }}>
                          {u.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Time */}
                <div>
                  <label style={lbl}>Preferred Time</label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input className="sos-input" style={{ ...inp, paddingLeft: '36px' }} type="time" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Location & Contact */}
            <div className="sos-card sos-in" style={{
              background: 'white', borderRadius: '20px', padding: '32px',
              border: '1px solid #EEF2F7', boxShadow: '0 10px 30px rgba(16,24,40,0.07)',
              animationDelay: '0.14s', display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              <h3 style={{
                fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#0F172A',
                paddingBottom: '16px', borderBottom: '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                📍 Location & Contact
              </h3>

              {/* Landmark */}
              <div>
                <label style={lbl}>Landmark</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input className="sos-input" style={{ ...inp, paddingLeft: '36px' }} placeholder="Near temple, school, bus stop..." value={landmark} onChange={e => setLandmark(e.target.value)} />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label style={lbl}>Full Address *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '13px', pointerEvents: 'none' }} />
                  <textarea className="sos-input" style={{ ...inp, paddingLeft: '36px', minHeight: '64px', resize: 'none' }} placeholder="House no., street, area..." required value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={lbl}>Contact Phone *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input className="sos-input" style={{ ...inp, paddingLeft: '36px' }} type="tel" placeholder="+91 98765 43210" required value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={lbl}>Additional Notes</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '13px', pointerEvents: 'none' }} />
                  <textarea className="sos-input" style={{ ...inp, paddingLeft: '36px', minHeight: '64px', resize: 'none' }} placeholder="Any additional details that will help us serve you better..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              {/* SOS Alert Box */}
              <div style={{
                background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '14px', padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: 'auto',
              }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <Zap size={15} color="#DC2626" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#DC2626', fontSize: '0.88rem', marginBottom: '3px' }}>
                    ⚡ Urgent? Use SOS Mode
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#991B1B', lineHeight: 1.5 }}>
                    SOS requests get priority and are dispatched within 30 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SUBMIT BAR ────────────────────────────────────────── */}
          <div className="sos-in" style={{
            background: 'white', borderRadius: '18px', padding: '20px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(16,24,40,0.08)', border: '1px solid #EEF2F7',
            flexWrap: 'wrap', gap: '14px', animationDelay: '0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={20} color="#16A34A" />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                  Submitting this request?
                </p>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>
                  Our team will verify and dispatch help as soon as possible.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" className="sos-btn-secondary" onClick={handleSaveDraft} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '12px',
                border: '2px solid #16A34A', background: 'white',
                color: '#16A34A', fontFamily: 'Poppins', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <BookmarkIcon size={16} /> Save Request
              </button>
              <button type="submit" className="sos-btn-danger" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                background: '#DC2626', color: 'white',
                fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 8px 25px rgba(220,38,38,0.35)',
              }}>
                🆘 Send SOS Request <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shared styles
const inp = {
  width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px',
  padding: '11px 14px', fontSize: '0.88rem', color: '#1E293B',
  background: 'white', fontFamily: "'Inter','Poppins',sans-serif",
  boxSizing: 'border-box', display: 'block',
};
const lbl = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151',
  marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default Emergency;
