import React, { useState } from 'react';

const tasks = [
  {
    id: 1,
    food: 'Dal rice + sambar — 30 plates',
    donor: 'Hotel Saravana Bhavan',
    pickup: 'Anna Nagar, 2nd Ave',
    drop: 'Annai Night Shelter, T Nagar',
    people: 28,
    dist: '3.2 km',
    timeLeft: 'Pickup by 9:30 PM',
    urgency: 'high',
    note: 'Food is at the hotel back entrance. Ask for Murugan.',
  },
  {
    id: 2,
    food: 'Veg biryani — approx 60 kg',
    donor: 'Raj Wedding Hall',
    pickup: 'Adyar Signal area',
    drop: 'Feeding India Trust, Velachery',
    people: 55,
    dist: '4.8 km',
    timeLeft: 'Urgent — by 8:45 PM',
    urgency: 'critical',
    note: 'Bulk pickup. Bring containers if possible. Call Rajan before arriving.',
  },
  {
    id: 3,
    food: 'Bread, pav, buns — 200 pieces',
    donor: 'Krishna Bakery',
    pickup: 'Velachery Main Rd',
    drop: 'Children Home, KK Nagar',
    people: 40,
    dist: '1.9 km',
    timeLeft: 'Flexible — any time tonight',
    urgency: 'low',
    note: 'Bakery closes at 10 PM. Go before that.',
  },
];

const Dashboard = () => {
  const [tab, setTab] = useState('available');

  return (
    <div style={{ background:'var(--beige)', padding:'80px 0' }} id="volunteers">
      <div className="wrap">
        <div style={{ maxWidth:560, marginBottom:40 }}>
          <span className="sec-kicker">Volunteer dashboard</span>
          <h2 style={{ fontSize:'1.6rem', marginBottom:10 }}>Your pickups and deliveries</h2>
          <p className="cs sm">A simple view of what's near you, what you've accepted, and what you've completed. Every delivery helps someone eat tonight.</p>
        </div>

        {/* Stats */}
        <div className="vol-stats">
          {[
            { ico:'📦', n:'8', l:'Available nearby' },
            { ico:'🚴', n:'3', l:'Accepted by you' },
            { ico:'✅', n:'47', l:'Completed total' },
            { ico:'⭐', n:'1,240', l:'Points earned' },
          ].map(s => (
            <div key={s.l} className="vol-stat">
              <span className="vol-stat-ico">{s.ico}</span>
              <span className="vol-stat-n">{s.n}</span>
              <span className="vol-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Volunteer level */}
        <div style={{ background:'var(--green-deep)', borderRadius:'var(--r-lg)', padding:'22px 24px', marginBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
          <div className="flex ic g4">
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>🏆</div>
            <div>
              <p className="pops f700 lg cw" style={{ marginBottom:3 }}>Gold Volunteer — Karthik S.</p>
              <p className="xs cw" style={{ opacity:.65 }}>Top 5% in Chennai this month · 47 deliveries completed</p>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <p className="pops f800 xl cw mb-2">1,240 pts</p>
            <p className="xs cw" style={{ opacity:.55, marginBottom:8 }}>260 pts to Platinum</p>
            <div style={{ width:130, height:6, background:'rgba(255,255,255,.15)', borderRadius:999 }}>
              <div style={{ width:'82%', height:'100%', background:'#9AE6B4', borderRadius:999 }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--beige-dark)', padding:'5px', borderRadius:12, width:'fit-content', border:'1px solid var(--border)' }}>
          {['available','accepted','completed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'7px 18px', border:'none', borderRadius:9,
              fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:'.82rem',
              cursor:'pointer', transition:'var(--t)',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? 'var(--green)' : 'var(--soft)',
              boxShadow: tab === t ? 'var(--sh-xs)' : 'none',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'available' ? ' (8)' : t === 'accepted' ? ' (3)' : ' (47)'}
            </button>
          ))}
        </div>

        {/* Task cards */}
        {tasks.map(task => (
          <div key={task.id} className="vol-task">
            <div className="vol-task-head">
              <div className="vol-task-ico">🍱</div>
              <div className="vol-task-info">
                <div className="vol-task-title">{task.food}</div>
                <div className="vol-task-sub">{task.donor} · {task.dist} away</div>
              </div>
              <div className="flex ic g2 ml-a">
                <span className={`urg-chip ${task.urgency === 'critical' ? 'urg-crit' : task.urgency === 'high' ? 'urg-high' : 'urg-low'}`}>
                  {task.urgency === 'critical' ? '🔴 Urgent' : task.urgency === 'high' ? '🟠 Tonight' : '🟢 Flexible'}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="vol-route">
              <div className="vol-route-point">
                <div className="vol-route-label">📦 Pickup from</div>
                <div className="vol-route-val">{task.pickup}</div>
              </div>
              <div className="vol-route-arrow">→</div>
              <div className="vol-route-point">
                <div className="vol-route-label">🏁 Drop to</div>
                <div className="vol-route-val">{task.drop}</div>
              </div>
            </div>

            {/* Details row */}
            <div className="flex ic jb fw g3" style={{ marginBottom:12 }}>
              <div className="flex g2 ic">
                <span className="xs cs">👥</span>
                <span className="xs cs">Feeds ~{task.people} people</span>
              </div>
              <div className="flex g2 ic">
                <span className="xs cs">⏰</span>
                <span className="xs" style={{ color: task.urgency === 'critical' ? 'var(--red)' : 'var(--soft)', fontWeight: task.urgency === 'critical' ? 700 : 500 }}>{task.timeLeft}</span>
              </div>
            </div>

            {/* Note */}
            <div style={{ background:'var(--beige)', borderRadius:10, padding:'9px 12px', marginBottom:14, border:'1px solid var(--border-soft)' }}>
              <p className="xs cs"><strong style={{ color:'var(--text)' }}>Note:</strong> {task.note}</p>
            </div>

            {/* Actions */}
            <div className="flex g2">
              <button className={`btn btn-sm ${task.urgency === 'critical' ? 'btn-red' : 'btn-green'}`} style={{ flex:1 }}>Accept pickup</button>
              <button className="btn btn-outline btn-sm">🗺️ View route</button>
              <button style={{ background:'none', border:'none', fontSize:'.75rem', color:'var(--soft)', cursor:'pointer', padding:'0 8px', fontWeight:600 }}>Skip</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
