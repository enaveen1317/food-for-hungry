import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Navigation, MapPin } from 'lucide-react';

const DonorDashboard = () => {
  const [tab, setTab] = useState('active');

  const activeDonations = [
    {
      id: 'DON-8492',
      food: 'Leftover Wedding Meals (Rice & Curry)',
      qty: '40 Portions',
      status: 'Volunteer Assigned',
      progress: 3, // 1: Submitted, 2: Matched, 3: Assigned, 4: Picked Up, 5: Delivered
      eta: '12 mins',
      volunteer: 'Rahul S.',
      ngo: 'Hope Shelter',
      time: '14:30 PM'
    }
  ];

  const pastDonations = [
    { id: 'DON-8211', food: 'Bakery Surplus (Breads)', qty: '15 kg', status: 'Delivered', date: 'Yesterday' },
    { id: 'DON-7934', food: 'Corporate Event Meals', qty: '120 Portions', status: 'Delivered', date: 'Last Week' },
    { id: 'DON-7102', food: 'Raw Vegetables', qty: '50 kg', status: 'Delivered', date: '2 Weeks Ago' }
  ];

  return (
    <div style={{ background: '#F8FAFC', padding: '80px 0', minHeight: '100vh' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🍽️ Donor Portal</div>
          <h2 className="section-title">My Impact Dashboard</h2>
          <p className="section-sub">Track your active rescues and see the difference you've made in the community.</p>
        </div>

        {/* Impact Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Rescues', val: '24', icon: '📦', bg: '#DBEAFE', color: '#1E3A8A' },
            { label: 'Meals Provided', val: '640', icon: '🍱', bg: '#DCFCE7', color: '#14532D' },
            { label: 'People Served', val: '1,280', icon: '👨‍👩‍👧', bg: '#FEF3C7', color: '#78350F' },
            { label: 'CO2 Saved (kg)', val: '45.2', icon: '🌱', bg: '#F3E8FF', color: '#4C1D95' }
          ].map((s, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1.2 }}>{s.val}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#E2E8F0', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
          {['active', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', border: 'none', borderRadius: '10px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'var(--transition)',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--green-primary)' : 'var(--text-soft)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              textTransform: 'capitalize'
            }}>
              {t} Donations
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeDonations.map(don => (
              <div key={don.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ background: 'var(--green-deep)', color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>{don.id}</span>
                    <h4 style={{ fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 700 }}>{don.food}</h4>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {don.qty}
                  </div>
                </div>

                <div style={{ padding: '32px 24px' }}>
                  {/* Status Tracker */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '3px', background: '#E2E8F0', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', top: '12px', left: '10%', width: `${(don.progress - 1) * 20}%`, height: '3px', background: 'var(--green-primary)', zIndex: 1, transition: 'width 1s ease' }}></div>
                    
                    {['Submitted', 'Matched', 'Assigned', 'Picked Up', 'Delivered'].map((step, idx) => (
                      <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white',
                          background: don.progress > idx ? 'var(--green-primary)' : '#CBD5E1',
                          border: `3px solid ${don.progress > idx ? '#DCFCE7' : '#F8FAFC'}`
                        }}>
                          {don.progress > idx ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: don.progress >= idx + 1 ? 'var(--text-dark)' : 'var(--text-soft)' }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Step Details */}
                  <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--green-mint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Navigation color="var(--green-primary)" />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.1rem' }}>{don.status}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>Volunteer {don.volunteer} is en route. ETA: {don.eta}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Destination</p>
                      <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{don.ngo}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="card" style={{ padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-soft)' }}>Donation ID</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-soft)' }}>Food Details</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-soft)' }}>Quantity</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-soft)' }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-soft)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastDonations.map(don => (
                  <tr key={don.id} style={{ borderBottom: '1px solid #EEF2F7' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.9rem' }}>{don.id}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{don.food}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--text-soft)' }}>{don.qty}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--text-soft)' }}>{don.date}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
