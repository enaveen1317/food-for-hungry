import React, { useState } from 'react';
import { MapPin, Navigation, Package, CheckCircle, Camera, AlertCircle } from 'lucide-react';

const tasks = [
  { 
    id: 'TSK-992', donor: 'A1 Mahal (Wedding)', food: 'Rice & Veg Curry — 40 portions', 
    pickup: 'Anna Nagar', drop: 'Hope Shelter, T Nagar', 
    urgency: 'high', distance: '3.2 km', payout: '45 pts', status: 'available',
    pickupTime: 'Ready now', dropTime: 'Deliver by 15:30'
  },
  { 
    id: 'TSK-995', donor: 'Grand Bakery', food: 'Bread & Buns — 200 pcs', 
    pickup: 'Velachery', drop: 'Children Home, KK Nagar', 
    urgency: 'medium', distance: '6.5 km', payout: '60 pts', status: 'available',
    pickupTime: 'Ready at 16:00', dropTime: 'Deliver by 18:00'
  }
];

const Dashboard = () => {
  const [tab, setTab] = useState('active');

  return (
    <div style={{ background: '#F8FAFC', padding: '80px 0', minHeight: '100vh' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🚴 Fleet Portal</div>
          <h2 className="section-title">Volunteer Operations</h2>
          <p className="section-sub">Manage your active pickups, optimize routes, and upload delivery proofs.</p>
        </div>

        {/* Top Status & Map Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-primary))', borderRadius: '20px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '8rem', opacity: 0.1 }}>🚴</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '16px', display: 'inline-block' }}>Online & Active</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem' }}>Rahul S.</p>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '16px' }}>Gold Tier Fleet</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Poppins', lineHeight: 1 }}>1,240</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reward Pts</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Poppins' }}>47</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliveries</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem' }}>Current Shift</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-soft)' }}>Distance Logged</span>
                <span style={{ fontWeight: 600 }}>14.2 km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-soft)' }}>Time Online</span>
                <span style={{ fontWeight: 600 }}>3h 15m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-soft)' }}>Next Tier (Platinum)</span>
                <span style={{ fontWeight: 600, color: 'var(--green-primary)' }}>260 pts away</span>
              </div>
            </div>
          </div>

          {/* Active Route Map */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>Active Route Optimization</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>GPS Live Tracking</p>
              </div>
              <span className="badge badge-green">● Signal Strong</span>
            </div>
            <div style={{ flex: 1, background: '#E2E8F0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Map Placeholder */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
              <div style={{ background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Navigation size={24} color="var(--green-primary)" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem' }}>En route to Pickup</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>3.2 km remaining (8 mins)</p>
              </div>
              
              {/* Fake route line */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <path d="M 150 100 Q 250 150 400 120 T 600 200" fill="none" stroke="var(--green-primary)" strokeWidth="4" strokeDasharray="8 8" />
                <circle cx="150" cy="100" r="8" fill="var(--green-primary)" />
                <circle cx="600" cy="200" r="8" fill="var(--orange)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#E2E8F0', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
          {['active', 'available', 'completed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', border: 'none', borderRadius: '10px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'var(--transition)',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--green-primary)' : 'var(--text-soft)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              textTransform: 'capitalize'
            }}>
              {t} Tasks
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'active' && (
            <div className="card" style={{ borderLeft: '4px solid var(--orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span className="badge badge-orange">In Progress</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>TSK-992</span>
                  </div>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>A1 Mahal (Wedding)</h4>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '16px' }}>Rice & Veg Curry — 40 portions</p>
                  
                  <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-soft)', marginBottom: '4px' }}>Pickup (Ready now)</p>
                      <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="var(--orange)" /> Anna Nagar</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-soft)', marginBottom: '4px' }}>Dropoff (By 15:30)</p>
                      <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={14} color="var(--green-primary)" /> Hope Shelter, T Nagar</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', minWidth: '240px', border: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', textAlign: 'center' }}>Delivery Action</p>
                  <button className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>Mark Picked Up</button>
                  <button className="btn btn-secondary" style={{ width: '100%', background: 'white' }}>
                    <Camera size={16} /> Upload Proof
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'available' && tasks.map(task => (
            <div key={task.id} className="card" style={{ transition: 'var(--transition)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span className={`badge ${task.urgency === 'high' ? 'badge-red' : 'badge-orange'}`}>
                      {task.urgency === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>{task.distance} • +{task.payout}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>{task.donor}</h4>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '12px' }}>{task.food}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="var(--text-soft)" /> {task.pickup}</span>
                    <span style={{ color: 'var(--border)' }}>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Navigation size={14} color="var(--text-soft)" /> {task.drop}</span>
                  </div>
                </div>
                <button className="btn btn-primary">Accept & Route</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
