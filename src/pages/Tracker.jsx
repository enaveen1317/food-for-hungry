import React from 'react';
import { Map, Navigation } from 'lucide-react';

const Tracker = () => {
  return (
    <div className="container mt-8 mb-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Live Delivery Tracking</h2>
      
      <div className="card glass-panel flex flex-col items-center justify-center" style={{ height: '400px', backgroundColor: '#e2e8f0' }}>
        <Map size={64} className="text-muted mb-4" />
        <p className="text-lg text-muted mb-4">Interactive Map View</p>
        <div className="badge badge-info flex items-center gap-1 text-sm">
          <Navigation size={14} /> Volunteer is 5 mins away
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="font-bold">Order #FC-8923</h4>
            <p className="text-muted text-sm">From: Grand Hotel &rarr; To: Hope Shelter</p>
          </div>
          <span className="badge badge-success">In Transit</span>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
