import React from 'react';

const go = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
};

/* ─── data ─── */
const ngos = [
  { e:'🏛️', name:'Feeding India Chennai', area:'Chennai · TN', del:1240, vol:34, rating:'4.9' },
  { e:'🤝', name:'Annai Trust', area:'Coimbatore · TN', del:876, vol:22, rating:'4.8' },
  { e:'🌱', name:'Hope Foundation', area:'Madurai · TN', del:643, vol:18, rating:'4.7' },
  { e:'♻️', name:'No Food Waste NGO', area:'Trichy · TN', del:987, vol:29, rating:'4.9' },
  { e:'❤️', name:'Serve India Trust', area:'Salem · TN', del:421, vol:12, rating:'4.6' },
  { e:'🌟', name:'Goonj Tamil Nadu', area:'Tirunelveli · TN', del:554, vol:16, rating:'4.7' },
];

const stories = [
  { bg:'#FFF7ED', icon:'👩', tag:'Home Donor', title:'Priya donated leftover wedding food — 200 families ate that night', outcome:'200 families fed', desc:'After her daughter\'s wedding, Priya had 80 kg of food left. Instead of throwing it away, she listed it on Food For Hungry. Within 45 minutes, a volunteer arrived and delivered it to 3 nearby shelters.' },
  { bg:'#F0FDF4', icon:'🏨', tag:'Hotel Partner', title:'Hotel Saravana Bhavan now donates surplus meals every day at 9 PM', outcome:'Daily 150 meals', desc:'The hotel joined our Scheduled Donations program. Every evening, unsold thali meals are picked up by our volunteers and delivered to night shelters across Chennai.' },
  { bg:'#EFF6FF', icon:'🚴', tag:'Volunteer Story', title:'Karthik completes 3 food pickups every morning before his office job', outcome:'Top Volunteer', desc:'A software engineer who volunteers on his commute. He has completed 340 deliveries in 6 months and earned Platinum tier status — all before 9 AM.' },
];

