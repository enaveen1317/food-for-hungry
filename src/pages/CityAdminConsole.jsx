import React, { useState } from 'react';
import { Shield, Activity, Package, Users, Truck, AlertTriangle, BarChart2, Download, CheckCircle, Clock, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CityAdminConsole = () => {
  const { logs, stats, donations, requests, volunteers } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect admin password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Lock size={32} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '32px' }}>Please enter the secure passphrase to access the city console.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (admin123)" 
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', marginBottom: '16px', fontSize: '1rem', outline: 'none' }}
              autoFocus
            />
            {error && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600 }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}>
              Verify Access
            </button>
          </form>
          <button onClick={() => window.location.href = '/'} style={{ background: 'none', border: 'none', color: '#64748B', marginTop: '24px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
            ← Return to Public Site
          </button>
        </div>
      </div>
    );
  }

  const activeSosCount = requests.filter(r => !r.dispatched).length;
  const onDutyCount = volunteers.filter(v => v.status === 'Available' || v.status === 'Delivering').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F1F5F9', fontFamily: 'Inter, Poppins, sans-serif' }}>
      
      {/* Top Header */}
      <header style={{ height: '64px', background: '#064E3B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Shield size={20} color="#60A5FA" />
          </div>
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.25rem' }}>City Admin Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', background: '#34D399', borderRadius: '50%', display: 'inline-block' }}></span>
            System Operational
          </div>
          <div style={{ width: '32px', height: '32px', background: 'white', color: '#064E3B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
            AD
          </div>
        </div>
      </header>

      <div className="admin-body-layout">
        
        {/* Sidebar */}
        <aside className="admin-sidebar-responsive">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '12px' }}>Menu</div>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: '#DCFCE7', color: '#166534', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>
            <Activity size={18} />
            Live Operations
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Package size={18} />
            Donations
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Users size={18} />
            NGO Partners
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Truck size={18} />
            Volunteer Fleet
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <AlertTriangle size={18} />
            SOS Alerts
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <BarChart2 size={18} />
            System Metrics
          </button>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onClick={() => window.location.href = '/'}>
               ← Back to Website
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main-responsive" style={{ flex: 1, padding: '32px 48px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '2rem', color: '#0F172A', marginBottom: '4px' }}>Live Operations</h1>
              <p style={{ color: '#64748B', fontSize: '1.05rem' }}>Real-time city-wide rescue logistics.</p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #10B981', color: '#10B981', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <Download size={18} />
              Export Daily Log
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid-4-col" style={{ gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', borderTop: '4px solid #10B981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Donations Listed</p>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{donations.length}</h3>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '12px' }}>Live overall</p>
            </div>
            
            <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '24px', borderTop: '4px solid #EF4444', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Active SOS Alerts</p>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{activeSosCount}</h3>
              <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '12px', fontWeight: 600 }}>Requires immediate action</p>
            </div>
            
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', borderTop: '4px solid #F97316', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>On-Duty Fleet</p>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{onDutyCount}</h3>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '12px' }}>Out of {volunteers.length} registered</p>
            </div>
            
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', borderTop: '4px solid #3B82F6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>NGOs Receiving</p>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>4</h3>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '12px' }}>Currently accepting food</p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid-2to1">
            
            {/* Activity Log */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Recent Platform Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                
                {logs.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>No recent activity.</div>
                ) : (
                  logs.slice(0, 5).map((log, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: index < logs.slice(0, 5).length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600, width: '45px' }}>{log.time}</div>
                      <div style={{ background: log.type === 'SOS' ? '#FEE2E2' : log.type === 'DONATION' ? '#FFEDD5' : '#DBEAFE', color: log.type === 'SOS' ? '#DC2626' : log.type === 'DONATION' ? '#EA580C' : '#2563EB', fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', width: '70px', textAlign: 'center' }}>{log.type}</div>
                      <div style={{ color: '#334155', fontSize: '0.9rem' }}>{log.text}</div>
                    </div>
                  ))
                )}

              </div>
            </div>

            {/* Pending Approvals */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Pending Approvals</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>NGO Registrations</span>
                <span style={{ background: '#FFEDD5', color: '#B45309', fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px' }}>3 Pending</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>Volunteer KYC</span>
                <span style={{ background: '#FFEDD5', color: '#B45309', fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px' }}>12 Pending</span>
              </div>

              <button style={{ marginTop: 'auto', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #10B981', color: '#10B981', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Review All
              </button>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default CityAdminConsole;
