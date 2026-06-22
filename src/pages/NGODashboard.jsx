import React, { useState } from 'react';
import { MapPin, Phone, AlertCircle, Package, Users, Truck } from 'lucide-react';

const NGODashboard = () => {
  const [tab, setTab] = useState('incoming');

  return (
    <div style={{ background: '#F8FAFC', padding: '80px 0', minHeight: '100vh' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏢 Partner Portal</div>
          <h2 className="section-title">NGO Operations</h2>
          <p className="section-sub">Manage incoming food donations, urgent SOS requests, and distribution logs.</p>
        </div>

        {/* Top Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Incoming Today', val: '12', icon: '📦', color: '#1E3A8A', bg: '#DBEAFE' },
            { label: 'SOS Alerts', val: '2', icon: '🚨', color: '#991B1B', bg: '#FEE2E2' },
            { label: 'Distributed', val: '450', icon: '🍱', color: '#14532D', bg: '#DCFCE7' },
            { label: 'Volunteers Active', val: '8', icon: '🚴', color: '#78350F', bg: '#FEF3C7' }
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{s.icon}</div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1.1 }}>{s.val}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Main Area */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#E2E8F0', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
              {['incoming', 'sos alerts', 'history'].map(t => (
                <button key={t} onClick={() => setTab(t.split(' ')[0])} style={{
                  padding: '8px 20px', border: 'none', borderRadius: '10px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'var(--transition)',
                  background: tab === t.split(' ')[0] ? 'white' : 'transparent',
                  color: tab === t.split(' ')[0] ? 'var(--green-primary)' : 'var(--text-soft)',
                  boxShadow: tab === t.split(' ')[0] ? 'var(--shadow-sm)' : 'none',
                  textTransform: 'capitalize'
                }}>
                  {t}
                </button>
              ))}
            </div>

            {tab === 'incoming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--green-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span className="badge badge-green">En Route</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>ETA: 12 mins</span>
                    </div>
                    <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>Wedding Meals & Curry</h4>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '8px' }}>40 Portions • Donated by A1 Mahal</p>
                    <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={14} color="var(--green-primary)" /> Volunteer Rahul S. is delivering
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm">Acknowledge Receipt</button>
                </div>
                
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span className="badge badge-orange">Matched - Pending Pickup</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>2.4 km away</span>
                    </div>
                    <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>Bakery Surplus</h4>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '8px' }}>15 kg Bread • Donated by Grand Bakery</p>
                    <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={14} color="var(--orange)" /> Requires volunteer assignment
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm">Decline</button>
                    <button className="btn btn-primary btn-sm">Accept Donation</button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'sos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderLeft: '4px solid var(--red-sos)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span className="badge badge-red" style={{ animation: 'pulse 2s infinite' }}>🚨 CRITICAL SOS</span>
                        <span style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: 600 }}>Just Now</span>
                      </div>
                      <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.2rem', color: '#7F1D1D', marginBottom: '8px' }}>Stranded Laborers - Need Dinner</h4>
                      <p style={{ color: '#991B1B', fontSize: '0.9rem', marginBottom: '12px' }}>Approx. 25 people • No food since morning.</p>
                      <p style={{ fontSize: '0.85rem', color: '#7F1D1D', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <MapPin size={16} /> Near Central Railway Station
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                      <button className="btn btn-danger btn-sm" style={{ width: '100%' }}>Dispatch Food</button>
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', borderColor: '#FCA5A5', color: '#991B1B' }}><Phone size={14} /> Contact Caller</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--cream)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid var(--border)' }}>🏛️</div>
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>Hope Shelter</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>Verified Partner</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Capacity</span>
                  <span style={{ fontWeight: 600 }}>120 People</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Inventory</span>
                  <span style={{ fontWeight: 600, color: 'var(--orange)' }}>Low (Needs Dinner)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Zone</span>
                  <span style={{ fontWeight: 600 }}>T Nagar, Chennai</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', background: 'var(--green-deep)', color: 'white' }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>Need More Food?</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '20px', lineHeight: 1.6 }}>Broadcast a requirement to donors in your zone.</p>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', width: '100%', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px' }}>
                Broadcast Need
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NGODashboard;