const Home = () => (
  <div>
    {/* ── HERO ─────────────────────────────────── */}
    <section className="hero" id="home">
      <div className="wrap hero-grid">
        {/* Left */}
        <div>
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            34 active donations right now
          </div>
          <h1 className="hero-h1">
            Share Surplus Food.<br />
            <span>Feed Hungry Lives.</span>
          </h1>
          <p className="hero-p">
            A trusted platform that connects homes, restaurants, hotels, and events with nearby NGOs, volunteers, and families in need — reducing food waste and delivering meals with dignity.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => go('donate')}>🍱 Donate Food</button>
            <button className="btn btn-ghost btn-lg" onClick={() => go('request')}>Request Help →</button>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">✅ Verified NGOs</span>
            <span className="hero-badge">🚴 Safe Delivery</span>
            <span className="hero-badge">📍 Nearby Pickup</span>
            <span className="hero-badge">🗣️ Tamil · English</span>
          </div>
        </div>

        {/* Right glass card */}
        <div className="hero-glass">
          <p style={{ color:'rgba(255,255,255,.65)', fontSize:'.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>
            Who we connect
          </p>
          <div className="hero-tiles">
            {[['🍽️','Donors','donate'],['🚴','Volunteers','volunteer-dashboard'],['🏢','NGOs','ngo-dashboard'],['👨‍👩‍👧','Families','request']].map(([icon,label,id]) => (
              <div key={id} className="hero-tile" onClick={() => go(id)}>
                <span className="t-icon">{icon}</span>
                <span className="t-label">{label}</span>
              </div>
            ))}
          </div>
          <div className="hero-live">
            {[['24.8k','Meals Shared'],['28','NGO Partners'],['340','Volunteers']].map(([n,l]) => (
              <div key={l} className="hero-stat">
                <span className="hero-stat-n">{n}</span>
                <span className="hero-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── LIVE IMPACT STATS ───────────────────── */}
    <section className="sec" style={{ background:'#fff' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">📊 Live Impact</div>
          <h2 className="sec-title">Numbers That Matter</h2>
          <p className="sec-sub">Every donation tracked. Every delivery counted. Real impact, real people.</p>
        </div>
        <div className="stats-grid">
          {[
            { ico:'🍱', bg:'#DCFCE7', n:'24,800', l:'Meals Shared' },
            { ico:'👨‍👩‍👧', bg:'#FED7AA', n:'5,120', l:'Families Supported' },
            { ico:'🏢', bg:'#DBEAFE', n:'28', l:'Partner NGOs' },
            { ico:'🚚', bg:'#F3E8FF', n:'8,340', l:'Deliveries Completed' },
          ].map(s => (
            <div key={s.l} className="stat-card">
              <div className="stat-ico" style={{ background:s.bg }}>{s.ico}</div>
              <span className="stat-n">{s.n}</span>
              <span className="stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── QUICK ACTION CARDS ──────────────────── */}
    <section className="sec sec-cream">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🚀 Get Involved</div>
          <h2 className="sec-title">How Would You Like to Help?</h2>
          <p className="sec-sub">Choose your role. Every action — no matter how small — feeds someone today.</p>
        </div>
        <div className="qa-grid">
          {[
            { bg:'#F0FDF4', bdr:'#BBF7D0', ico:'🍱', ibg:'#DCFCE7', clr:'#16A34A', title:'Donate Food', desc:'Have surplus food from your home, hotel, event or restaurant? List it in 2 minutes.', cta:'Start Donating', id:'donate' },
            { bg:'#FFF7ED', bdr:'#FED7AA', ico:'🙏', ibg:'#FED7AA', clr:'#C2410C', title:'Request Food', desc:'Need meals for your family, shelter or elderly home? Submit a request and we\'ll find help.', cta:'Request Now', id:'request' },
            { bg:'#EFF6FF', bdr:'#BFDBFE', ico:'🚴', ibg:'#BFDBFE', clr:'#1D4ED8', title:'Become Volunteer', desc:'Pick up and deliver food near you. Earn rewards and make a difference every day.', cta:'Join as Volunteer', id:'volunteer-dashboard' },
            { bg:'#fff', bdr:'#16A34A', ico:'🏢', ibg:'#DCFCE7', clr:'#16A34A', title:'Partner as NGO', desc:'Register as a verified hunger relief organization and scale your community impact.', cta:'Register NGO', id:'ngo-dashboard' },
          ].map(c => (
            <div key={c.id} className="qa-card" style={{ background:c.bg, border:`1.5px solid ${c.bdr}` }} onClick={() => go(c.id)}>
              <div className="qa-ico" style={{ background:c.ibg }}>{c.ico}</div>
              <div className="qa-title">{c.title}</div>
              <div className="qa-desc">{c.desc}</div>
              <button className="qa-arrow" style={{ color:c.clr }}>{c.cta} →</button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ────────────────────────── */}
    <section className="sec" style={{ background:'#fff' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">⚙️ The Process</div>
          <h2 className="sec-title">From Surplus to Plate in 4 Steps</h2>
          <p className="sec-sub">No complexity. No long waits. Food moves fast so it stays fresh.</p>
        </div>
        <div className="how-grid">
          {[
            { n:'1', ico:'📦', title:'Donor Lists Food', desc:'Add food type, quantity, pickup address, and time — takes under 2 minutes.' },
            { n:'2', ico:'🔔', title:'Smart Alert Sent', desc:'Nearby verified NGOs and available volunteers are instantly notified.' },
            { n:'3', ico:'🚴', title:'Pickup Arranged', desc:'A volunteer accepts the task, collects the food, and heads to the drop point.' },
            { n:'4', ico:'❤️', title:'Family Receives Food', desc:'Delivery is confirmed with proof. Your impact is tracked and shared.' },
          ].map(s => (
            <div key={s.n} className="how-card">
              <div className="how-num">{s.n}</div>
              <span className="how-icon">{s.ico}</span>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── HUNGER HEATMAP / NEARBY ─────────────── */}
    <section className="sec sec-cream" id="heatmap">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🗺️ Live Map</div>
          <h2 className="sec-title">Hunger Hotspots Near You</h2>
          <p className="sec-sub">See where food is needed most and where donors are active right now.</p>
        </div>
        <div className="hmap-layout">
          {/* Map */}
          <div className="hmap-main">
            <div className="hmap-header">
              <div>
                <p className="poppins f-700 text-md">Live — Tamil Nadu</p>
                <p className="clr-soft text-sm mt-1">Refreshes every 2 min</p>
              </div>
              <div className="flex gap-2">
                <span className="status-chip s-pending">🔴 12 High Demand</span>
                <span className="status-chip s-delivered">🟢 18 Donors Active</span>
              </div>
            </div>
            <div className="hmap-canvas">
              {/* blobs */}
              {[
                { top:'18%', left:'28%', size:90, color:'rgba(220,38,38,.25)', delay:'0s' },
                { top:'45%', left:'55%', size:70, color:'rgba(249,115,22,.2)', delay:'.8s' },
                { top:'65%', left:'22%', size:55, color:'rgba(22,163,74,.22)', delay:'1.6s' },
                { top:'30%', left:'68%', size:45, color:'rgba(37,99,235,.18)', delay:'2.4s' },
                { top:'72%', left:'52%', size:40, color:'rgba(22,163,74,.18)', delay:'3.2s' },
              ].map((b,i) => (
                <div key={i} className="hmap-blob" style={{ top:b.top, left:b.left, width:b.size, height:b.size, background:b.color, animationDelay:b.delay }} />
              ))}
              <div className="hmap-center">
                <p className="poppins f-800 text-lg clr-text">🗺️ Hunger Heatmap</p>
                <p className="clr-soft text-sm mt-1">12 cities · 70+ active zones</p>
                <div className="flex gap-4 mt-3 justify-c">
                  <span className="text-xs f-700 clr-red">● 5 Critical</span>
                  <span className="text-xs f-700 clr-green">● 18 Donors Online</span>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="hmap-side">
            <div className="hmap-panel">
              <p className="poppins f-700 mb-4">🔥 Top Hotspots</p>
              {[
                { area:'Dharavi, Chennai', n:24, dot:'#DC2626', bg:'#FEF2F2' },
                { area:'Adyar, Chennai', n:18, dot:'#D97706', bg:'#FEF3C7' },
                { area:'Velachery', n:12, dot:'#16A34A', bg:'#F0FDF4' },
                { area:'Anna Nagar', n:9, dot:'#2563EB', bg:'#EFF6FF' },
                { area:'T Nagar', n:7, dot:'#2563EB', bg:'#EFF6FF' },
              ].map(h => (
                <div key={h.area} className="flex items-c justify-b mb-3 p-4 rounded" style={{ background:h.bg, borderRadius:12 }}>
                  <div className="flex items-c gap-2">
                    <div style={{ width:9, height:9, borderRadius:'50%', background:h.dot }} />
                    <div>
                      <p className="text-sm f-600">{h.area}</p>
                      <p className="text-xs clr-soft">{h.n} requests</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">Help →</button>
                </div>
              ))}
            </div>
            <div className="hmap-panel">
              <p className="poppins f-700 mb-4">📊 Right Now</p>
              {[['🍱','Active donors','18'],['🚴','On-duty volunteers','7'],['📦','Pending pickups','12'],['🆘','SOS requests','3']].map(([i,l,v]) => (
                <div key={l} className="flex items-c justify-b mb-3">
                  <span className="text-sm clr-soft">{i} {l}</span>
                  <span className="poppins f-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── VERIFIED NGO PARTNERS ───────────────── */}
    <section className="sec" style={{ background:'#fff' }} id="ngo-dashboard">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">🏢 Partners</div>
          <h2 className="sec-title">Verified NGO & Trust Partners</h2>
          <p className="sec-sub">Every organization on our platform is verified, trained, and accountable. No middlemen — just trusted hunger relief.</p>
        </div>
        <div className="ngo-grid">
          {ngos.map(n => (
            <div key={n.name} className="ngo-card">
              <div className="ngo-top">
                <div className="ngo-ava">{n.e}</div>
                <div>
                  <p className="poppins f-700 text-md mb-1">{n.name}</p>
                  <span className="ngo-verified">✅ Verified NGO</span>
                </div>
              </div>
              <p className="text-sm clr-soft mb-4">📍 {n.area}</p>
              <div className="ngo-stats">
                <div style={{ textAlign:'center' }}>
                  <span className="ngo-stat-val">{n.del}</span>
                  <span className="ngo-stat-lbl">Deliveries</span>
                </div>
                <div style={{ textAlign:'center' }}>
                  <span className="ngo-stat-val">{n.vol}</span>
                  <span className="ngo-stat-lbl">Volunteers</span>
                </div>
                <div style={{ textAlign:'center' }}>
                  <span className="ngo-stat-val">{n.rating}★</span>
                  <span className="ngo-stat-lbl">Rating</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" style={{ flex:1 }}>Connect</button>
                <button className="btn btn-outline btn-sm">📞</button>
              </div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div className="mt-12 text-c" style={{ background:'var(--g-mint)', borderRadius:'var(--r-xl)', padding:'48px 32px', border:'1px solid #BBF7D0' }}>
          <p className="poppins f-800 text-2xl mb-3">Is your NGO ready to join?</p>
          <p className="clr-soft mb-6 mx-auto" style={{ maxWidth:420 }}>Register as a verified partner and start receiving food donations in your area today.</p>
          <button className="btn btn-primary btn-lg">Register Your NGO</button>
        </div>
      </div>
    </section>

    {/* ── SUCCESS STORIES ─────────────────────── */}
    <section className="sec sec-cream">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-tag">💚 Real Impact</div>
          <h2 className="sec-title">Stories That Drive Us</h2>
          <p className="sec-sub">Behind every number is a person. Here are some of the real stories from our community.</p>
        </div>
        <div className="stories-grid">
          {stories.map(s => (
            <div key={s.title} className="story-card">
              <div className="story-img" style={{ background:s.bg }}>
                <span style={{ fontSize:'5rem' }}>{s.icon}</span>
                <div className="story-outcome">{s.outcome}</div>
              </div>
              <div className="story-body">
                <span className="story-tag">{s.tag}</span>
                <div className="story-title">{s.title}</div>
                <div className="story-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── SOS EMERGENCY ───────────────────────── */}
    <section className="sec" style={{ background:'#fff' }}>
      <div className="wrap">
        <div className="sos-wrap">
          <div style={{ position:'relative', zIndex:2 }}>
            <div className="sos-pill">🆘 Emergency</div>
            <div className="sos-h2">Need Food Urgently?</div>
            <p className="sos-p">Are you or someone nearby starving right now? Our SOS system dispatches volunteers within 30 minutes. No questions asked.</p>
            <div className="flex gap-4 justify-c flex-wrap">
              <button className="btn btn-red btn-lg" onClick={() => go('request')}>🆘 Send SOS Request</button>
              <button className="btn btn-outline btn-lg" style={{ borderColor:'var(--red)', color:'var(--red)' }}>📞 Call Helpline</button>
            </div>
            <p className="text-sm clr-soft mt-4">Average response time: <strong style={{ color:'var(--red)' }}>28 minutes</strong> · Available 24 / 7</p>
          </div>
        </div>
      </div>
    </section>

    {/* ── FOOTER ──────────────────────────────── */}
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="flex items-c gap-2 mb-2">
              <div className="nav-logo-box">🍽️</div>
              <span className="poppins f-700 text-lg clr-white">Food For Hungry</span>
            </div>
            <p className="footer-tag">"No food should go to waste<br />when someone nearby is hungry."</p>
            <div className="flex gap-2 mt-6">
              {['📘','📸','🐦','▶️'].map(i => (
                <button key={i} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.1)', border:'none', cursor:'pointer', fontSize:'1rem' }}>{i}</button>
              ))}
            </div>
          </div>
          {[
            ['Platform', ['Donate Food','Request Food','Track Delivery','Hunger Heatmap','Scheduled Donations']],
            ['Community', ['Become Volunteer','Partner NGO','Corporate CSR','Success Stories','Leaderboard']],
            ['Support', ['About Us','Privacy Policy','Terms of Use','Contact Us','Report Issue']],
          ].map(([h,links]) => (
            <div key={h}>
              <div className="footer-col-h">{h}</div>
              {links.map(l => <button key={l} className="footer-a">{l}</button>)}
            </div>
          ))}
        </div>
        <div className="footer-bar">
          <p className="footer-copy">© 2024 Food For Hungry. All rights reserved.</p>
          <p className="footer-copy">Made with ❤️ to fight hunger in Tamil Nadu</p>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;
