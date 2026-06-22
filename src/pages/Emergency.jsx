import React, { useState } from 'react';

const Emergency = () => {
  const [urgency, setUrgency] = useState('high');
  const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); setDone(true); setTimeout(() => setDone(false), 6000); };

  return (
    <div style={{ background:'var(--beige)', padding:'80px 0' }} id="request">
      <div className="wrap">
        <div style={{ maxWidth:620, marginBottom:40 }}>
          <span className="sec-kicker sec-kicker-orange">Request support</span>
          <h2 style={{ fontSize:'1.65rem', marginBottom:10 }}>Request meal support for a family, shelter, elderly home, or community group</h2>
          <p className="cs" style={{ fontSize:'.93rem', lineHeight:1.75 }}>
            No paperwork. No verification delay for emergencies. Tell us who needs food, where, and when — we take care of the rest. All requests are read by a real person.
          </p>
        </div>

        {/* Response time banner */}
        <div style={{ background:'#FFF3E0', border:'1px solid #FDDCB5', borderRadius:'var(--r-lg)', padding:'18px 22px', marginBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div className="flex ic g3">
            <span style={{ fontSize:'1.5rem' }}>⏱️</span>
            <div>
              <p className="sm f700">Average response: 28 minutes for urgent requests</p>
              <p className="xs cs mt2">Our team and volunteers are active from 6 AM to 11 PM. SOS requests are handled any time.</p>
            </div>
          </div>
          <span style={{ fontSize:'.78rem', fontWeight:700, color:'var(--orange)', background:'var(--orange-tint)', padding:'4px 12px', borderRadius:999, border:'1px solid #FDDCB5' }}>24 / 7 for SOS</span>
        </div>

        {done && (
          <div style={{ background:'var(--green-tint)', border:'1px solid var(--green-soft)', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
            <span style={{ fontSize:'1.4rem' }}>✅</span>
            <div>
              <p className="f700 sm cg">Request received — we'll reach out soon</p>
              <p className="xs cs mt2">If it's urgent, a volunteer or NGO partner will call you within 30 minutes.</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {/* LEFT */}
            <div>
              <div className="form-block">
                <div className="form-block-title">🙏 Who needs food?</div>

                <div className="form-gr">
                  <label className="form-lbl">Your name *</label>
                  <input className="form-inp" placeholder="Full name" required />
                </div>
                <div className="form-gr">
                  <label className="form-lbl">Organization name <span className="form-lbl-hint">(if applicable)</span></label>
                  <input className="form-inp" placeholder="Shelter name, orphanage, old age home, community..." />
                </div>
                <div className="form-gr">
                  <label className="form-lbl">Who is this for? *</label>
                  <select className="form-sel">
                    <option>Individual or family</option>
                    <option>Children's shelter / Orphanage</option>
                    <option>Elderly home</option>
                    <option>Women's shelter</option>
                    <option>Night shelter for homeless</option>
                    <option>Migrant or construction workers</option>
                    <option>Flood or disaster relief</option>
                    <option>Street community</option>
                  </select>
                </div>
                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Number of people *</label>
                    <input className="form-inp" type="number" placeholder="e.g. 15" required />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Meal type needed</label>
                    <select className="form-sel">
                      <option>Any food available</option>
                      <option>Cooked meals only</option>
                      <option>Dry groceries / rations</option>
                      <option>Baby food / infant needs</option>
                      <option>Soft food (elderly)</option>
                      <option>Diabetic-friendly</option>
                    </select>
                  </div>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">How urgent is this? *</label>
                  <div className="chip-set">
                    <span className={`chip-item${urgency==='critical'?' on on-red':''}`} onClick={() => setUrgency('critical')}>🔴 Need food tonight</span>
                    <span className={`chip-item${urgency==='high'?' on on-orange':''}`} onClick={() => setUrgency('high')}>🟠 Need food today</span>
                    <span className={`chip-item${urgency==='medium'?' on':''}`} onClick={() => setUrgency('medium')}>🟡 Flexible timing</span>
                  </div>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">When is food needed?</label>
                  <input className="form-inp" type="datetime-local" />
                  <span className="form-hint">Leave blank if flexible or ongoing</span>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Any other notes?</label>
                  <textarea className="form-ta" style={{ minHeight:90 }} placeholder="Dietary restrictions, accessibility, frequency of need, specific meal preferences, anything else we should know..." />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="form-block">
                <div className="form-block-title">📍 Where &amp; how to reach you</div>

                <div className="form-gr">
                  <label className="form-lbl">Full address *</label>
                  <textarea className="form-ta" style={{ minHeight:80 }} placeholder="House / flat number, street, area, city..." required />
                </div>
                <div className="form-gr">
                  <label className="form-lbl">Landmark <span className="form-lbl-hint">(makes it easier to find)</span></label>
                  <input className="form-inp" placeholder="Near temple, school, junction, bus stop..." />
                </div>
                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Contact phone *</label>
                    <input className="form-inp" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Alt. contact <span className="form-lbl-hint">(optional)</span></label>
                    <input className="form-inp" type="tel" placeholder="Backup number" />
                  </div>
                </div>
              </div>

              {/* Privacy assurance */}
              <div style={{ background:'var(--green-tint)', border:'1px solid var(--green-soft)', borderRadius:'var(--r-lg)', padding:20, marginBottom:18 }}>
                <p className="sm f700 cg mb-3">Your information stays private</p>
                {[
                  'Only the assigned volunteer or NGO sees your contact details',
                  'We never share beneficiary information publicly',
                  'All partners are background-verified before joining our network',
                  'You can withdraw or update a request at any time',
                ].map(t => (
                  <div key={t} className="flex ib g2 mb-2">
                    <span className="cg xs" style={{ marginTop:2, flexShrink:0 }}>✓</span>
                    <p className="sm cs">{t}</p>
                  </div>
                ))}
              </div>

              {/* SOS callout */}
              {urgency === 'critical' && (
                <div style={{ background:'var(--red-soft)', border:'1px solid var(--red-tint)', borderRadius:'var(--r-lg)', padding:18 }}>
                  <p className="sm f700 cr mb-2">⚡ This will be flagged as an SOS request</p>
                  <p className="xs cs mb-3">SOS requests get immediate priority. Our team will call you within 30 minutes, day or night.</p>
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ flex:1, background:'#fff', borderRadius:10, padding:'10px 12px', border:'1px solid var(--red-tint)', textAlign:'center' }}>
                      <p className="pops f700 xl cr">28 min</p>
                      <p className="xs cs mt1">Avg SOS response</p>
                    </div>
                    <div style={{ flex:1, background:'#fff', borderRadius:10, padding:'10px 12px', border:'1px solid var(--red-tint)', textAlign:'center' }}>
                      <p className="pops f700 xl cr">24 / 7</p>
                      <p className="xs cs mt1">Always active</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit bar */}
          <div className="form-bar mt6">
            <div>
              <p className="f700 md">We'll respond as quickly as we can.</p>
              <p className="xs cs mt2">Every request is read by a real person — no automated rejections.</p>
            </div>
            <div className="flex g3">
              <button type="button" className="btn btn-outline">Save for later</button>
              <button type="submit" className={`btn btn-lg ${urgency === 'critical' ? 'btn-red' : 'btn-clay'}`}>
                {urgency === 'critical' ? '🆘 Send SOS Request' : 'Submit Request →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Emergency;
