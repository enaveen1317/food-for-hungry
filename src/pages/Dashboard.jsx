import React, { useState } from 'react';

const tasks = [
  { id:1, donor:'Hotel Saravana Bhavan', food:'Dal Rice — 30 plates', pickup:'Anna Nagar, Chennai', drop:'Hope Foundation, T Nagar', urgency:'high', dist:'2.3 km', time:'Posted 12 min ago' },
  { id:2, donor:'Raj Wedding Hall', food:'Veg Biryani — 60 kg', pickup:'Adyar Signal, Chennai', drop:'Feeding India, Velachery', urgency:'critical', dist:'4.1 km', time:'Posted 5 min ago' },
  { id:3, donor:'Krishna Bakery', food:'Bread & Pav — 200 pcs', pickup:'Velachery Main Rd', drop:'Children Home, KK Nagar', urgency:'low', dist:'1.8 km', time:'Posted 40 min ago' },
];

const Dashboard = () => {
  const [tab, setTab] = useState('available');

  return (
    <div style={{ background:'var(--cream)', padding:'96px 0' }} id="volunteer-dashboard">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🚴 Volunteer Hub</div>
          <h2 className="sec-title">Volunteer Dashboard</h2>
          <p className="sec-sub">Accept pickups, complete deliveries, and earn rewards. Real impact — every ride.</p>
        </div>

        {/* Top stat row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:40 }}>
          {[
            { ico:'📦', bg:'#DBEAFE', n:'8', l:'Available Tasks' },
            { ico:'🚴', bg:'#DCFCE7', n:'3', l:'Accepted Pickups' },
            { ico:'✅', bg:'#FED7AA', n:'47', l:'Completed' },
            { ico:'⭐', bg:'#F3E8FF', n:'1,240', l:'Reward Points' },
          ].map(s => (
            <div key={s.l} className="mini-stat">
              <div className="mini-stat-ico" style={{ background:s.bg }}>{s.ico}</div>
              <div className="mini-stat-n">{s.n}</div>
              <div className="mini-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Gamification banner */}
        <div style={{ background:'linear-gradient(135deg,var(--g-deep),var(--g-primary))', borderRadius:20, padding:'24px 28px', marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff', flexWrap:'wrap', gap:16 }}>
          <div className="flex items-c gap-4">
            <div style={{ width:60, height:60, background:'rgba(255,255,255,.18)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}>🏆</div>
            <div>
              <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.15rem' }}>Gold Tier Volunteer</p>
              <p style={{ opacity:.8, fontSize:'.83rem', marginTop:2 }}>Top 5% of volunteers this month · 47 deliveries completed</p>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.4rem' }}>1,240 pts</p>
            <p style={{ opacity:.7, fontSize:'.75rem', marginBottom:8 }}>260 pts to Platinum tier</p>
            <div style={{ width:140, height:7, background:'rgba(255,255,255,.2)', borderRadius:999 }}>
              <div style={{ width:'82%', height:'100%', background:'#4ADE80', borderRadius:999 }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:24, background:'var(--border-soft)', padding:'6px', borderRadius:13, width:'fit-content' }}>
          {['available','accepted','completed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'8px 20px', border:'none', borderRadius:10, fontFamily:'Poppins', fontWeight:600, fontSize:'.83rem', cursor:'pointer', transition:'var(--fast)', background:tab===t?'#fff':'transparent', color:tab===t?'var(--g-primary)':'var(--text-soft)', boxShadow:tab===t?'var(--sh-xs)':'none' }}>
              {t.charAt(0).toUpperCase()+t.slice(1)} {t==='available'?'(8)':t==='accepted'?'(3)':'(47)'}
            </button>
          ))}
        </div>

        {/* Task cards */}
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="flex items-s justify-b flex-wrap gap-4">
              <div style={{ flex:1 }}>
                <div className="flex items-c gap-3 mb-3 flex-wrap">
                  <div style={{ width:42, height:42, borderRadius:12, background:'var(--g-mint)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>🍱</div>
                  <div>
                    <p className="poppins f-700 text-md">{task.donor}</p>
                    <p className="text-sm clr-soft mt-1">{task.food}</p>
                  </div>
                  <span className={`urgency ${task.urgency==='critical'?'u-crit':task.urgency==='high'?'u-high':'u-low'}`}>
                    {task.urgency==='critical'?'🔴 Critical':task.urgency==='high'?'🟠 High Priority':'🟢 Normal'}
                  </span>
                  <span className="text-xs clr-soft ml-auto">{task.time}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div style={{ background:'var(--border-soft)', borderRadius:10, padding:'10px 12px' }}>
                    <p className="text-xs clr-soft mb-1">📦 Pickup</p>
                    <p className="text-sm f-600">{task.pickup}</p>
                  </div>
                  <div style={{ background:'var(--g-soft)', borderRadius:10, padding:'10px 12px' }}>
                    <p className="text-xs clr-soft mb-1">🏁 Drop</p>
                    <p className="text-sm f-600">{task.drop}</p>
                  </div>
                  <div style={{ background:'var(--orange-soft)', borderRadius:10, padding:'10px 12px' }}>
                    <p className="text-xs clr-soft mb-1">📍 Distance</p>
                    <p className="text-sm f-600 clr-orange">{task.dist}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2" style={{ flexShrink:0 }}>
                <button className="btn btn-primary btn-sm">✓ Accept Task</button>
                <button className="btn btn-outline btn-sm">🗺️ View Map</button>
                <button style={{ background:'none', border:'none', fontSize:'.75rem', color:'var(--text-soft)', cursor:'pointer', fontFamily:'Poppins', fontWeight:600 }}>Skip →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
