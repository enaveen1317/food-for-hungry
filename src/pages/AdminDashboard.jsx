import React, { useState } from 'react';
import { BarChart3, Users, Building2, Truck, Package, AlertCircle, Settings, FileText, Activity } from 'lucide-react';

const navItems = [
  { icon: <Activity size={18} />, label: 'Live Operations' },
  { icon: <Package size={18} />, label: 'Donations' },
  { icon: <Building2 size={18} />, label: 'NGO Partners' },
  { icon: <Truck size={18} />, label: 'Volunteer Fleet' },
  { icon: <AlertCircle size={18} />, label: 'SOS Alerts' },
  { icon: <BarChart3 size={18} />, label: 'System Metrics' },
];

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState('Live Operations');

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar */}
      <div style={{ background: 'var(--green-deep)', height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px', color: 'white', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>City Admin Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="ops-match-dot" style={{ background: '#4ADE80' }}></span> System Operational</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', color: 'var(--green-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>AD</div>
        </div>
      </div>

      <div className="admin-body-layout">
        {/* Sidebar */}
        <div className="admin-sidebar-responsive">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '12px', marginBottom: '8px' }}>Menu</p>
          {navItems.map(item => (
            <button 
              key={item.label} 
              onClick={() => setActiveNav(item.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px',
                background: activeNav === item.label ? 'var(--green-mint)' : 'transparent',
                color: activeNav === item.label ? 'var(--green-deep)' : 'var(--text-soft)',
                fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                textAlign: 'left'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="admin-main-responsive" style={{ flex: 1, padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '4px' }}>Live Operations</h2>
              <p style={{ color: 'var(--text-soft)' }}>Real-time city-wide rescue logistics.</p>
            </div>
            <button className="btn btn-secondary btn-sm"><FileText size={16} /> Export Daily Log</button>
          </div>

          {/* Metric Cards */}
          <div className="grid-4-col" style={{ gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Donations Today', val: '147', sub: '+12% from yesterday', color: 'var(--green-primary)' },
              { label: 'Active SOS Alerts', val: '2', sub: 'Requires immediate action', color: 'var(--red-sos)', alert: true },
              { label: 'On-Duty Fleet', val: '34', sub: 'Out of 124 registered', color: 'var(--orange)' },
              { label: 'NGOs Receiving', val: '18', sub: 'Currently accepting food', color: '#2563EB' }
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '20px', borderTop: `4px solid ${s.color}`, background: s.alert ? '#FEF2F2' : 'white' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 600, marginBottom: '8px' }}>{s.label}</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '2rem', color: 'var(--text-dark)', lineHeight: 1.1, marginBottom: '8px' }}>{s.val}</p>
                <p style={{ fontSize: '0.75rem', color: s.alert ? 'var(--red-sos)' : 'var(--text-soft)', fontWeight: 500 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid-2to1">
            {/* Action Log */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
                <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>Recent Platform Activity</h4>
              </div>
              <div style={{ padding: '0 24px' }}>
                {[
                  { time: '14:32', type: 'MATCH', text: 'Donation DON-8492 automatically matched to Hope Shelter.' },
                  { time: '14:28', type: 'DONATION', text: 'New donation of 40 portions listed by A1 Mahal.' },
                  { time: '14:15', type: 'DELIVERY', text: 'Volunteer Suresh completed delivery to Annai Trust.' },
                  { time: '14:05', type: 'SOS', text: 'SOS alert raised from Central Station (25 people).' },
                  { time: '13:50', type: 'USER', text: 'New NGO "Feeding Hearts" registration pending approval.' }
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #EEF2F7' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600, width: '40px' }}>{log.time}</div>
                    <div style={{ width: '80px' }}>
                      <span className={`badge ${log.type === 'SOS' ? 'badge-red' : log.type === 'DELIVERY' ? 'badge-green' : log.type === 'MATCH' ? 'badge-blue' : 'badge-orange'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        {log.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', flex: 1 }}>{log.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>Pending Approvals</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>NGO Registrations</span>
                  <span className="badge badge-orange">3 Pending</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>Volunteer KYC</span>
                  <span className="badge badge-orange">12 Pending</span>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '20px' }}>Review All</button>
              </div>

              <div className="card" style={{ padding: '24px', background: 'var(--green-deep)', color: 'white' }}>
                <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>System Health</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.8 }}>Matching Algorithm</span>
                  <span style={{ fontWeight: 600, color: '#4ADE80' }}>Optimal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.8 }}>API Latency</span>
                  <span style={{ fontWeight: 600 }}>42ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
