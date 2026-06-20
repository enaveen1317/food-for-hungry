import React from 'react';
import { Users, CheckCircle, AlertTriangle, Building, MapPin, Activity } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container mt-12 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold">Global Admin Dashboard</h2>
          <p className="text-muted">System Overview & Analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
          <Users className="mx-auto text-primary mb-2" size={28}/>
          <h3 className="text-3xl font-bold">14,250</h3>
          <p className="text-sm text-muted uppercase tracking-wider mt-1">Total Donors</p>
        </div>
        <div className="card text-center" style={{ borderTop: '4px solid var(--secondary)' }}>
          <Activity className="mx-auto text-secondary mb-2" size={28}/>
          <h3 className="text-3xl font-bold">8,420</h3>
          <p className="text-sm text-muted uppercase tracking-wider mt-1">Food Requests</p>
        </div>
        <div className="card text-center" style={{ borderTop: '4px solid #2563eb' }}>
          <CheckCircle className="mx-auto text-blue-600 mb-2" size={28}/>
          <h3 className="text-3xl font-bold">7,890</h3>
          <p className="text-sm text-muted uppercase tracking-wider mt-1">Deliveries</p>
        </div>
        <div className="card text-center" style={{ borderTop: '4px solid #9333ea' }}>
          <Building className="mx-auto text-purple-600 mb-2" size={28}/>
          <h3 className="text-3xl font-bold">124</h3>
          <p className="text-sm text-muted uppercase tracking-wider mt-1">Active NGOs</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* City-wise Impact */}
        <div className="card glass-panel">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-primary"/> City-wise Impact</h3>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b text-muted" style={{ borderBottomColor: 'var(--border)' }}>
                <th className="pb-2">City</th>
                <th className="pb-2">Donations</th>
                <th className="pb-2">Meals Served</th>
              </tr>
            </thead>
            <tbody>
              {['Chennai', 'Bangalore', 'Mumbai', 'Delhi'].map((city, idx) => (
                <tr key={city} className="border-b" style={{ borderBottomColor: 'var(--border)' }}>
                  <td className="py-3 font-medium">{city}</td>
                  <td className="py-3 text-primary font-bold">{(5 - idx) * 1200}</td>
                  <td className="py-3">{(5 - idx) * 3500}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security & Moderation */}
        <div className="card glass-panel border-2 border-red-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600"><AlertTriangle /> Security & Moderation</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>
              <span className="font-bold">Pending Fraud Reports</span>
              <span className="badge badge-danger">12 Action Required</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
              <span className="font-bold">Blocked Users</span>
              <span className="text-muted">45 Accounts</span>
            </div>
            <button className="btn mt-2 w-full text-white" style={{ backgroundColor: '#ef4444' }}>Review Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
