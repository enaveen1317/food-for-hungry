import React, { useState } from 'react';
import {
  CheckCircle, MapPin, Star, TrendingUp, Bell,
  ChevronDown, Filter, Calendar, Shield, Package,
  Users, Leaf, Utensils, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import donorFoodImg from '../assets/donor-food-card.png';

/* ── Sparkline ───────────────────────────────────────────────── */
function Spark({ data, color }) {
  const W = 64, H = 28;
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / r) * H * 0.82 - 2}`).join(' ');
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * W} cy={H - ((data[data.length - 1] - min) / r) * H * 0.82 - 2} r="3" fill={color} />
    </svg>
  );
}

/* ── Progress Steps ──────────────────────────────────────────── */
const STEPS = [
  { label: 'Submitted', time: '9:15 AM', icon: '📋' },
  { label: 'Accepted',  time: '9:28 AM', icon: '✅' },
  { label: 'Picked Up', time: '9:41 AM', icon: '📦' },
  { label: 'In Transit',time: '10:10 AM',icon: '🚚' },
  { label: 'Delivered', time: 'Pending', icon: '🏠' },
];

const DonorDashboard = () => {
  const [tab, setTab] = useState('active');
  const { donations } = useApp();

  const activeDonations = donations
    .filter(d => d.progress < 5)
    .map(d => ({
      id: d.id,
      food: d.food,
      qty: d.qty,
      category: d.category,
      progress: d.progress || 1,
      volunteer: d.volunteer || 'Pending',
      volunteerRating: d.volunteer ? 4.9 : 0,
      ngo: d.ngo || 'Assigning NGO...',
      address: d.address,
      time: d.time || 'Just now',
      serves: `~${parseInt(d.qty) * (d.qty.includes('kg') ? 2.5 : 1) || 20} People`,
      weight: d.qty
    }));

  const pastDonations = donations
    .filter(d => d.progress === 5)
    .map(d => ({
      id: d.id,
      food: d.food,
      qty: d.qty,
      date: d.date || 'Recently',
      ngo: d.ngo,
      meals: Math.floor(parseInt(d.qty) * (d.qty.includes('kg') ? 2.5 : 1)) || 20
    }));

  const STATS = [
    { icon: <Package size={16} />, value: '24',     label: 'Total Rescues',  pct: 20, color: '#60A5FA', spark: [12,15,14,17,19,20,24] },
    { icon: <Utensils size={16} />, value: '640',   label: 'Meals Provided', pct: 28, color: '#4ADE80', spark: [380,440,490,530,570,610,640] },
    { icon: <Users size={16} />,    value: '1,280', label: 'People Served',  pct: 16, color: '#FBBF24', spark: [800,920,1010,1080,1150,1220,1280] },
    { icon: <Leaf size={16} />,     value: '148 kg',label: 'CO₂ Saved',      pct: 18, color: '#A78BFA', spark: [80,96,108,118,128,138,148] },
  ];

  return (
    <div id="donor-dashboard" style={{
      background: 'linear-gradient(150deg,#071810 0%,#0B1F14 45%,#0C1926 100%)',
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: "'Inter','Poppins',sans-serif",
    }}>
      <style>{`
        @keyframes dd-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .dd-in { animation: dd-in 0.35s ease both; }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.15)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
        .glow-dot { animation: glow-pulse 2s infinite; }
        .dd-tab:hover { background: rgba(255,255,255,0.1) !important; color: #cbd5e1 !important; }
        .dd-filter:hover { border-color: rgba(74,222,128,0.4) !important; color: #4ADE80 !important; }
        .dd-tr:hover td { background: rgba(74,222,128,0.05); }
        .stat-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── HEADER (fixed height) ───────────────────────────────── */}
      <div className="dd-in" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.25)', flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '9999px', padding: '3px 12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem' }}>🎁</span>
            <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.65rem', color: '#4ADE80', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Donor Portal</span>
          </div>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '1.4rem', color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>My Impact Dashboard</h2>
        </div>
      </div>

      {/* ── STAT CARDS (fixed height) ────────────────────────────── */}
      <div className="dd-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', padding: '10px 32px', flexShrink: 0, animationDelay: '0.05s' }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card" style={{
            background: `linear-gradient(135deg, rgba(${s.color === '#60A5FA' ? '30,64,175' : s.color === '#4ADE80' ? '20,83,45' : s.color === '#FBBF24' ? '120,53,15' : '76,29,149'},0.35) 0%, rgba(0,0,0,0.2) 100%)`,
            border: `1px solid ${s.color}28`, borderRadius: '14px', padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: '10px',
            position: 'relative', overflow: 'hidden', cursor: 'default',
            transition: 'transform 0.2s ease', boxShadow: `0 4px 20px ${s.color}10`,
          }}>
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${s.color},${s.color}44)` }} />
            {/* Icon */}
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '1.25rem', color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                <TrendingUp size={10} color="#22C55E" />
                <span style={{ fontSize: '0.62rem', color: '#22C55E', fontWeight: 700 }}>{s.pct}% this month</span>
              </div>
            </div>
            {/* Sparkline */}
            <div style={{ flexShrink: 0 }}><Spark data={s.spark} color={s.color} /></div>
          </div>
        ))}
      </div>

      {/* ── TABS + FILTERS (fixed height) ───────────────────────── */}
      <div className="dd-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px 8px', flexShrink: 0, animationDelay: '0.08s' }}>
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px', borderRadius: '10px' }}>
          {['active','history'].map(t => (
            <button key={t} className="dd-tab" onClick={() => setTab(t)} style={{
              padding: '6px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.75rem',
              background: tab === t ? 'linear-gradient(135deg,#22C55E,#16A34A)' : 'transparent',
              color: tab === t ? 'white' : '#64748B',
              boxShadow: tab === t ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
              transition: 'all 0.2s ease', textTransform: 'capitalize',
            }}>{t === 'active' ? 'Active Donations' : 'History Donations'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ icon: <Filter size={12} />, label: 'All Status' }, { icon: <Calendar size={12} />, label: 'This Month' }].map((f, i) => (
            <button key={i} className="dd-filter" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', cursor: 'pointer', transition: 'all 0.2s' }}>
              {f.icon}{f.label}<ChevronDown size={10} />
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT (fills remaining space) ─────────────────── */}
      <div style={{ flex: 1, padding: '0 32px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* ACTIVE TAB */}
        {tab === 'active' && activeDonations.length === 0 && (
          <div className="dd-in" style={{ flex: 1, background: 'rgba(11,31,20,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#94A3B8' }}>
            <Package size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1.1rem', color: 'white' }}>No Active Donations</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Your rescued food will appear here once dispatched.</p>
          </div>
        )}
        {tab === 'active' && activeDonations.length > 0 && activeDonations.slice(0,1).map((don) => {
          const prog = don.progress || 4;
          const pct = ((prog - 1) / (STEPS.length - 1)) * 100;
          return (
            <div key={don.id} className="dd-in" style={{
              flex: 1, background: 'rgba(11,31,20,0.85)', backdropFilter: 'blur(20px)',
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(34,197,94,0.18)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', animationDelay: '0.1s',
            }}>
              {/* Card body — image + info + side */}
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 190px', flex: 1, overflow: 'hidden' }}>

                {/* Photo */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={donorFoodImg} alt={don.food} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,31,20,0) 30%, rgba(11,31,20,0.85) 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,31,20,0.7) 0%, transparent 50%)' }} />
                  {/* Status badge */}
                  <div className="glow-dot" style={{ position: 'absolute', bottom: '12px', left: '10px', background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: 'white', fontSize: '0.62rem', fontWeight: 800, padding: '3px 9px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white', opacity: 0.9 }} />
                    In Progress
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#4ADE80', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>{don.id}</p>
                    <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: 'white', lineHeight: 1.25, marginBottom: '6px' }}>{don.food}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px' }}>
                      <MapPin size={11} color="#EF4444" />{don.address}
                    </div>
                    {/* Chips */}
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {[
                        { e: '👥', t: don.serves },
                        { e: '📦', t: don.weight },
                        { e: '🕐', t: `Today, ${don.time}` },
                        { e: '🥗', t: don.category },
                      ].map((c, ci) => (
                        <span key={ci} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9999px', padding: '3px 8px', fontSize: '0.67rem', fontWeight: 600, color: '#CBD5E1' }}>
                          {c.e} {c.t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Progress bar area */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rescue Progress</span>
                      <span style={{ fontSize: '0.65rem', color: '#4ADE80', fontWeight: 800 }}>{Math.round(pct)}% Complete</span>
                    </div>
                    {/* Progress rail */}
                    <div style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', marginBottom: '10px' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '9999px', width: `${pct}%`, background: 'linear-gradient(90deg,#22C55E,#4ADE80)', boxShadow: '0 0 6px rgba(34,197,94,0.6)', transition: 'width 1s ease' }} />
                      {STEPS.map((_, si) => {
                        const lp = (si / (STEPS.length - 1)) * 100;
                        const done = prog > si, curr = prog === si + 1;
                        return (
                          <div key={si} style={{ position: 'absolute', top: '50%', left: `${lp}%`, transform: 'translate(-50%,-50%)', width: curr ? '14px' : '10px', height: curr ? '14px' : '10px', borderRadius: '50%', background: done || curr ? '#22C55E' : 'rgba(255,255,255,0.12)', border: done || curr ? '2px solid #4ADE80' : '1.5px solid rgba(255,255,255,0.1)', zIndex: 2, boxShadow: curr ? '0 0 0 4px rgba(34,197,94,0.2)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                            {done && <CheckCircle size={6} color="white" />}
                          </div>
                        );
                      })}
                    </div>
                    {/* Step labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {STEPS.map((s, si) => {
                        const done = prog > si, curr = prog === si + 1;
                        return (
                          <div key={si} style={{ textAlign: 'center', flex: 1 }}>
                            <p style={{ fontSize: '0.62rem', fontWeight: 700, color: done || curr ? 'white' : '#334155', fontFamily: 'Poppins', lineHeight: 1.2 }}>{s.label}</p>
                            <p style={{ fontSize: '0.58rem', color: done ? '#4ADE80' : curr ? '#FBBF24' : '#1E3A2F', fontWeight: 600, marginTop: '1px' }}>{s.time}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Side panel */}
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.25)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                  {/* ETA */}
                  <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                      <Clock size={10} color="#4ADE80" />
                      <span style={{ fontSize: '0.6rem', color: '#4ADE80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Delivery</span>
                    </div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '1rem', color: 'white' }}>10:42 AM</p>
                  </div>
                  {/* Volunteer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#FCD34D,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 900, fontSize: '0.7rem', color: 'white', flexShrink: 0 }}>AK</div>
                    <div>
                      <p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volunteer</p>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.78rem', color: 'white' }}>{don.volunteer}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
                        <Star size={9} color="#FBBF24" fill="#FBBF24" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FBBF24' }}>{don.volunteerRating}</span>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  {/* NGO */}
                  <div>
                    <p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>NGO Partner</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <Shield size={11} color="#4ADE80" />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.76rem', color: 'white' }}>{don.ngo}</span>
                    </div>
                    <span style={{ marginTop: '4px', fontSize: '0.6rem', fontWeight: 800, color: '#4ADE80', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle size={8} /> Verified
                    </span>
                  </div>
                  {/* Quick action */}
                  <button 
                    onClick={() => {
                      const el = document.getElementById('volunteer-dashboard');
                      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
                    }}
                    style={{ marginTop: 'auto', width: '100%', background: 'linear-gradient(135deg,#22C55E,#16A34A)', border: 'none', borderRadius: '8px', padding: '7px', color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.73rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.3)' }}
                  >
                    Track Live 📍
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div className="dd-in" style={{ flex: 1, background: 'rgba(11,31,20,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(34,197,94,0.18)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', animationDelay: '0.1s' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>📋 Donation History</h4>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{pastDonations.length} records</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1 }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Donation ID','Food Details','Quantity','NGO Partner','Date','Meals','Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.62rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pastDonations.map((d) => (
                  <tr key={d.id} className="dd-tr" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'default' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.73rem', color: '#4ADE80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.18)', padding: '2px 9px', borderRadius: '9999px' }}>{d.id}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.82rem', color: 'white' }}>{d.food}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>{d.qty}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600 }}>{d.ngo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{d.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800 }}>{d.meals}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.12)', color: '#4ADE80', fontSize: '0.67rem', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.25)' }}>
                        <CheckCircle size={9} /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
