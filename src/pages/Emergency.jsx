import React, { useState } from 'react';
import { AlertCircle, MapPin, Users, CheckCircle, Clock } from 'lucide-react';

const Emergency = () => {
  const [submitted, setSubmitted] = useState(false);
  const [urgency, setUrgency] = useState('High');

  if (submitted) {
    return (
      <div className="container mt-12 text-center max-w-2xl mx-auto">
        <div className="card flex flex-col items-center gap-4" style={{ padding: '4rem 2rem', borderColor: '#ef4444' }}>
          <CheckCircle size={64} style={{ color: '#ef4444' }} />
          <h2 className="text-3xl font-bold">Food Request Sent</h2>
          <p className="text-muted text-lg">Your request has been broadcasted to all nearby donors, restaurants, and volunteers. Help is on the way.</p>
          <button className="btn mt-6" style={{ backgroundColor: 'transparent', border: '2px solid #ef4444', color: '#ef4444' }} onClick={() => setSubmitted(false)}>
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-12 mb-20 max-w-3xl mx-auto">
      <div className="card glass-panel" style={{ padding: '3rem 2rem', borderTop: '4px solid #ef4444' }}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <AlertCircle size={32} style={{ color: '#ef4444' }} />
          Request Food Help
        </h2>
        <p className="text-muted mb-8">For shelters, orphanages, poor families, or anyone in immediate need of meals.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group mb-0">
              <label className="form-label">Name / Organization</label>
              <input type="text" className="form-input" placeholder="e.g., Hope Shelter or John Doe" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><Users size={16}/> Number of People</label>
              <input type="number" className="form-input" placeholder="e.g., 50" required />
            </div>
          </div>

          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
            <label className="form-label mb-3" style={{ color: '#991b1b' }}>Urgency Level</label>
            <div className="flex flex-wrap gap-4">
              {['Critical (Immediate)', 'High (Today)', 'Medium (Tomorrow)'].map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="urgency" 
                    checked={urgency === level} 
                    onChange={() => setUrgency(level)} 
                    style={{ accentColor: '#ef4444', width: '1.2rem', height: '1.2rem' }}
                  />
                  <span className="font-medium" style={{ color: '#7f1d1d' }}>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Food Type Needed (Optional)</label>
            <input type="text" className="form-input" placeholder="e.g., Rice, Bread, Cooked Meals, Baby Food" />
          </div>

          <h3 className="text-xl font-bold mb-4 mt-8 border-b pb-2">Delivery Details</h3>

          <div className="form-group mb-6">
            <label className="form-label flex items-center gap-2"><MapPin size={16}/> Delivery Address</label>
            <textarea className="form-input" rows="3" placeholder="Provide full address or landmark" required></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="form-group mb-0">
              <label className="form-label">Contact Person Number</label>
              <input type="tel" className="form-input" placeholder="+91 9876543210" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2"><Clock size={16}/> Delivery Notes</label>
              <input type="text" className="form-input" placeholder="e.g., Call before arriving" />
            </div>
          </div>

          <button type="submit" className="btn text-white text-lg w-full py-4 shadow-lg" style={{ backgroundColor: '#ef4444' }}>
            Broadcast Food Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Emergency;
