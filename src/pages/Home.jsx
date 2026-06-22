import React from 'react';

const go = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
};

const Home = () => (
  <div>

    {/* ═══════════════════════════════════════════════
        1. HERO — emotional, warm, grounded
    ═══════════════════════════════════════════════ */}
    <section className="hero" id="home">
      <div className="wrap hero-layout">

        {/* Left — headline */}
        <div>
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            Active in Chennai &amp; 11 cities across Tamil Nadu
          </div>
          <h1 className="hero-h1">
            Good food should never go to waste when someone nearby is <em>hungry.</em>
          </h1>
          <p className="hero-sub">
            Food For Hungry helps homes, restaurants, hotels, events, and community kitchens share surplus food with nearby NGOs, volunteers, shelters, and families who need a meal.
          </p>
          <div className="hero-btns">
            <button className="btn btn-clay btn-lg" onClick={() => go('donate')}>🍱 Donate Food</button>
            <button className="btn btn-outline btn-lg" style={{ borderColor:'rgba(255,255,255,.3)', color:'#fff' }} onClick={() => go('request')}>Request a Meal</button>
          </div>
          <div className="hero-trust">
            <span className="hero-trust-item">Local NGO network</span>
            <span className="hero-trust-item">Volunteer pickup support</span>
            <span className="hero-trust-item">Safe food handoff</span>
            <span className="hero-trust-item">Fast nearby delivery</span>
          </div>
        </div>

        {/* Right — real service flow card */}
        <div>
          <div style={{ marginBottom:10 }}>
            <p style={{ fontSize:'.74rem', color:'rgba(255,255,255,.5)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12 }}>
              Tonight's food rescue — live
            </p>
          </div>
          <div className="hero-flow-card">
            {/* Step 1 */}
            <div className="flow-step">
              <div className="flow-step-ico" style={{ background:'rgba(154,230,180,.12)' }}>🍛</div>
              <div className="flow-step-text">
                <div className="flow-step-title">Hotel Saravana Bhavan, Anna Nagar</div>
                <div className="flow-step-meta">Dal rice + sambar — ~30 plates · Prepared 45 min ago</div>
              </div>
              <span className="flow-step-badge badge-done">Listed ✓</span>
            </div>
            <div className="flow-connector" />

            {/* Step 2 */}
            <div className="flow-step">
              <div className="flow-step-ico" style={{ background:'rgba(251,191,36,.1)' }}>🚴</div>
              <div className="flow-step-text">
                <div className="flow-step-title">Karthik S. — Volunteer</div>
                <div className="flow-step-meta">En route pickup · Anna Nagar → T Nagar · ETA 18 min</div>
              </div>
              <span className="flow-step-badge badge-active">Picking up</span>
            </div>
            <div className="flow-connector" />

            {/* Step 3 */}
            <div className="flow-step">
              <div className="flow-step-ico" style={{ background:'rgba(255,255,255,.06)' }}>🏢</div>
              <div className="flow-step-text">
                <div className="flow-step-title">Feeding India Trust, T Nagar</div>
                <div className="flow-step-meta">Confirmed handoff · Night shelter — 24 residents</div>
              </div>
              <span className="flow-step-badge badge-waiting">Awaiting</span>
            </div>
            <div className="flow-connector" />

            {/* Step 4 */}
            <div className="flow-step">
              <div className="flow-step-ico" style={{ background:'rgba(255,255,255,.06)' }}>👨‍👩‍👧</div>
              <div className="flow-step-text">
                <div className="flow-step-title">Women's Night Shelter</div>
                <div className="flow-step-meta">Delivery expected by 9:30 PM · Serves 30 people</div>
              </div>
              <span className="flow-step-badge badge-waiting">Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        2. HOW TONIGHT'S FOOD GETS RESCUED — timeline
    ═══════════════════════════════════════════════ */}
    <section className="sec-a bg-beige">
      <div className="wrap">
        <div style={{ maxWidth:580, marginBottom:48 }}>
          <span className="sec-kicker">How it works</span>
          <h2 style={{ fontSize:'1.7rem', marginBottom:12 }}>How tonight's food gets rescued</h2>
          <p className="cs" style={{ fontSize:'.95rem', lineHeight:1.75 }}>
            From your kitchen to someone's plate — usually within 90 minutes. Here's how the chain works.
          </p>
        </div>
        <div className="how-flow">
          {[
            { n:'1', ico:'📦', title:'Donor shares food', desc:'A home, hotel, or event lists surplus food — what it is, how much, when it\'s ready for pickup.', note:'Takes 2 minutes to post' },
            { n:'2', ico:'🔔', title:'Nearby volunteer gets alerted', desc:'Our system alerts volunteers within 3 km. Whoever accepts first gets the pickup task with a route.', note:'Alert sent instantly' },
            { n:'3', ico:'🤝', title:'NGO / trust confirms handoff', desc:'The receiving NGO or shelter confirms they can receive it. Food is handed off with a photo proof.', note:'Confirmation in minutes' },
            { n:'4', ico:'🍽️', title:'Meals reach people', desc:'Families, shelter residents, elderly homes, and migrant workers receive fresh, safe, and dignified meals.', note:'Delivery confirmed' },
          ].map(s => (
            <div key={s.n} className="how-step">
              <div className="how-step-num">{s.n}</div>
              <span className="how-step-ico">{s.ico}</span>
              <div className="how-step-title">{s.title}</div>
              <div className="how-step-desc">{s.desc}</div>
              <span className="how-step-note">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        3. LIVE LOCAL IMPACT — grounded, believable
    ═══════════════════════════════════════════════ */}
    <section className="sec-b bg-white">
      <div className="wrap">
        <span className="sec-kicker">This week</span>
        <h2 style={{ fontSize:'1.6rem', marginBottom:8 }}>What's happening in your city</h2>
        <p className="cs sm mb-8" style={{ maxWidth:440 }}>Real numbers from this week. Not projections, not cumulative totals — just what's happening right now.</p>
        <div className="impact-layout">
          <div className="impact-card">
            <span className="impact-n">847</span>
            <span className="impact-l">Meals shared this week</span>
            <span className="impact-badge">↑ 12% vs last week</span>
          </div>
          <div className="impact-card">
            <span className="impact-n">34</span>
            <span className="impact-l">Active volunteers today</span>
            <span className="impact-badge">Across 8 areas</span>
          </div>
          <div className="impact-card">
            <span className="impact-n">18</span>
            <span className="impact-l" style={{ color:'var(--red)' }}>Open food requests</span>
            <div style={{ marginTop:10, fontSize:'.72rem', color:'var(--red)', fontWeight:600 }}>Needs donors now</div>
          </div>
          <div className="impact-card impact-card-wide">
            <p className="xs uc ls cw" style={{ opacity:.5, marginBottom:12 }}>Partner network</p>
            <span className="impact-n impact-n-white">28</span>
            <span className="impact-l impact-l-white" style={{ marginBottom:16 }}>Verified NGOs &amp; community kitchens</span>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:12 }}>
              {['Children','Elderly','Shelters','Migrants','Disaster relief'].map(t => (
                <span key={t} style={{ fontSize:'.68rem', fontWeight:600, padding:'3px 9px', borderRadius:999, background:'rgba(255,255,255,.1)', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.1)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        4. QUICK ACTIONS — entry points, not features
    ═══════════════════════════════════════════════ */}
    <section className="sec-b bg-beige">
      <div className="wrap">
        <span className="sec-kicker">Get involved</span>
        <h2 style={{ fontSize:'1.6rem', marginBottom:32 }}>What would you like to do?</h2>
        <div className="qa-grid">
          {[
            { ico:'🍱', bg:'#F0FFF4', bdr:'#C6F6D5', clr:'var(--green)', h:'I want to donate food', p:'Have leftovers from an event, restaurant, or home kitchen? List it — we handle the rest.', link:'Start donating', id:'donate' },
            { ico:'🙏', bg:'var(--orange-tint)', bdr:'#FDDCB5', clr:'var(--orange)', h:'I need food support', p:'For a family, shelter, elderly home, or street community. No forms, no waiting — just help.', link:'Request a meal', id:'request' },
            { ico:'🚴', bg:'var(--green-tint)', bdr:'#C6F6D5', clr:'var(--green)', h:'I want to volunteer', p:'Pick up food from donors nearby and deliver to shelters and families. Flexible hours.', link:'Become a volunteer', id:'volunteers' },
            { ico:'🏢', bg:'var(--beige-dark)', bdr:'var(--border)', clr:'var(--text)', h:'I run an NGO or shelter', p:'Register as a verified partner. Receive incoming food offers and manage deliveries.', link:'Join as NGO partner', id:'ngo-dashboard' },
          ].map(c => (
            <div key={c.id} className="qa-card" style={{ background:c.bg, borderColor:c.bdr }} onClick={() => go(c.id)}>
              <div className="qa-ico">{c.ico}</div>
              <div className="qa-h">{c.h}</div>
              <div className="qa-p">{c.p}</div>
              <button className="qa-link" style={{ color:c.clr }}>{c.link} →</button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        5. URGENT REQUESTS — real, personal, alive
    ═══════════════════════════════════════════════ */}
    <section className="sec-a bg-white" id="open-requests">
      <div className="wrap">
        <div className="flex ic jb mb-8" style={{ flexWrap:'wrap', gap:12 }}>
          <div>
            <span className="sec-kicker sec-kicker-orange">Urgent · Open now</span>
            <h2 style={{ fontSize:'1.6rem' }}>Food requests near you</h2>
          </div>
          <button className="btn btn-outline btn-sm">See all requests</button>
        </div>
        <div className="requests-layout">
          {/* Request cards */}
          <div className="req-list">
            {[
              { ico:'🏠', icobg:'#FEF3C7', title:'Dinner needed for 18 children at Annai Children\'s Shelter', meta:'Adyar, Chennai · Tonight by 8:00 PM · Any cooked meal, veg preferred', urgent:true, tags:['Urgent','18 children','Tonight'], id:'req-1' },
              { ico:'👴', icobg:'var(--orange-tint)', title:'Packed meals needed for elderly home — 40 residents', meta:'T Nagar · Ongoing · Tiffin-style meals preferred, soft food if possible', urgent:false, tags:['Recurring','40 people','Lunch + Dinner'], id:'req-2' },
              { ico:'🌧️', icobg:'var(--green-tint)', title:'Extra rice and curry can serve ~25 people nearby', meta:'Velachery · Flexible timing · A family has surplus from a ceremony', urgent:false, tags:['Available donor','25 people','This evening'], id:'req-3' },
              { ico:'👷', icobg:'var(--beige-dark)', title:'Packed meals needed for migrant workers — construction site', meta:'Ambattur · Daily · 35–40 workers, any filling meal', urgent:true, tags:['Daily need','40 workers','Lunch'], id:'req-4' },
            ].map(r => (
              <div key={r.id} className={`req-card${r.urgent ? ' req-card-urg' : ''}`}>
                <div className="req-ico" style={{ background:r.icobg }}>{r.ico}</div>
                <div className="req-body">
                  <div className="req-title">{r.title}</div>
                  <div className="req-meta">{r.meta}</div>
                  <div className="req-tags">
                    {r.tags.map(t => (
                      <span key={t} className={`req-tag ${r.urgent && t === 'Urgent' ? 'req-tag-urg' : t.includes('donor') ? 'req-tag-avail' : ''}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="req-action">
                  <button className={`btn btn-sm ${r.urgent ? 'btn-red' : 'btn-green'}`}>
                    {r.urgent ? '🆘 Help now' : 'Respond'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="req-sidebar">
            <div className="req-map">
              <span>🗺️</span>
              <div className="req-map-label">
                📍 4 open requests in Chennai right now
              </div>
            </div>
            <div style={{ background:'var(--beige)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:20 }}>
              <p className="f700 sm mb-3">🚴 Volunteers nearby</p>
              {[
                { name:'Karthik S.', area:'Anna Nagar', status:'On delivery' },
                { name:'Meena R.', area:'Adyar', status:'Available' },
                { name:'Pradeep K.', area:'Velachery', status:'Available' },
              ].map((v,i) => (
                <div key={i} className="flex ic jb mb-3">
                  <div className="flex ic g2">
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--green-soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>🧑</div>
                    <div>
                      <p className="sm f600">{v.name}</p>
                      <p className="xs cs">{v.area}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:'.7rem', fontWeight:700, color: v.status === 'Available' ? 'var(--green)' : 'var(--orange)', background: v.status === 'Available' ? 'var(--green-tint)' : 'var(--orange-tint)', padding:'2px 9px', borderRadius:999 }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        6. FOOD RESCUE STORIES — human, narrative
    ═══════════════════════════════════════════════ */}
    <section className="sec-a bg-beige" id="stories">
      <div className="wrap">
        <span className="sec-kicker">Real stories</span>
        <h2 style={{ fontSize:'1.6rem', marginBottom:8 }}>Food that found its way to someone who needed it</h2>
        <p className="cs sm mb-8" style={{ maxWidth:500 }}>These aren't testimonials. These are things that actually happened through our network in the past month.</p>

        <div className="stories-layout">
          {/* Large story */}
          <div className="story-card story-card-lg">
            <div className="story-thumb" style={{ background:'#FEF3C7' }}>
              <span>🍛</span>
              <div className="story-thumb-tag">Wedding · Chennai</div>
            </div>
            <div className="story-body">
              <div className="story-date">June 18, 2024 · 7:45 PM</div>
              <div className="story-h">A wedding feast in Perambur fed 200 residents of a night shelter — the same night</div>
              <p className="story-p">
                Ramesh's daughter's wedding had 300 extra plates of food. Instead of throwing it away, he called us at 7 PM. By 8:30 PM, three volunteers had picked it up and delivered hot meals to two shelters in North Chennai. The shelter manager said it was the first time in three weeks they had a full hot dinner for everyone.
              </p>
              <div className="story-outcome">
                ✓ 200 people ate that night · 3 volunteers · 90 min end to end
              </div>
            </div>
          </div>

          {/* Two smaller stories */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="story-card">
              <div className="story-thumb" style={{ background:'#EFF6FF', height:130 }}>
                <span>🌧️</span>
                <div className="story-thumb-tag">Emergency · Flood Relief</div>
              </div>
              <div className="story-body">
                <div className="story-date">June 4, 2024 · During heavy rains</div>
                <div className="story-h">Home-cooked food reached flood-displaced families in Tambaram</div>
                <p className="story-p">When the rains hit, 12 neighbours started cooking. We coordinated the pickup and delivery to a temporary relief camp — 180 packets in 4 hours.</p>
                <div className="story-outcome">✓ 180 meals · 12 home donors · 4 hrs</div>
              </div>
            </div>
            <div className="story-card">
              <div className="story-thumb" style={{ background:'#F0FFF4', height:130 }}>
                <span>🏗️</span>
                <div className="story-thumb-tag">Ongoing · Daily</div>
              </div>
              <div className="story-body">
                <div className="story-date">Since May 2024 · Every weekday</div>
                <div className="story-h">A restaurant in Adyar now donates leftover lunch meals to migrant construction workers</div>
                <p className="story-p">Green Bowl restaurant started with us in May. They now donate ~40 meals every afternoon. A volunteer picks up at 2:30 PM, drops to the site by 3:15 PM.</p>
                <div className="story-outcome">✓ 800+ meals so far · 1 donor · 1 volunteer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        7. VERIFIED NGOs — operational, trusted
    ═══════════════════════════════════════════════ */}
    <section className="sec-a bg-white" id="ngo-dashboard">
      <div className="wrap">
        <div className="flex ic jb mb-8" style={{ flexWrap:'wrap', gap:12 }}>
          <div>
            <span className="sec-kicker">Partner network</span>
            <h2 style={{ fontSize:'1.6rem' }}>Verified local NGOs &amp; community kitchens</h2>
          </div>
          <button className="btn btn-outline btn-sm">Register your NGO</button>
        </div>
        <div className="ngo-grid">
          {[
            { e:'🏛️', name:'Feeding India — Chennai Chapter', area:'North &amp; Central Chennai', del:1240, vol:34, focus:['Children','Night shelters','Elderly'], rating:'4.9' },
            { e:'🤝', name:'Annai Trust', area:'Coimbatore · Serves 8 zones', del:876, vol:22, focus:['Women','Street community','Orphans'], rating:'4.8' },
            { e:'🌱', name:'Hope Foundation', area:'Madurai city &amp; outskirts', del:643, vol:18, focus:['Elderly','Migrants','Disaster relief'], rating:'4.7' },
            { e:'♻️', name:'No Food Waste NGO', area:'Trichy · 5 distribution points', del:987, vol:29, focus:['Schools','Children','Daily meals'], rating:'4.9' },
            { e:'❤️', name:'Serve India — Salem Unit', area:'Salem &amp; surrounding areas', del:421, vol:12, focus:['Elderly homes','Shelters'], rating:'4.6' },
            { e:'🍲', name:'Goonj Tamil Nadu', area:'Tirunelveli · Tuticorin', del:554, vol:16, focus:['Disaster relief','Women','Migrants'], rating:'4.7' },
          ].map(n => (
            <div key={n.name} className="ngo-card">
              <div className="ngo-head">
                <div className="ngo-ava">{n.e}</div>
                <div>
                  <p className="f700 md" style={{ marginBottom:4 }}>{n.name}</p>
                  <span className="ngo-v">✅ Verified Partner</span>
                </div>
              </div>
              <div className="ngo-area">📍 <span dangerouslySetInnerHTML={{ __html: n.area }} /></div>
              <div className="ngo-focus">
                {n.focus.map(f => <span key={f} className="ngo-focus-chip">{f}</span>)}
              </div>
              <div className="ngo-stats">
                <div>
                  <span className="ngo-stat-v">{n.del}</span>
                  <span className="ngo-stat-l">Deliveries</span>
                </div>
                <div>
                  <span className="ngo-stat-v">{n.vol}</span>
                  <span className="ngo-stat-l">Volunteers</span>
                </div>
              </div>
              <div className="flex g2">
                <button className="btn btn-green btn-sm" style={{ flex:1 }}>Connect</button>
                <button className="btn btn-outline btn-sm">{n.rating} ★</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        8. SOS SECTION — warm urgent, not alarming
    ═══════════════════════════════════════════════ */}
    <section className="sec-b bg-beige">
      <div className="wrap">
        <div className="sos-band">
          <div style={{ position:'relative', zIndex:2 }}>
            <div className="sos-pill">🆘 Emergency Request</div>
            <h2 className="sos-h">Need food urgently for a family, shelter, or elderly home?</h2>
            <p className="sos-p">
              Send an SOS request and our team will reach out within 30 minutes. We work with volunteers and NGOs available around the clock — no one should go hungry overnight.
            </p>
            <div className="flex g3 jc fw">
              <button className="btn btn-red btn-lg" onClick={() => go('request')}>Send SOS Request</button>
              <button className="btn btn-outline btn-lg" style={{ borderColor:'rgba(255,255,255,.25)', color:'rgba(255,255,255,.8)' }}>📞 Emergency helpline</button>
            </div>
            <p className="sos-info">Average response: 28 min · Available 24 hours · No verification needed for emergencies</p>
          </div>
        </div>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════
        9. FOOTER — simple, warm, useful
    ═══════════════════════════════════════════════ */}
    <footer className="footer" id="about">
      <div className="wrap">
        <div className="footer-layout">
          <div>
            <div className="flex ic g3 mb-3">
              <div className="nav-logo-leaf">🌿</div>
              <span className="pops f700 lg cw">Food For Hungry</span>
            </div>
            <p className="footer-brand-tag">
              "A meal shared is a burden lifted. No food should go to waste when someone nearby is hungry."
            </p>
            <div className="footer-sos">
              <p className="xs f700 cr mb-1">🆘 Emergency?</p>
              <p className="xs cw" style={{ opacity:.6 }}>Call our 24/7 helpline or send an SOS request. We respond in under 30 minutes.</p>
            </div>
          </div>
          {[
            ['Platform', ['Donate Food','Request Food','Track Delivery','Hunger Map','Scheduled Donations']],
            ['Community', ['Become Volunteer','Partner NGO','Corporate CSR','Stories','Leaderboard']],
            ['About', ['Our Mission','How We Work','Contact Us','Privacy Policy','Terms of Use']],
          ].map(([h, links]) => (
            <div key={h}>
              <div className="footer-col-h">{h}</div>
              {links.map(l => <button key={l} className="footer-lnk">{l}</button>)}
            </div>
          ))}
        </div>
        <div className="footer-bot">
          <p className="footer-copy">© 2024 Food For Hungry. Made with care in Tamil Nadu.</p>
          <p className="footer-copy">Connecting surplus food with hungry lives, one meal at a time.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;
