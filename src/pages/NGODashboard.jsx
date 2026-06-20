import React from 'react';
import { Package, Clock, Users, MapPin } from 'lucide-react';
import { activeDonations, emergencyRequests } from '../services/mockData';

const NGODashboard = () => {
  return (
    <div className="container mt-12 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold">NGO / Trust Dashboard</h2>
          <p className="text-muted">Welcome back, Hope Foundation!</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Verified Partner
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="card glass-panel flex flex-col items-center">
          <Package className="text-primary mb-2" size={32} />
          <h3 className="text-3xl font-bold">12</h3>
          <p className="text-muted text-sm text-center">Incoming Donations</p>
        </div>
        <div className="card glass-panel flex flex-col items-center">
          <MapPin className="text-secondary mb-2" size={32} />
          <h3 className="text-3xl font-bold">5</h3>
          <p className="text-muted text-sm text-center">Hunger Alerts Nearby</p>
        </div>
        <div className="card glass-panel flex flex-col items-center">
          <Clock className="text-blue-600 mb-2" size={32} />
          <h3 className="text-3xl font-bold">3</h3>
          <p className="text-muted text-sm text-center">Pending Pickups</p>
        </div>
        <div className="card glass-panel flex flex-col items-center">
          <Users className="text-purple-600 mb-2" size={32} />
          <h3 className="text-3xl font-bold">18</h3>
          <p className="text-muted text-sm text-center">Available Volunteers</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Package className="text-primary"/> Nearby Meal Rescues</h3>
          <div className="flex flex-col gap-4">
            {activeDonations.map(d => (
              <div key={d.id} className="card border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{d.donor}</h4>
                  <span className="badge badge-success text-xs">5km away</span>
                </div>
                <p className="text-sm text-muted mb-1">{d.type} - {d.quantity}</p>
                <div className="flex gap-2 mt-4">
                  <button className="btn btn-primary text-sm flex-1">Accept & Assign Volunteer</button>
                  <button className="btn btn-outline text-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-secondary"/> Emergency Hunger Alerts</h3>
          <div className="flex flex-col gap-4">
            {emergencyRequests.map(r => (
              <div key={r.id} className="card border-l-4" style={{ borderLeftColor: 'var(--secondary)' }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{r.organization}</h4>
                  <span className="badge badge-danger text-xs">{r.urgency}</span>
                </div>
                <p className="text-sm text-muted mb-1">Needs: {r.need}</p>
                <p className="text-sm text-muted mb-3"><MapPin size={12} className="inline"/> {r.location}</p>
                <button className="btn btn-secondary text-sm w-full">Fulfill Request</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
