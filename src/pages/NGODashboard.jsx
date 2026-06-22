import React from 'react';

const donations = [
  { donor:'Hotel Saravana Bhavan', food:'30 plates rice & dal', time:'8 min ago', status:'pending' },
  { donor:'Raj Catering Services', food:'60 kg veg biryani', time:'24 min ago', status:'accepted' },
  { donor:'Krishna Bakery', food:'200 buns + bread', time:'1 hr ago', status:'pickup' },
  { donor:'Ananya Home Kitchen', food:'15 kg sambar rice', time:'2 hrs ago', status:'delivered' },
  { donor:'Green Bowl Restaurant', food:'40 plates pasta salad', time:'3 hrs ago', status:'delivered' },
];

const requests = [
  { name:'Ravi & Family', loc:'Dharavi Colony, Chennai', ppl:8, urgent:true },
  { name:'Anbu Night Shelter', loc:'Adyar Bridge Camp', ppl:25, urgent:true },
  { name:'Old Age Home, T Nagar', loc:'T Nagar West', ppl:40, urgent:false },
];

const volunteers = [
  { name:'Karthik R.', area:'Anna Nagar', status:'On delivery', deliveries:3 },
  { name:'Meena S.', area:'Adyar', status:'Available', deliveries:1 },
  { name:'Pradeep K.', area:'Velachery', status:'Available', deliveries:5 },
  { name:'Divya T.', area:'T Nagar', status:'On delivery', deliveries:2 },
];

const StatusDot = ({ s }) => {
  const map = { pending:'dot-pending', accepted:'dot-accepted', pickup:'dot-pickup', delivered:'dot-done' };
  const label = { pending:'Pending', accepted:'Accepted', pickup:'Picked up', delivered:'Delivered' };
  return <span style={{ fontSize:'.74rem', fontWeight:700, color:'var(--soft)' }}><span className={`status-dot ${map[s]}`} />{label[s]}</span>;
};

const NGODashboard = () => (
  <div style={{ background:'var(--beige)', padding:'80px 0' }} id="ngo-dashboard">
    <div className="wrap">
      <div style={{ maxWidth:560, marginBottom:40 }}>
        <span className="sec-kicker">NGO Dashboard</span>
        <h2 style={{ fontSize:'1.6rem', marginBottom:10 }}>Feeding India Trust — Chennai</h2>
        <p className="cs sm">Manage incoming food offers, respond to requests, and coordinate your volunteers from one place.</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:36 }}>
        {[
          { ico:'🍱', n:'23', l:'Incoming today', bg:'var(--green-tint)', bdr:'var(--green-soft)' },
          { ico:'🙏', n:'14', l:'Pending requests', bg:'var(--orange-tint)', bdr:'#FDDCB5' },
          { ico:'🚴', n:'8', l:'Volunteers active', bg:'#EFF6FF', bdr:'#BFDBFE' },
          { ico:'✅', n:'1,240', l:'Total deliveries', bg:'var(--beige-dark)', bdr:'var(--border)' },
        ].map(s => (
          <div key={s.l} style={{ background:s.bg, border:`1px solid ${s.bdr}`, borderRadius:'var(--r-lg)', padding:'20px 18px', boxShadow:'var(--sh-xs)' }}>
            <span style={{ fontSize:'1.4rem', display:'block', marginBottom:10 }}>{s.ico}</span>
            <span className="pops f800" style={{ fontSize:'1.7rem', color:'var(--text)', display:'block', lineHeight:1, marginBottom:4 }}>{s.n}</span>
            <span className="xs cs">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="ngo-dash-grid">
        {/* Incoming donations */}
        <div>
          <div className="ngo-panel">
            <div className="ngo-panel-h">🍱 Incoming donations today</div>
            {donations.map((d,i) => (
              <div key={i} className="donate-row">
                <div>
                  <p className="sm f600">{d.donor}</p>
                  <p className="xs cs mt2">{d.food} · {d.time}</p>
                </div>
                <div className="flex ic g2">
                  <StatusDot s={d.status} />
                  {d.status === 'pending' && <button className="btn btn-green btn-sm">Accept</button>}
                </div>
              </div>
            ))}
          </div>

          {/* Pending requests */}
          <div className="ngo-panel mt4">
            <div className="ngo-panel-h">🆘 Urgent food requests</div>
            {requests.map((r,i) => (
              <div key={i} style={{ background: r.urgent ? 'var(--red-soft)' : 'var(--beige)', border:`1px solid ${r.urgent ? 'var(--red-tint)' : 'var(--border)'}`, borderRadius:12, padding:'12px 14px', marginBottom:10 }}>
                <div className="flex ic jb">
                  <div>
                    <p className="sm f600">{r.name}</p>
                    <p className="xs cs mt2">📍 {r.loc} · {r.ppl} people</p>
                  </div>
                  <button className={`btn btn-sm ${r.urgent ? 'btn-red' : 'btn-outline'}`}>
                    {r.urgent ? '🆘 Dispatch' : 'Assign →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteers + history */}
        <div>
          <div className="ngo-panel">
            <div className="ngo-panel-h">🚴 Volunteers on duty today</div>
            {volunteers.map((v,i) => (
              <div key={i} className="flex ic jb mb-4">
                <div className="flex ic g3">
                  <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--green-soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem' }}>🧑</div>
                  <div>
                    <p className="sm f600">{v.name}</p>
                    <p className="xs cs">{v.area}</p>
                  </div>
                </div>
                <div className="flex ic g2">
                  <span className="xs cs">{v.deliveries} today</span>
                  <span style={{ fontSize:'.7rem', fontWeight:700, padding:'2px 9px', borderRadius:999, background: v.status === 'Available' ? 'var(--green-tint)' : 'var(--orange-tint)', color: v.status === 'Available' ? 'var(--green)' : 'var(--orange)' }}>{v.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Food rescue history */}
          <div className="ngo-panel mt4">
            <div className="ngo-panel-h">📋 This week at a glance</div>
            {[['Meals delivered this week', '647'],['Active donor partners', '18'],['Volunteer hours logged', '92 hrs'],['SOS cases resolved', '6/6']].map(([l,v]) => (
              <div key={l} className="flex ic jb mb-3">
                <p className="sm cs">{l}</p>
                <p className="sm f700 ct">{v}</p>
              </div>
            ))}
            <div style={{ marginTop:14, padding:'12px 14px', background:'var(--green-tint)', border:'1px solid var(--green-soft)', borderRadius:12 }}>
              <p className="xs f700 cg mb-1">This week's highlight</p>
              <p className="xs cs">Coordinated emergency delivery for 200 flood-displaced residents in Tambaram on June 4th — within 4 hours of the alert.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NGODashboard;
