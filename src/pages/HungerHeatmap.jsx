import React from 'react';
import { Map, AlertCircle, Utensils } from 'lucide-react';

const HungerHeatmap = () => {
  return (
    <div className="container mt-12 mb-20 flex flex-col" style={{ height: '80vh' }}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Live Hunger Heatmap</h2>
        <p className="text-muted">Real-time visualization of food requests vs active donors.</p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden relative shadow-lg border-2" style={{ backgroundColor: '#e2e8f0', borderColor: 'var(--border)' }}>
        {/* Placeholder for actual Google Maps / Leaflet Map */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/City_map_blank.svg/1024px-City_map_blank.svg.png" className="w-full h-full object-cover" alt="Map Background" style={{ filter: 'grayscale(100%)' }} />
        </div>

        {/* Heatmap Overlay Markers */}
        <div className="absolute top-1/4 left-1/4">
          <div className="w-32 h-32 bg-red-500 rounded-full blur-2xl opacity-40 absolute -top-16 -left-16"></div>
          <div className="relative card p-2 flex items-center gap-2 z-10 shadow-lg text-sm font-bold" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
            <AlertCircle size={16}/> High Need Area (45 Requests)
          </div>
        </div>

        <div className="absolute top-1/2 right-1/3">
          <div className="w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-40 absolute -top-12 -left-12"></div>
          <div className="relative card p-2 flex items-center gap-2 z-10 shadow-lg text-sm font-bold" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', color: '#15803d' }}>
            <Utensils size={16}/> High Donor Activity
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/2">
          <div className="w-48 h-48 bg-red-500 rounded-full blur-3xl opacity-50 absolute -top-24 -left-24"></div>
          <div className="relative card p-2 flex items-center gap-2 z-10 shadow-lg text-sm font-bold" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
            <AlertCircle size={16}/> Critical Shortage (No NGOs Nearby)
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="card p-3 shadow-lg hover:bg-gray-50 transition"><Map size={24}/></button>
        </div>

        {/* Legend */}
        <div className="absolute top-6 right-6 card shadow-lg p-4 bg-white/90 backdrop-blur">
          <h4 className="font-bold mb-3 text-sm">Heatmap Legend</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-red-500 opacity-70"></div>
            <span className="text-sm">High Food Requests</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-green-500 opacity-70"></div>
            <span className="text-sm">High Donor Surplus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500 opacity-70"></div>
            <span className="text-sm">NGO/Trust Hubs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HungerHeatmap;
