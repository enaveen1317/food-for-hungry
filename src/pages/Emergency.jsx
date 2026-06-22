import React, { useState } from 'react';

const Emergency = () => {
  const [urgency, setUrgency] = useState('high');
  const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); setDone(true); setTimeout(() => setDone(false), 5000); };

  return (
    <div style={{ background:'#FFF5F5', padding:'96px 0' }} id="request">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag sec-tag-red">🙏 Request Food</div>
          <h2 className="sec-title">Request Food Support</h2>
          <p className="sec-sub">For families, shelters, orphanages, elderly homes, and communities in need. No bureaucracy — just help.</p>
        </div>

        {/* Banner */}
        <div style={{ background:'linear-gradient(135deg,var(--red),#EF4444)', borderRadius:20, padding:'28px 36px', marginBottom:32, color:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.18)', borderRadius:999, padding:'5px 14px', fontSize:'.78rem', fontWeight:700, marginBottom:12 }}>⏱️ Average response: 28 minutes</div>
            <h3 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.4rem', lineHeight:1.2, marginBottom:8 }}>We respond to urgent requests any time of day or night.</h3>
            <p style={{ opacity:.85, fontSize:'.88rem', maxWidth:500 }}>Our network of volunteers and NGOs is ready 24/7. Submit a request and we'll dispatch help as quickly as possible.</p>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Poppins', fontSize:'2.2rem', fontWeight:900 }}>24/7</div>
            <div style={{ fontSize:'.78rem', opacity:.8 }}>Always Available</div>
          </div>
        </div>

        {done && (
          <div className="mb-6" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:16, padding:'18px 22px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:'1.5rem' }}>✅</span>
            <div>
              <p className="poppins f-700 clr-green">Request submitted! Help is on the way.</p>
              <p className="text-sm clr-soft mt-1">Volunteers in your area have been alerted. Expect a call within 30 minutes.</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            {/* LEFT */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="form-sec">
                <div className="form-sec-head">🙏 Who Needs Food?</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" placeholder="Full name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization Name (if any)</label>
                    <input className="form-input" placeholder="Shelter name, orphanage, old-age home..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select">
                      <option>Individual / Family</option>
                      <option>Shelter / Orphanage</option>
                      <option>Old Age Home</option>
                      <option>Street Community</option>
                      <option>Flood / Disaster Relief</option>
                      <option>Hospital Ward</option>
                    </select>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div className="form-group">
                      <label className="form-label">Number of People *</label>
                      <input className="form-input" type="number" placeholder="e.g. 15" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Meal Type</label>
                      <select className="form-select">
                        <option>Any food available</option>
                        <option>Cooked meals only</option>
                        <option>Dry groceries</option>
                        <option>Baby food needed</option>
                        <option>Diabetic-friendly</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Urgency Level *</label>
                    <div className="chip-row">
                      {[['critical','🔴 Critical — Now'],['high','🟠 High — Today'],['medium','🟡 Medium — Flexible']].map(([v,l]) => (
                        <button key={v} type="button" className={`chip${urgency===v?' on chip-red':''}`} onClick={() => setUrgency(v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <input className="form-input" type="datetime-local" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-textarea" style={{ minHeight:90 }} placeholder="Dietary restrictions, accessibility needs, frequency of support needed..." />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="form-sec">
                <div className="form-sec-head">📍 Location & Contact</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Address *</label>
                    <textarea className="form-textarea" style={{ minHeight:90 }} placeholder="House number, street, area, city..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input className="form-input" placeholder="Near temple, school, junction..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input className="form-input" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alt. Contact (optional)</label>
                    <input className="form-input" type="tel" placeholder="Backup number" />
                  </div>
                </div>
              </div>

              {/* SOS card */}
              <div style={{ background:'var(--red-soft)', border:'1.5px solid var(--red-mid)', borderRadius:16, padding:22 }}>
                <p className="poppins f-700 clr-red mb-2">⚡ Use SOS for Critical Needs</p>
                <p className="text-sm clr-soft mb-4">SOS requests are flagged as highest priority and dispatched within 30 minutes, regardless of time.</p>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ flex:1, background:'#fff', borderRadius:12, padding:'12px 14px', border:'1px solid var(--red-mid)' }}>
                    <p className="poppins f-700 text-xl clr-red mb-1">28 min</p>
                    <p className="text-xs clr-soft">Avg SOS response</p>
                  </div>
                  <div style={{ flex:1, background:'#fff', borderRadius:12, padding:'12px 14px', border:'1px solid var(--red-mid)' }}>
                    <p className="poppins f-700 text-xl clr-red mb-1">24 / 7</p>
                    <p className="text-xs clr-soft">SOS always active</p>
                  </div>
                </div>
              </div>

              {/* Assurance */}
              <div style={{ background:'var(--g-soft)', border:'1px solid #BBF7D0', borderRadius:16, padding:20 }}>
                <p className="poppins f-700 clr-green mb-3">🔒 Your Privacy Matters</p>
                {['Your data is only shared with assigned volunteer / NGO','We never publicize beneficiary information','All partners are background-verified','You can withdraw a request at any time'].map(t => (
                  <div key={t} className="flex items-s gap-2 mb-2">
                    <span className="clr-green" style={{ marginTop:2 }}>✓</span>
                    <p className="text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div style={{ background:'#fff', borderRadius:16, padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--sh-md)', border:'1px solid #EEF2F7', marginTop:8, flexWrap:'wrap', gap:12 }}>
            <div>
              <p className="poppins f-700">We'll respond as fast as possible.</p>
              <p className="text-sm clr-soft mt-1">All requests are reviewed by a real person. No automated rejections.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" className="btn btn-outline">Save for Later</button>
              <button type="submit" className="btn btn-red btn-lg">🆘 Submit Request →</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Emergency;
