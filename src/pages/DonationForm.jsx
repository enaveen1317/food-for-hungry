import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertTriangle, Truck, MapPin, Package, Phone } from 'lucide-react';

const DonationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState('Fresh');
  const [needVolunteer, setNeedVolunteer] = useState(true);

  if (submitted) {
    return (
      <div className="container mt-12 text-center max-w-2xl mx-auto">
        <div className="card flex flex-col items-center gap-4" style={{ padding: '4rem 2rem' }}>
          <CheckCircle size={64} className="text-primary" />
          <h2 className="text-3xl font-bold">Donation Request Posted!</h2>
          <p className="text-muted text-lg">Your food details have been uploaded. Nearby volunteers and NGOs have been instantly notified via our Smart Rescue system.</p>
          <button className="btn btn-primary mt-6" onClick={() => setSubmitted(false)}>Post Another Donation</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-12 mb-20 max-w-3xl mx-auto">
      <div className="card glass-panel" style={{ padding: '3rem 2rem' }}>
        <h2 className="text-3xl font-bold mb-2">Donate Surplus Food</h2>
        <p className="text-muted mb-8">Quickly add food details to rescue meals and feed the hungry.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group mb-0">
              <label className="form-label">Food Type / Description</label>
              <input type="text" className="form-input" placeholder="e.g., 50 boxes of Rice & Curry" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Dietary Type</label>
              <select className="form-input">
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Mixed (Both)</option>
                <option>Vegan</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group mb-0">
              <label className="form-label">Quantity</label>
              <input type="text" className="form-input" placeholder="e.g., 20 kg or 50 people" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Packaging Status</label>
              <select className="form-input">
                <option>Already packed in boxes</option>
                <option>In large containers (Needs packing)</option>
                <option>Raw / Uncooked ingredients</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><Clock size={16}/> Prepared Time</label>
              <input type="time" className="form-input" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><AlertTriangle size={16}/> Usable Until (Expiry)</label>
              <input type="time" className="form-input" required />
            </div>
          </div>

          {/* Smart Food Priority System */}
          <div className="mb-8 p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
            <label className="form-label mb-3">Smart Food Priority (AI Assist)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Urgent', 'Fresh', 'Dry Food', 'Bulk Donation'].map(p => (
                <div 
                  key={p} 
                  onClick={() => setPriority(p)}
                  className={`text-center py-2 px-3 rounded-lg cursor-pointer text-sm font-bold border transition ${priority === p ? 'bg-primary text-white border-primary' : 'bg-surface text-muted border-border hover:border-primary'}`}
                >
                  {p}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              {priority === 'Urgent' && 'Urgent: Needs to be delivered within 1 hour to prevent spoilage.'}
              {priority === 'Fresh' && 'Fresh: Cooked food, safe for delivery within 3-4 hours.'}
              {priority === 'Dry Food' && 'Dry Food: Packaged or dry goods, safe for longer periods.'}
              {priority === 'Bulk Donation' && 'Bulk: Requires large transport, schedule a specific slot.'}
            </p>
          </div>

          <div className="mb-6">
            <label className="form-label">Upload Food Image (Required for Quality Verification)</label>
            <div className="border-2 border-dashed p-8 text-center rounded-lg cursor-pointer transition border-border hover:border-primary bg-surface">
              <Upload size={32} className="mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">Click or drag & drop photo here</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 mt-8 border-b border-border pb-2">Logistics & Contact</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><MapPin size={16}/> Pickup Address</label>
              <input type="text" className="form-input" placeholder="Full address or Google Maps link" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><Phone size={16}/> Contact Number</label>
              <input type="tel" className="form-input" placeholder="+91 9876543210" required />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg mb-8" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <div>
              <h4 className="font-bold flex items-center gap-2"><Truck size={18} className="text-secondary"/> Need Volunteer Pickup?</h4>
              <p className="text-sm text-muted">Turn off if you are delivering it directly to an NGO yourself.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={needVolunteer} onChange={() => setNeedVolunteer(!needVolunteer)} />
              <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none transition-colors ${needVolunteer ? 'bg-secondary' : 'bg-gray-300'}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${needVolunteer ? 'translate-x-full border-white' : ''}`}></div>
              </div>
            </label>
          </div>

          <button type="submit" className="btn btn-primary text-lg w-full py-4 shadow-lg">
            Post Donation Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
