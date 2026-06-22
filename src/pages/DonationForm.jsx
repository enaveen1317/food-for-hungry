import React, { useState } from 'react';

const DonationForm = () => {
  const [veg, setVeg] = useState('veg');
  const [temp, setTemp] = useState('hot');
  const [volunteerNeeded, setVolunteerNeeded] = useState(true);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => setDone(false), 6000);
  };

  return (
    <div style={{ background:'var(--beige)', padding:'80px 0', minHeight:'100vh' }} id="donate">
      <div className="wrap">

        {/* Header */}
        <div style={{ maxWidth:600, marginBottom:40 }}>
          <span className="sec-kicker">Donate Food</span>
          <h2 style={{ fontSize:'1.65rem', marginBottom:10 }}>Share your surplus food</h2>
          <p className="cs" style={{ fontSize:'.93rem', lineHeight:1.75 }}>
            Leftover food from a wedding, hotel, home kitchen, or event? It takes under 2 minutes to list it. We coordinate pickup and delivery — you just need to keep the food ready.
          </p>
        </div>

        {done && (
          <div style={{ background:'var(--green-tint)', border:'1px solid var(--green-soft)', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
            <span style={{ fontSize:'1.4rem' }}>🎉</span>
            <div>
              <p className="f700 sm cg">Your food has been listed — thank you!</p>
              <p className="xs cs mt2">Nearby NGOs and volunteers have been notified. Someone will be in touch shortly.</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

            {/* LEFT COLUMN */}
            <div>
              {/* Food details */}
              <div className="form-block">
                <div className="form-block-title">🍛 What food do you have?</div>

                <div className="form-gr">
                  <label className="form-lbl">Food name or description *</label>
                  <input className="form-inp" placeholder="e.g. Rice and dal, Wedding feast leftovers, Hotel breakfast surplus" required />
                  <span className="form-hint">Be specific — helps volunteers identify it quickly</span>
                </div>

                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Food category</label>
                    <select className="form-sel">
                      <option>Cooked meals</option>
                      <option>Bakery / Bread</option>
                      <option>Raw groceries</option>
                      <option>Packed / sealed</option>
                      <option>Fruits / Vegetables</option>
                      <option>Event / Catering surplus</option>
                    </select>
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Quantity *</label>
                    <input className="form-inp" placeholder="e.g. 5 kg, 20 plates, 3 boxes" required />
                  </div>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Veg or non-veg?</label>
                  <div className="chip-set">
                    {[['veg','🌿 Vegetarian'],['nonveg','🍗 Non-Veg'],['mixed','🍱 Mixed'],['vegan','🌱 Vegan']].map(([v,l]) => (
                      <span key={v} className={`chip-item${veg===v?' on':''}`} onClick={() => setVeg(v)}>{l}</span>
                    ))}
                  </div>
                </div>

                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Serves how many people?</label>
                    <input className="form-inp" type="number" placeholder="~20 people" />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Donor type</label>
                    <select className="form-sel">
                      <option>Home / Individual</option>
                      <option>Restaurant</option>
                      <option>Hotel</option>
                      <option>Wedding / Event</option>
                      <option>Catering company</option>
                      <option>Community kitchen</option>
                    </select>
                  </div>
                </div>

                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Prepared at <span className="form-lbl-hint">(time)</span></label>
                    <input className="form-inp" type="datetime-local" required />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Best before <span className="form-lbl-hint">(approx)</span></label>
                    <input className="form-inp" type="datetime-local" required />
                  </div>
                </div>
              </div>

              {/* Packaging + safety */}
              <div className="form-block">
                <div className="form-block-title">🛡️ Packaging &amp; safety</div>

                <div className="form-gr">
                  <label className="form-lbl">Packaging status</label>
                  <select className="form-sel">
                    <option>Properly sealed and labelled</option>
                    <option>Covered but not sealed</option>
                    <option>Loosely packed — volunteer may need containers</option>
                    <option>Not packed yet — needs help</option>
                  </select>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Food temperature</label>
                  <div className="chip-set">
                    {[['hot','🔥 Hot / freshly cooked'],['room','🌡️ Room temperature'],['cold','❄️ Refrigerated']].map(([v,l]) => (
                      <span key={v} className={`chip-item${temp===v?' on':''}`} onClick={() => setTemp(v)}>{l}</span>
                    ))}
                  </div>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Upload a food photo <span className="form-lbl-hint">(optional but helpful)</span></label>
                  <div className="upload-area">
                    <div style={{ fontSize:'2rem', marginBottom:8 }}>📷</div>
                    <p className="sm f600" style={{ marginBottom:4 }}>Click to upload a photo</p>
                    <p className="xs cs">Helps volunteers identify the food when they arrive. PNG or JPG, under 10 MB.</p>
                  </div>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Notes for the volunteer</label>
                  <textarea className="form-ta" placeholder="Any special handling notes — allergy info, gate access, how the food is stored, anything else they should know..." />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Pickup details */}
              <div className="form-block">
                <div className="form-block-title">📍 Pickup details</div>

                <div className="form-gr">
                  <label className="form-lbl">Pickup address *</label>
                  <textarea className="form-ta" style={{ minHeight:80 }} placeholder="House / flat number, street, area — be as clear as possible" required />
                </div>
                <div className="form-gr">
                  <label className="form-lbl">Landmark <span className="form-lbl-hint">(helps volunteer find you)</span></label>
                  <input className="form-inp" placeholder="Near SBOA School / Opposite SBI ATM / Behind the park..." />
                </div>
                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Your name *</label>
                    <input className="form-inp" placeholder="Contact person name" required />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Contact number *</label>
                    <input className="form-inp" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                </div>
                <div className="form-row2">
                  <div className="form-gr">
                    <label className="form-lbl">Pickup available from</label>
                    <input className="form-inp" type="time" defaultValue="18:00" />
                  </div>
                  <div className="form-gr">
                    <label className="form-lbl">Pickup available until</label>
                    <input className="form-inp" type="time" defaultValue="21:30" />
                  </div>
                </div>
                <p className="form-hint">Volunteer will arrive within this window. Give a reasonable time margin.</p>
              </div>

              {/* Logistics */}
              <div className="form-block">
                <div className="form-block-title">🚴 Logistics</div>

                <div className="flex ic jb" style={{ background:'var(--beige)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--border)', marginBottom:16 }}>
                  <div>
                    <p className="sm f700">I need a volunteer to come pick this up</p>
                    <p className="xs cs mt2">We'll assign a nearby volunteer to collect from your address</p>
                  </div>
                  <label className="sw">
                    <input type="checkbox" checked={volunteerNeeded} onChange={() => setVolunteerNeeded(!volunteerNeeded)} />
                    <span className="sw-track" />
                  </label>
                </div>

                <div className="form-gr">
                  <label className="form-lbl">Preferred NGO or shelter <span className="form-lbl-hint">(optional)</span></label>
                  <select className="form-sel">
                    <option>Any verified partner near me (recommended)</option>
                    <option>Feeding India Chennai</option>
                    <option>Annai Trust</option>
                    <option>Hope Foundation</option>
                    <option>No Food Waste NGO</option>
                  </select>
                  <span className="form-hint">Leave as recommended unless you have a preference</span>
                </div>
              </div>

              {/* Tips */}
              <div style={{ background:'var(--green-tint)', border:'1px solid var(--green-soft)', borderRadius:'var(--r-lg)', padding:20 }}>
                <p className="sm f700 cg mb-3">A few things that help</p>
                {[
                  'List food within 30 minutes of cooking — fresher is better',
                  'A clear photo helps volunteers identify the food when they arrive',
                  'If there\'s a gate or security, leave their number in the notes',
                  'Note any allergens — nuts, dairy, or gluten — if you know them',
                ].map(t => (
                  <div key={t} className="flex ib g2 mb-3">
                    <span className="cg" style={{ marginTop:2, flexShrink:0 }}>–</span>
                    <p className="sm cs">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit bar */}
          <div className="form-bar mt6">
            <div>
              <p className="f700 md">Ready to share your food?</p>
              <p className="xs cs mt2">Once submitted, nearby NGOs and volunteers are notified within seconds.</p>
            </div>
            <div className="flex g3">
              <button type="button" className="btn btn-outline">Save draft</button>
              <button type="submit" className="btn btn-green btn-lg">Submit donation →</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
