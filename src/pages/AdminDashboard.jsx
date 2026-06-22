import React, { useState } from 'react';
import { BarChart3, Users, Building2, Truck, Package, AlertCircle, Settings, FileText } from 'lucide-react';

const navItems = [
  { icon: '📊', label: 'Overview' },
  { icon: '🍱', label: 'Donors' },
  { icon: '🏢', label: 'NGOs' },
  { icon: '🚴', label: 'Volunteers' },
  { icon: '🙏', label: 'Requests' },
  { icon: '🚚', label: 'Deliveries' },
  { icon: '📋', label: 'Reports' },
  { icon: '⚙️', label: 'Settings' },
];

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <div style={{ background: 'var(--cream)', padding: '80px 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🔐 Admin Panel</div>
          <h2 className="section-title">Admin Dashboard</h2>
          <p className="section-sub">Manage all operations, track impact, and moderate the platform.</p>
        </div>

        <div className="admin-layout">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <div style={{ padding: '16px 20px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🛡️</div>
                <div>
                  <p style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem' }}>Admin Panel</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Food For Hungry</p>
                </div>
              </div>
            </div>
            <div className="admin-sidebar-title">Main Menu</div>
            {navItems.map(item => (
              <button key={item.label} className={`admin-nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => setActiveNav(item.label)}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ padding: '28px', background: '#FAFAFA' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.3rem', fontWeight: 800 }}>Platform Overview</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.875rem' }}>Today — {new Date().toDateString()}</p>
              </div>
              <span className="badge badge-green">● System Live</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {[
                { icon: '🍱', num: '147', label: 'Today\'s Donations', color: '#DCFCE7', change: '+12%' },
                { icon: '🙏', num: '83', label: 'Active Requests', color: '#FED7AA', change: '+7%' },
                { icon: '🚴', num: '34', label: 'Online Volunteers', color: '#DBEAFE', change: '+5' },
                { icon: '🆘', num: '6', label: 'SOS Pending', color: '#FEE2E2', change: 'Urgent' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid #EEF2F7', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{s.icon}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: i === 3 ? 'var(--red-sos)' : 'var(--green-primary)', background: i === 3 ? '#FEE2E2' : '#DCFCE7', padding: '3px 8px', borderRadius: '9999px' }}>{s.change}</span>
                  </div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-dark)', lineHeight: 1 }}>{s.num}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '4px' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Recent Donations */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #EEF2F7' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>🍱 Recent Donations</p>
                {[
                  { name: 'Hotel Saravana Bhavan', food: '30 plates rice', time: '5 mins ago', status: 'pending' },
                  { name: 'Raj Catering', food: '50 kg biryani', time: '22 mins ago', status: 'accepted' },
                  { name: 'Krishna Bakery', food: '200 buns', time: '1 hr ago', status: 'delivered' },
                  { name: 'Ananya Home', food: '10 kg dal', time: '2 hrs ago', status: 'delivered' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>{d.food} · {d.time}</p>
                    </div>
                    <span className={`badge ${d.status === 'delivered' ? 'badge-green' : d.status === 'accepted' ? 'badge-blue' : 'badge-orange'}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* SOS Requests */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #EEF2F7' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>🆘 SOS Requests</p>
                {[
                  { name: 'Ravi Kumar', loc: 'Dharavi, Chennai', people: '8 people', urgent: true },
                  { name: 'Anbu Shelter', loc: 'Adyar, Chennai', people: '25 people', urgent: true },
                  { name: 'Old Age Home', loc: 'T Nagar', people: '40 elderly', urgent: false },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.urgent ? '#FEF2F2' : '#F9FAFB', border: `1px solid ${s.urgent ? 'var(--red-border)' : 'var(--border)'}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>📍 {s.loc} · {s.people}</p>
                      </div>
                      <button className="btn btn-danger btn-sm">Dispatch</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
