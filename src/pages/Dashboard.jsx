import React, { useState } from 'react';
import { MapPin, Package, CheckCircle, Star, Trophy, Zap } from 'lucide-react';

const tasks = [
  { id: 1, donor: 'Hotel Saravana Bhavan', food: 'Rice & Dal — 30 plates', pickup: 'Anna Nagar, Chennai', drop: 'Hope NGO, T Nagar', urgency: 'high', time: '2 hrs ago' },
  { id: 2, donor: 'Raj Wedding Hall', food: 'Mixed Veg Biryani — 50 kg', pickup: 'Adyar, Chennai', drop: 'Feeding India Trust', urgency: 'critical', time: '30 min ago' },
  { id: 3, donor: 'Krishna Bakery', food: 'Bread & Buns — 200 pcs', pickup: 'Velachery', drop: 'Children Shelter, KK Nagar', urgency: 'medium', time: '4 hrs ago' },
];

const Dashboard = () => {
  const [tab, setTab] = useState('available');

  return (
    <div style={{ background: 'var(--cream)', padding: '80px 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🚴 Volunteer Hub</div>
          <h2 className="section-title">Volunteer Dashboard</h2>
          <p className="section-sub">Pick up food from donors and deliver to people in need. Every delivery counts.</p>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: '📦', num: '8', label: 'Available Tasks', color: '#DBEAFE' },
            { icon: '🚴', num: '3', label: 'Accepted Pickups', color: '#DCFCE7' },
            { icon: '✅', num: '47', label: 'Completed', color: '#FED7AA' },
            { icon: '⭐', num: '1,240', label: 'Reward Points', color: '#F3E8FF' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon-circle" style={{ background: s.color }}>{s.icon}</div>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Gamification Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-primary))', borderRadius: '20px', padding: '24px 28px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏆</div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.2rem' }}>Gold Tier Volunteer</p>
              <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>You're in the top 5% of volunteers this month!</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem' }}>1,240 pts</p>
            <p style={{ opacity: 0.75, fontSize: '0.8rem' }}>260 pts to Platinum</p>
            <div style={{ width: '140px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', marginTop: '8px' }}>
              <div style={{ width: '82%', height: '100%', background: '#4ADE80', borderRadius: '9999px' }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#F3F4F6', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
          {['available', 'accepted', 'completed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', border: 'none', borderRadius: '10px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'var(--transition)',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--green-primary)' : 'var(--text-soft)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map(task => (
            <div key={task.id} className="vol-task-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🍱</div>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>{task.donor}</p>
                      <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>{task.food}</p>
                    </div>
                    <span className={`urgency-chip ${task.urgency === 'critical' ? 'urgency-high' : task.urgency === 'high' ? 'urgency-med' : 'urgency-low'}`}>
                      {task.urgency === 'critical' ? '🔴 Critical' : task.urgency === 'high' ? '🟠 High' : '🟢 Normal'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                      <MapPin size={15} color="var(--orange)" /> <span><strong style={{ color: 'var(--text-dark)' }}>Pickup:</strong> {task.pickup}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                      <MapPin size={15} color="var(--green-primary)" /> <span><strong style={{ color: 'var(--text-dark)' }}>Drop:</strong> {task.drop}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--red-sos)', fontFamily: 'Poppins' }}>Reject</button>
                  <button className="btn btn-primary btn-sm">Accept Task</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
