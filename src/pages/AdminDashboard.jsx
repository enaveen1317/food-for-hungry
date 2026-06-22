import React, { useState } from 'react';

const navItems = [
  { ico:'📊', label:'Overview' },
  { ico:'🍱', label:'Donors' },
  { ico:'🏢', label:'NGOs' },
  { ico:'🚴', label:'Volunteers' },
  { ico:'🙏', label:'Requests' },
  { ico:'🚚', label:'Deliveries' },
  { ico:'📋', label:'Reports' },
  { ico:'⚙️', label:'Settings' },
];

const AdminDashboard = () => {
  const [active, setActive] = useState('Overview');

  return (
    <div style={{ background:'var(--cream)', padding:'96px 0' }} id="admin-dashboard">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🔐 Admin</div>
          <h2 className="sec-title">Admin Dashboard</h2>
          <p className="sec-sub">Full platform control — monitor, moderate, and manage all operations.</p>
        </div>

        <div className="admin-shell">
          {/* Sidebar */}
          <div className="admin-side">
            <div className="admin-side-logo">
              <div className="flex items-c gap-2 mb-1">
                <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🛡️</div>
                <div>
                  <p style={{ color:'#fff', fontFamily:'Poppins', fontWeight:700, fontSize:'.87rem' }}>Admin Panel</p>
                  <p style={{ color:'rgba(255,255,255,.4)', fontSize:'.7rem' }}>Food For Hungry</p>
                </div>
              </div>
            </div>
            <div className="a-nav-group">Main Menu</div>
            {navItems.map(item => (
              <button key={item.label} className={`a-nav${active===item.label?' on':''}`} onClick={() => setActive(item.label)}>
                <span>{item.ico}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="admin-main">
            <div className="flex items-c justify-b mb-6 flex-wrap gap-3">
              <div>
                <p className="poppins f-800 text-xl">Platform Overview</p>
                <p className="clr-soft text-sm mt-1">{new Date().toDateString()}</p>
              </div>
              <div className="flex gap-2">
                <span className="status-chip s-delivered" style={{ padding:'6px 14px' }}>● System Live</span>
                <button className="btn btn-primary btn-sm">+ Add Donor</button>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
              {[
                { ico:'🍱', bg:'#DCFCE7', n:'147', l:"Today's Donations", delta:'+12%', pos:true },
                { ico:'🙏', bg:'#FED7AA', n:'83', l:'Active Requests', delta:'+7', pos:true },
                { ico:'🚴', bg:'#DBEAFE', n:'34', l:'Online Volunteers', delta:'+5', pos:true },
                { ico:'🆘', bg:'#FEE2E2', n:'6', l:'SOS Pending', delta:'Urgent', pos:false },
              ].map(s => (
                <div key={s.l} className="mini-stat">
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div className="mini-stat-ico" style={{ background:s.bg, margin:0 }}>{s.ico}</div>
                    <span className="mini-stat-delta" style={{ background:s.pos?'#DCFCE7':'#FEE2E2', color:s.pos?'var(--g-primary)':'var(--red)' }}>{s.delta}</span>
                  </div>
                  <div className="mini-stat-n">{s.n}</div>
                  <div className="mini-stat-l">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div style={{ background:'#fff', border:'1px solid #EEF2F7', borderRadius:16, padding:20, marginBottom:20 }}>
              <p className="poppins f-700 mb-4">📈 Weekly Delivery Trend</p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:100 }}>
                {[65,80,55,90,72,95,88].map((h,i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ width:'100%', height:`${h}%`, background:`linear-gradient(to top,var(--g-primary),var(--g-light))`, borderRadius:'6px 6px 0 0', opacity:.85+i*.02 }} />
                    <span className="text-xs clr-soft">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 2-col */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {/* Recent donations */}
              <div style={{ background:'#fff', borderRadius:14, padding:18, border:'1px solid #EEF2F7' }}>
                <p className="poppins f-700 mb-4">🍱 Recent Donations</p>
                {[
                  { name:'Hotel Saravana Bhavan', food:'30 plates rice', time:'5 min', s:'pending' },
                  { name:'Raj Catering', food:'60 kg biryani', time:'22 min', s:'accepted' },
                  { name:'Krishna Bakery', food:'200 buns', time:'1 hr', s:'pickup' },
                  { name:'Ananya Home', food:'15 kg dal', time:'2 hrs', s:'delivered' },
                ].map((d,i,arr) => (
                  <div key={i} className="flex items-c justify-b py-2" style={{ borderBottom:i<arr.length-1?'1px solid var(--border-soft)':'none' }}>
                    <div>
                      <p className="poppins f-600 text-sm">{d.name}</p>
                      <p className="text-xs clr-soft mt-1">{d.food} · {d.time} ago</p>
                    </div>
                    <span className={`status-chip ${d.s==='pending'?'s-pending':d.s==='accepted'?'s-accepted':d.s==='pickup'?'s-pickup':'s-delivered'}`} style={{ fontSize:'.68rem' }}>
                      {d.s==='pending'?'Pending':d.s==='accepted'?'Accepted':d.s==='pickup'?'Picked Up':'Delivered'}
                    </span>
                  </div>
                ))}
              </div>

              {/* SOS */}
              <div style={{ background:'#fff', borderRadius:14, padding:18, border:'1px solid #EEF2F7' }}>
                <p className="poppins f-700 mb-4">🆘 SOS — Pending Dispatch</p>
                {[
                  { name:'Ravi Kumar', loc:'Dharavi, Chennai', ppl:'8 people', hot:true },
                  { name:'Anbu Shelter', loc:'Adyar, Chennai', ppl:'25 people', hot:true },
                  { name:'Old Age Home', loc:'T Nagar', ppl:'40 elderly', hot:false },
                ].map((s,i) => (
                  <div key={i} style={{ background:s.hot?'var(--red-soft)':'var(--border-soft)', border:`1px solid ${s.hot?'var(--red-mid)':'var(--border)'}`, borderRadius:12, padding:'12px 14px', marginBottom:10 }}>
                    <div className="flex items-c justify-b">
                      <div>
                        <p className="poppins f-600 text-sm">{s.name}</p>
                        <p className="text-xs clr-soft mt-1">📍 {s.loc} · {s.ppl}</p>
                      </div>
                      <button className={`btn btn-sm ${s.hot?'btn-red':'btn-outline'}`}>Dispatch</button>
                    </div>
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:14 }}>
                  {[['Chennai','45 del'],['Coimbatore','22 del'],['Madurai','18 del']].map(([c,n]) => (
                    <div key={c} style={{ background:'var(--g-soft)', border:'1px solid #BBF7D0', borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
                      <p className="poppins f-700 text-sm clr-green">{n}</p>
                      <p className="text-xs clr-soft">{c}</p>
                    </div>
                  ))}
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
