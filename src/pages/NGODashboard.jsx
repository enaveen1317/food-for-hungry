import React, { useState } from 'react';

const donations = [
  { donor:'Hotel Saravana Bhavan', food:'30 plates rice & dal', time:'5 min ago', status:'pending' },
  { donor:'Raj Catering Services', food:'60 kg veg biryani', time:'18 min ago', status:'accepted' },
  { donor:'Krishna Bakery', food:'200 buns + bread', time:'55 min ago', status:'pickup' },
  { donor:'Ananya Home Kitchen', food:'15 kg sambar rice', time:'2 hrs ago', status:'delivered' },
  { donor:'Green Bowl Restaurant', food:'40 plates pasta', time:'3 hrs ago', status:'delivered' },
];

const requests = [
  { name:'Ravi & Family', loc:'Dharavi Colony, Chennai', people:8, urgent:true },
  { name:'Anbu Night Shelter', loc:'Adyar Bridge, Chennai', people:25, urgent:true },
  { name:'Old Age Home', loc:'T Nagar West', people:40, urgent:false },
];

const NGODashboard = () => {
  const [tab, setTab] = useState('incoming');

  return (
    <div style={{ background:'#fff', padding:'96px 0' }} id="ngo-dashboard">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🏢 NGO Panel</div>
          <h2 className="sec-title">NGO Dashboard</h2>
          <p className="sec-sub">Manage incoming donations, active requests, and volunteer assignments from one place.</p>
        </div>

        {/* Summary Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:40 }}>
          {[
            { ico:'🍱', bg:'#DCFCE7', n:'23', l:'Incoming Donations' },
            { ico:'🙏', bg:'#FED7AA', n:'14', l:'Pending Requests' },
            { ico:'🚴', bg:'#DBEAFE', n:'8', l:'Active Volunteers' },
            { ico:'✅', bg:'#F0FDF4', n:'1,240', l:'Total Deliveries' },
          ].map(s => (
            <div key={s.l} className="mini-stat">
              <div className="mini-stat-ico" style={{ background:s.bg }}>{s.ico}</div>
              <div className="mini-stat-n">{s.n}</div>
              <div className="mini-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Incoming donations */}
          <div>
            <p className="poppins f-700 text-lg mb-4">🍱 Incoming Donations</p>
            {donations.map((d,i) => (
              <div key={i} style={{ background:'#fff', border:'1px solid #EEF2F7', borderRadius:14, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--sh-xs)' }}>
                <div>
                  <p className="poppins f-600 text-sm">{d.donor}</p>
                  <p className="text-xs clr-soft mt-1">{d.food} · {d.time}</p>
                </div>
                <div className="flex items-c gap-2">
                  <span className={`status-chip ${d.status==='pending'?'s-pending':d.status==='accepted'?'s-accepted':d.status==='pickup'?'s-pickup':'s-delivered'}`}>
                    {d.status==='pending'?'⏳ Pending':d.status==='accepted'?'✓ Accepted':d.status==='pickup'?'🚴 Picked Up':'✅ Delivered'}
                  </span>
                  {d.status==='pending' && <button className="btn btn-primary btn-sm">Accept</button>}
                </div>
              </div>
            ))}
          </div>

          {/* Urgent requests + volunteers */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* SOS */}
            <div>
              <p className="poppins f-700 text-lg mb-4">🆘 Urgent Hunger Requests</p>
              {requests.map((r,i) => (
                <div key={i} style={{ background:r.urgent?'var(--red-soft)':'var(--border-soft)', border:`1px solid ${r.urgent?'var(--red-mid)':'var(--border)'}`, borderRadius:14, padding:'14px 16px', marginBottom:10 }}>
                  <div className="flex items-c justify-b">
                    <div>
                      <p className="poppins f-600 text-sm">{r.name}</p>
                      <p className="text-xs clr-soft mt-1">📍 {r.loc} · {r.people} people</p>
                    </div>
                    <button className={`btn btn-sm ${r.urgent?'btn-red':'btn-outline'}`}>
                      {r.urgent ? '🆘 Dispatch' : 'Assign →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active volunteers */}
            <div>
              <p className="poppins f-700 text-lg mb-4">🚴 Active Volunteers Today</p>
              {[
                { name:'Karthik R.', status:'On delivery', pickups:3, clr:'#16A34A', bg:'#DCFCE7' },
                { name:'Meena S.', status:'Available', pickups:1, clr:'#2563EB', bg:'#DBEAFE' },
                { name:'Pradeep K.', status:'Available', pickups:5, clr:'#2563EB', bg:'#DBEAFE' },
                { name:'Divya T.', status:'On delivery', pickups:2, clr:'#D97706', bg:'#FEF3C7' },
              ].map((v,i) => (
                <div key={i} className="flex items-c justify-b mb-3" style={{ padding:'12px 16px', background:'#fff', border:'1px solid #EEF2F7', borderRadius:13, boxShadow:'var(--sh-xs)' }}>
                  <div className="flex items-c gap-3">
                    <div style={{ width:36, height:36, borderRadius:'50%', background:v.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🧑</div>
                    <div>
                      <p className="poppins f-600 text-sm">{v.name}</p>
                      <p style={{ fontSize:'.7rem', color:v.clr, fontWeight:700 }}>{v.status}</p>
                    </div>
                  </div>
                  <span className="text-xs clr-soft">{v.pickups} pickups today</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
