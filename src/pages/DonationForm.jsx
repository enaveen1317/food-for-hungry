import React, { useState } from 'react';

const DonationForm = () => {
  const [veg, setVeg] = useState('veg');
  const [temp, setTemp] = useState('hot');
  const [volunteerPickup, setVolunteerPickup] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => setDone(false), 5000);
  };

  return (
    <div style={{ background:'var(--cream)', padding:'96px 0' }} id="donate">
      <div className="wrap">
        {/* Header */}
        <div className="sec-head">
          <div className="sec-tag">🍱 Donate Food</div>
          <h2 className="sec-title">List Your Surplus Food</h2>
          <p className="sec-sub">Takes under 2 minutes. We handle the rest — pickup, delivery, and tracking.</p>
        </div>

        {done && (
          <div className="mb-6" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:16, padding:'18px 22px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:'1.5rem' }}>🎉</span>
            <div>
              <p className="poppins f-700 clr-green">Donation listed successfully!</p>
              <p className="text-sm clr-soft mt-1">Nearby NGOs and volunteers have been notified. Thank you for your generosity.</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

            {/* LEFT */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Food Details */}
              <div className="form-sec">
                <div className="form-sec-head">🍽️ Food Details</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Food Title *</label>
                    <input className="form-input" placeholder="e.g. Dal Makhani & Rice, Wedding Feast Leftovers" required />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-select">
                        <option>Select category</option>
                        <option>Cooked Meals</option>
                        <option>Raw Groceries</option>
                        <option>Bakery & Bread</option>
                        <option>Packed / Sealed Food</option>
                        <option>Fruits & Vegetables</option>
                        <option>Beverages</option>
                        <option>Event / Catering Surplus</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input className="form-input" placeholder="e.g. 5 kg, 20 plates, 3 boxes" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Food Type *</label>
                    <div className="chip-row">
                      {[['veg','🌿 Vegetarian'],['nonveg','🍗 Non-Veg'],['vegan','🌱 Vegan'],['any','🍱 Mixed']].map(([v,l]) => (
                        <button key={v} type="button" className={`chip${veg===v?' on':''}`} onClick={() => setVeg(v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Serves (people)</label>
                      <input className="form-input" type="number" placeholder="~20 people" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Donor Type</label>
                      <select className="form-select">
                        <option>Home / Individual</option>
                        <option>Restaurant</option>
                        <option>Hotel</option>
                        <option>Wedding / Event</option>
                        <option>Catering Company</option>
                        <option>Corporate</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Prepared At *</label>
                      <input className="form-input" type="datetime-local" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Best Before *</label>
                      <input className="form-input" type="datetime-local" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="form-sec">
                <div className="form-sec-head">🛡️ Safety & Packaging</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Packaging Status *</label>
                    <select className="form-select">
                      <option>Properly sealed and labelled</option>
                      <option>Covered but not sealed</option>
                      <option>Loosely packed</option>
                      <option>Needs packaging help</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Food Temperature</label>
                    <div className="chip-row">
                      {[['hot','🔥 Hot / Freshly Cooked'],['room','🌡️ Room Temp'],['cold','❄️ Refrigerated']].map(([v,l]) => (
                        <button key={v} type="button" className={`chip${temp===v?' on':''}`} onClick={() => setTemp(v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Food Photo</label>
                    <div className="upload-zone">
                      <div style={{ fontSize:'2.5rem', marginBottom:10 }}>📷</div>
                      <p className="poppins f-600 text-sm clr-text mb-1">Click to upload food photo</p>
                      <p className="text-xs clr-soft">PNG, JPG up to 10MB — helps volunteers identify food quickly</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-textarea" placeholder="Any special handling instructions, allergy info, or context..." />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Pickup */}
              <div className="form-sec">
                <div className="form-sec-head">📍 Pickup Details</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Pickup Address *</label>
                    <textarea className="form-textarea" style={{ minHeight:90 }} placeholder="Full address with house / flat number, street, area..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input className="form-input" placeholder="Near temple, school, ATM, bus stop..." />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Contact Number *</label>
                      <input className="form-input" type="tel" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pickup Slot *</label>
                      <select className="form-select">
                        <option>As soon as possible</option>
                        <option>Within 1 hour</option>
                        <option>Within 2 hours</option>
                        <option>Specific time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="form-sec">
                <div className="form-sec-head">🚴 Logistics</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="flex items-c justify-b" style={{ background:'#F9FAFB', borderRadius:13, padding:'16px 18px', border:'1px solid var(--border)' }}>
                    <div>
                      <p className="poppins f-600 text-sm">Request Volunteer Pickup</p>
                      <p className="text-xs clr-soft mt-1">We arrange someone to collect food from you</p>
                    </div>
                    <label className="tog">
                      <input type="checkbox" checked={volunteerPickup} onChange={() => setVolunteerPickup(!volunteerPickup)} />
                      <span className="tog-track" />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred NGO / Shelter (optional)</label>
                    <select className="form-select">
                      <option>Any verified partner (recommended)</option>
                      <option>Feeding India Chennai</option>
                      <option>Annai Trust</option>
                      <option>Hope Foundation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tips card */}
              <div style={{ background:'var(--g-soft)', border:'1px solid #BBF7D0', borderRadius:16, padding:20 }}>
                <p className="poppins f-700 clr-green mb-3">💡 Donation Tips</p>
                {['List food within 30 min of cooking for best freshness','Include clear photos to speed up volunteer matching','Add allergy info if food contains nuts, dairy, or gluten','Scheduled restaurants can use Bulk/Auto-post feature'].map(t => (
                  <div key={t} className="flex items-s gap-2 mb-2">
                    <span className="clr-green" style={{ marginTop:2 }}>✓</span>
                    <p className="text-sm clr-text">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div style={{ background:'#fff', borderRadius:16, padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--sh-md)', border:'1px solid #EEF2F7', marginTop:8, flexWrap:'wrap', gap:12 }}>
            <div>
              <p className="poppins f-700">Ready to feed someone today?</p>
              <p className="text-sm clr-soft mt-1">Your donation will be matched with nearby NGOs or volunteers in minutes.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" className="btn btn-outline">Save Draft</button>
              <button type="submit" className="btn btn-primary btn-lg">Submit Donation →</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
