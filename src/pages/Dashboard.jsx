import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Navigation, CheckCircle, Camera, Clock,
  Zap, Coffee, Activity, Wifi, ChevronRight, Star,
  Package, TrendingUp, Award, AlertCircle
} from 'lucide-react';
import { useApp, getTier, getTierProgress, getCoords } from '../context/AppContext';
import { useGpsSimulator } from '../hooks/useGpsSimulator';
import FleetLiveMap from '../components/FleetLiveMap';

/* ── Constants ─────────────────────────────────────────────────────────────── */
const STATUS_CFG = {
  Available:  { color:'#22c55e', bg:'#f0fdf4', border:'#86efac', dot:'#22c55e', label:'Available'  },
  Delivering: { color:'#f97316', bg:'#fff7ed', border:'#fed7aa', dot:'#f97316', label:'En Route'   },
  Break:      { color:'#eab308', bg:'#fefce8', border:'#fde68a', dot:'#eab308', label:'On Break'   },
  Offline:    { color:'#94a3b8', bg:'#f8fafc', border:'#cbd5e1', dot:'#94a3b8', label:'Offline'    },
};

const TIER_CFG = {
  Silver:   { color:'#64748b', gradient:'linear-gradient(135deg,#94a3b8,#64748b)', icon:'🥈', glow:'rgba(100,116,139,0.3)' },
  Gold:     { color:'#d97706', gradient:'linear-gradient(135deg,#fbbf24,#d97706)', icon:'🏅', glow:'rgba(217,119,6,0.3)' },
  Platinum: { color:'#7c3aed', gradient:'linear-gradient(135deg,#a78bfa,#7c3aed)', icon:'💎', glow:'rgba(124,58,237,0.3)' },
  Diamond:  { color:'#2563eb', gradient:'linear-gradient(135deg,#60a5fa,#2563eb)', icon:'💠', glow:'rgba(37,99,235,0.3)' },
};

function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return h > 0
    ? `${h}h ${String(m).padStart(2,'0')}m`
    : `${m}:${String(sc).padStart(2,'0')}`;
}

function fmtEta(min) {
  if (!min || min <= 0) return 'Arrived';
  return min < 60 ? `${Math.round(min)} min` : `${Math.floor(min/60)}h ${min%60}m`;
}

/* ── Reusable pill badge ────────────────────────────────────────────────────── */
function Pill({ children, color, bg, border, dot }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'6px',
      background:bg, border:`1px solid ${border}`, color,
      padding:'4px 13px', borderRadius:'9999px',
      fontSize:'0.76rem', fontWeight:700, fontFamily:'Poppins',
    }}>
      {dot && (
        <span style={{
          width:'7px', height:'7px', borderRadius:'50%', background:dot,
          animation:'fd-dot 1.8s ease-in-out infinite',
        }} />
      )}
      {children}
    </span>
  );
}

/* ── Driver Profile Card ─────────────────────────────────────────────────────── */
function DriverCard({ v, driverStatus, onStatus, hasActiveTask }) {
  const tier = getTier(v.points);
  const tc   = TIER_CFG[tier.name] || TIER_CFG.Gold;
  const sc   = STATUS_CFG[driverStatus] || STATUS_CFG.Offline;

  return (
    <div style={{
      background:'#fff',
      borderRadius:'24px',
      border:'1px solid #e2e8f0',
      boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
      overflow:'hidden',
    }}>
      {/* Header banner */}
      <div style={{
        background: tc.gradient,
        padding:'20px 22px 56px',
        position:'relative',
      }}>
        <div style={{ position:'absolute', top:14, right:16 }}>
          <Pill color={sc.color} bg="rgba(255,255,255,0.9)" border="rgba(255,255,255,0.6)" dot={sc.dot}>
            {sc.label}
          </Pill>
        </div>
        <div style={{
          position:'absolute', bottom:'-32px', left:'50%',
          transform:'translateX(-50%)',
          width:'64px', height:'64px', borderRadius:'50%',
          background:'white',
          boxShadow:`0 0 0 4px white, 0 6px 20px ${tc.glow}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'2rem',
        }}>
          {v.avatar || '🚴'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'44px 22px 22px', textAlign:'center' }}>
        <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.25rem', color:'#0f172a', marginBottom:'2px' }}>
          {v.name}
        </p>
        <p style={{ fontSize:'0.8rem', color: tc.color, fontWeight:700, marginBottom:'18px' }}>
          {tc.icon} {tier.name} Tier Fleet
        </p>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px' }}>
          {[
            { val: v.points.toLocaleString(), lbl:'Reward Points', color:'#16a34a' },
            { val: v.deliveries,              lbl:'Deliveries',    color:'#3b82f6' },
          ].map(s => (
            <div key={s.lbl} style={{
              background:'#f8fafc', borderRadius:'14px', padding:'14px 8px',
              border:'1px solid #e2e8f0',
            }}>
              <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.5rem', color:s.color, lineHeight:1 }}>
                {s.val}
              </p>
              <p style={{ fontSize:'0.68rem', fontWeight:600, color:'#94a3b8',
                textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'5px' }}>
                {s.lbl}
              </p>
            </div>
          ))}
        </div>

        {/* Status switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'8px' }}>
          <p style={{ fontSize:'0.72rem', color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', margin: 0 }}>
            Set Status
          </p>
          <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
            AUTO
          </span>
        </div>
        
        {hasActiveTask ? (
          <div style={{
            background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px',
            padding:'10px', color:'#ea580c', fontSize:'0.75rem', fontWeight:600, fontFamily:'Poppins',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            🚴 Status is automatically managed
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'6px' }}>
            {['Available', 'Break', 'Offline'].map((key) => {
              const c = STATUS_CFG[key];
              const active = driverStatus === key;
              return (
                <button key={key} onClick={() => onStatus(key)} style={{
                  padding:'8px 4px', borderRadius:'10px', border:'none', cursor:'pointer',
                  fontFamily:'Poppins', fontWeight:700, fontSize:'0.74rem',
                  background: active ? c.color : '#f1f5f9',
                  color: active ? 'white' : c.color,
                  boxShadow: active ? `0 4px 14px ${c.color}55` : 'none',
                  transform: active ? 'scale(1.03)' : 'scale(1)',
                  transition:'all 0.2s ease',
                }}>
                  {key === 'Available' ? '🟢' : key === 'Break' ? '☕' : '⚫'} {key}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shift Metrics Card ──────────────────────────────────────────────────────── */
function ShiftCard({ distanceKm, shiftState, v, shiftActions }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const tick = () => {
      if (!shiftState.isRunning) return;
      setElapsed(Math.max(0, Date.now() - shiftState.startTime - shiftState.totalPausedMs));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [shiftState]);

  const tp  = getTierProgress(v.points);
  const tier = getTier(v.points);
  const tc   = TIER_CFG[tier.name] || TIER_CFG.Gold;

  const metrics = [
    { icon:'🗺️', label:'Distance Logged', value:`${distanceKm.toFixed(2)} km`, color:'#16a34a' },
    { icon:'⏱️', label:'Time Online',      value: fmtTime(elapsed),             color:'#3b82f6' },
    { icon:'⭐', label:'Reward Points',    value: v.points.toLocaleString(),     color:'#d97706' },
  ];

  return (
    <div style={{
      background:'#fff', borderRadius:'24px',
      border:'1px solid #e2e8f0',
      boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
      padding:'22px',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{
            width:'36px', height:'36px', borderRadius:'10px',
            background:'linear-gradient(135deg,#16a34a,#22c55e)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Activity size={18} color="white" />
          </div>
          <span style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1rem', color:'#0f172a' }}>
            Current Shift
          </span>
        </div>
        <Pill
          color={shiftState.isRunning ? '#16a34a' : '#94a3b8'}
          bg={shiftState.isRunning ? '#dcfce7' : '#f1f5f9'}
          border={shiftState.isRunning ? '#86efac' : '#cbd5e1'}
          dot={shiftState.isRunning ? '#16a34a' : null}
        >
          {shiftState.isRunning ? 'LIVE' : 'PAUSED'}
        </Pill>
      </div>

      {/* Metrics */}
      {metrics.map(m => (
        <div key={m.label} style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'11px 0', borderBottom:'1px solid #f1f5f9',
        }}>
          <span style={{ fontSize:'0.85rem', color:'#64748b', display:'flex', alignItems:'center', gap:'7px' }}>
            {m.icon} {m.label}
          </span>
          <span style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'0.95rem', color:m.color }}>
            {m.value}
          </span>
        </div>
      ))}

      {/* Tier progress */}
      <div style={{ marginTop:'16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
          <span style={{ fontSize:'0.8rem', fontWeight:700, color:tier.color, fontFamily:'Poppins' }}>
            {tc.icon} {tier.name} Tier
          </span>
          <span style={{ fontSize:'0.78rem', color:'#94a3b8', fontWeight:600 }}>
            {tp.nextTier ? `${tp.ptsAway} pts → ${tp.nextTier}` : '🏆 Max Tier!'}
          </span>
        </div>
        <div style={{ background:'#f1f5f9', borderRadius:'9999px', height:'9px', overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${tp.pct}%`,
            background: tc.gradient,
            borderRadius:'9999px',
            transition:'width 1s cubic-bezier(.4,0,.2,1)',
            boxShadow:`0 0 10px ${tc.glow}`,
          }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px' }}>
          <span style={{ fontSize:'0.7rem', color:'#94a3b8' }}>{v.points.toLocaleString()} pts</span>
          {tp.nextTier && (
            <span style={{ fontSize:'0.7rem', color:'#94a3b8' }}>{(tier.max + 1).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Shift controls */}
      <div style={{ display:'flex', gap:'8px', marginTop:'14px' }}>
        {shiftState.isRunning ? (
          <button onClick={shiftActions.pause} style={{
            flex:1, padding:'10px', borderRadius:'12px',
            background:'#fefce8', border:'1px solid #fde68a',
            color:'#b45309', fontFamily:'Poppins', fontWeight:700,
            fontSize:'0.82rem', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'5px',
          }}>
            <Coffee size={14}/> Break
          </button>
        ) : (
          <button onClick={shiftActions.resume} style={{
            flex:1, padding:'10px', borderRadius:'12px',
            background:'#f0fdf4', border:'1px solid #86efac',
            color:'#15803d', fontFamily:'Poppins', fontWeight:700,
            fontSize:'0.82rem', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'5px',
          }}>
            <Zap size={14}/> Resume
          </button>
        )}
        <button onClick={shiftActions.end} style={{
          flex:1, padding:'10px', borderRadius:'12px',
          background:'#fff1f2', border:'1px solid #fecaca',
          color:'#dc2626', fontFamily:'Poppins', fontWeight:700,
          fontSize:'0.82rem', cursor:'pointer',
        }}>
          End Shift
        </button>
      </div>
    </div>
  );
}

/* ── Live Tracking Card ──────────────────────────────────────────────────────── */
function LiveTrackCard({ activeTask, driverPos, driverStatus, gpsHistory, v }) {
  const tier = getTier(v.points);
  const [ping, setPing] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setPing(Date.now()), 4000);
    return () => clearInterval(id);
  }, []);

  const trail = gpsHistory.slice(-40).map(p => [p.lat, p.lng]);

  return (
    <div style={{
      background:'#fff', borderRadius:'24px',
      border:'1px solid #e2e8f0',
      boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
      overflow:'hidden', display:'flex', flexDirection:'column',
    }}>
      {/* Map header */}
      <div style={{
        padding:'16px 22px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        borderBottom:'1px solid #f1f5f9',
        background:'#fff',
      }}>
        <div>
          <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1rem', color:'#0f172a' }}>
            🗺️ Live GPS Tracking
          </p>
          <p style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'2px' }}>
            Updates every 4 s · OpenStreetMap
          </p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {activeTask && (
            <div style={{
              background:'#fff7ed', border:'1px solid #fed7aa',
              borderRadius:'10px', padding:'5px 12px',
              fontSize:'0.78rem', fontWeight:700, color:'#ea580c', fontFamily:'Poppins',
            }}>
              ETA {fmtEta(activeTask.eta)}
            </div>
          )}
          <div style={{
            display:'flex', alignItems:'center', gap:'5px',
            background:'#f0fdf4', border:'1px solid #86efac',
            borderRadius:'9999px', padding:'5px 12px',
          }}>
            <span style={{
              width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e',
              animation:'fd-dot 1.5s ease-in-out infinite',
            }} />
            <Wifi size={13} color="#16a34a" />
            <span style={{ fontSize:'0.74rem', fontWeight:700, color:'#15803d', fontFamily:'Poppins' }}>
              GPS Live
            </span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex:1, minHeight:'360px', position:'relative' }}>
        <FleetLiveMap
          pickupLocation={activeTask?.pickup}
          dropLocation={activeTask?.drop}
          driverLat={driverPos.lat}
          driverLng={driverPos.lng}
          driverName={v.name}
          driverTier={tier.name}
          driverStatus={driverStatus}
          gpsTrail={trail}
        />

        {/* No-task overlay */}
        {!activeTask && (
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            background:'rgba(248,250,252,0.88)', backdropFilter:'blur(4px)',
          }}>
            <p style={{ fontSize:'2.5rem', marginBottom:'10px' }}>🗺️</p>
            <p style={{ fontFamily:'Poppins', fontWeight:700, color:'#1e293b' }}>
              No active delivery
            </p>
            <p style={{ fontSize:'0.82rem', color:'#94a3b8', marginTop:'4px' }}>
              Accept an order to see live route
            </p>
          </div>
        )}
      </div>

      {/* Route info bar */}
      {activeTask && (
        <div style={{
          padding:'14px 22px',
          background:'linear-gradient(135deg,#f8fafc,#f1f5f9)',
          borderTop:'1px solid #e2e8f0',
          display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'12px', alignItems:'center',
        }}>
          <div>
            <p style={{ fontSize:'0.68rem', color:'#94a3b8', fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.07em' }}>Pickup</p>
            <p style={{ fontSize:'0.88rem', fontWeight:700, color:'#0f172a',
              fontFamily:'Poppins', marginTop:'2px' }}>
              📦 {activeTask.pickup}
            </p>
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'0.85rem', color:'#f97316' }}>
              {activeTask.distanceRemaining.toFixed(2)} km
            </p>
            <div style={{
              height:'3px', width:'48px', margin:'4px auto',
              background:'linear-gradient(90deg,#16a34a,#f97316)',
              borderRadius:'9999px',
            }} />
            <p style={{ fontSize:'0.7rem', color:'#94a3b8' }}>remaining</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:'0.68rem', color:'#94a3b8', fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.07em' }}>Destination</p>
            <p style={{ fontSize:'0.88rem', fontWeight:700, color:'#0f172a',
              fontFamily:'Poppins', marginTop:'2px' }}>
              🏠 {activeTask.drop.split(',')[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Task Card ───────────────────────────────────────────────────────────────── */
function TaskCard({ task, onAccept, onPickup, onProof, onDeliver }) {
  const borderColor = {
    available:'#22c55e', active:'#f97316', pickup:'#3b82f6', completed:'#16a34a'
  }[task.status] || '#e2e8f0';

  const statusLabel = {
    available:'Available', active:'Assigned', pickup:'Picked Up', completed:'Delivered'
  }[task.status] || task.status;

  const statusBg = {
    available:'#f0fdf4', active:'#fff7ed', pickup:'#eff6ff', completed:'#f0fdf4'
  }[task.status] || '#f8fafc';

  return (
    <div style={{
      background:'#fff',
      border:`1px solid #e2e8f0`,
      borderLeft:`4px solid ${borderColor}`,
      borderRadius:'20px',
      padding:'22px 24px',
      boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
      transition:'all 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px', flexWrap:'wrap' }}>
        {/* Left info */}
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
            <span style={{
              padding:'3px 10px', borderRadius:'9999px',
              fontSize:'0.72rem', fontWeight:700, fontFamily:'Poppins',
              background: task.urgency === 'high' ? '#fef3c7' : '#f0fdf4',
              color:       task.urgency === 'high' ? '#b45309' : '#15803d',
              border:      task.urgency === 'high' ? '1px solid #fde68a' : '1px solid #86efac',
            }}>
              {task.urgency === 'high' ? '🔴 High Priority' : '🟡 Medium Priority'}
            </span>
            <span style={{
              padding:'3px 10px', borderRadius:'9999px',
              fontSize:'0.72rem', fontWeight:700, fontFamily:'Poppins',
              background: statusBg,
              color: borderColor,
              border: `1px solid ${borderColor}44`,
            }}>
              {statusLabel}
            </span>
            <span style={{ fontSize:'0.74rem', color:'#94a3b8', fontWeight:600, marginLeft:'auto' }}>{task.id}</span>
          </div>

          <h4 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:'1.05rem', color:'#0f172a', marginBottom:'3px' }}>
            {task.donor}
          </h4>
          <p style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'14px' }}>{task.food}</p>

          <div style={{ display:'flex', gap:'20px', flexWrap:'wrap', fontSize:'0.82rem' }}>
            <div>
              <p style={{ color:'#94a3b8', marginBottom:'2px', fontWeight:500 }}>📦 Pickup</p>
              <p style={{ fontWeight:700, color:'#0f172a' }}>{task.pickup}</p>
            </div>
            <div>
              <p style={{ color:'#94a3b8', marginBottom:'2px', fontWeight:500 }}>🏠 Drop-off</p>
              <p style={{ fontWeight:700, color:'#0f172a' }}>{task.drop.split(',')[0]}</p>
            </div>
            {(task.status === 'active' || task.status === 'pickup') && (
              <div>
                <p style={{ color:'#94a3b8', marginBottom:'2px', fontWeight:500 }}>📍 Remaining</p>
                <p style={{ fontWeight:700, color:'#f97316' }}>
                  {task.distanceRemaining.toFixed(2)} km · ETA {fmtEta(task.eta)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right action panel */}
        <div style={{
          background:'#f8fafc', border:'1px solid #e2e8f0',
          borderRadius:'16px', padding:'16px',
          minWidth:'170px', display:'flex', flexDirection:'column', gap:'8px',
        }}>
          <p style={{ textAlign:'center', fontFamily:'Poppins', fontWeight:700,
            fontSize:'0.85rem', color:'#0f172a', marginBottom:'4px' }}>
            {task.status === 'available' ? `🎯 ${task.payout}` :
             task.status === 'completed' ? '✅ Completed' : '⏳ In Progress'}
          </p>

          {task.status === 'available' && (
            <button onClick={() => onAccept(task.id)} style={{
              padding:'10px', borderRadius:'12px', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#16a34a,#22c55e)',
              color:'white', fontFamily:'Poppins', fontWeight:700, fontSize:'0.84rem',
              boxShadow:'0 4px 14px rgba(22,163,74,0.35)',
            }}>
              Accept & Route →
            </button>
          )}
          {task.status === 'active' && (
            <button onClick={() => onPickup(task.id)} style={{
              padding:'10px', borderRadius:'12px', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#2563eb,#3b82f6)',
              color:'white', fontFamily:'Poppins', fontWeight:700, fontSize:'0.84rem',
              boxShadow:'0 4px 14px rgba(59,130,246,0.35)',
            }}>
              📦 Mark Picked Up
            </button>
          )}
          {task.status === 'pickup' && (
            <>
              <button onClick={() => onProof(task.id)} style={{
                padding:'10px', borderRadius:'12px', cursor:'pointer',
                background: task.proofUploaded ? '#f0fdf4' : '#eff6ff',
                border: task.proofUploaded ? '1px solid #86efac' : '1px solid #bfdbfe',
                color: task.proofUploaded ? '#15803d' : '#2563eb',
                fontFamily:'Poppins', fontWeight:700, fontSize:'0.82rem',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'5px',
              }}>
                <Camera size={14}/> {task.proofUploaded ? '✓ Proof Uploaded' : '📸 Upload Proof'}
              </button>
              <button onClick={() => { if (!task.proofUploaded) onProof(task.id); onDeliver(task.id); }} style={{
                padding:'10px', borderRadius:'12px', border:'none', cursor:'pointer',
                background:'linear-gradient(135deg,#16a34a,#22c55e)',
                color:'white', fontFamily:'Poppins', fontWeight:700, fontSize:'0.84rem',
                boxShadow:'0 4px 14px rgba(22,163,74,0.35)',
              }}>
                ✓ Confirm Delivery
              </button>
            </>
          )}
          {task.status === 'completed' && (
            <div style={{ textAlign:'center', padding:'8px' }}>
              <CheckCircle size={28} color="#16a34a" />
              <p style={{ fontSize:'0.78rem', color:'#16a34a', fontWeight:700,
                fontFamily:'Poppins', marginTop:'4px' }}>+{task.payout}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [tab, setTab] = useState('active');
  const {
    tasks, volunteers,
    driverPos, driverStatus, distanceKm, shiftState, gpsHistory,
    addGpsPoint, setStatus,
    startShift, pauseShift, resumeShift, endShift,
    acceptTaskVolunteer, markPickedUpVolunteer,
    uploadProofVolunteer, markDeliveredVolunteer,
  } = useApp();

  const rahul = volunteers.find(v => v.name === 'Rahul S.') || {
    name:'Rahul S.', points:1285, deliveries:48, status:'Delivering', avatar:'🚴',
  };

  const activeTasks    = tasks.filter(t => t.status === 'active' || t.status === 'pickup');
  const availableTasks = tasks.filter(t => t.status === 'available');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTask     = activeTasks[0] || null;

  const currentRoute = activeTask ? (() => {
    const p = getCoords(activeTask.pickup);
    const d = getCoords(activeTask.drop);
    return { pickupLat:p.lat, pickupLng:p.lng, dropLat:d.lat, dropLng:d.lng };
  })() : null;

  const shiftActions = {
    start:  startShift,
    pause:  pauseShift,
    resume: resumeShift,
    end:    endShift,
  };

  useGpsSimulator(driverStatus, addGpsPoint, currentRoute, 4000);

  const TABS = [
    { id:'active',    label:'Active',    count:activeTasks.length,    color:'#f97316', bg:'#fff7ed', border:'#fed7aa' },
    { id:'available', label:'Available', count:availableTasks.length, color:'#16a34a', bg:'#f0fdf4', border:'#86efac' },
    { id:'completed', label:'Completed', count:completedTasks.length, color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe' },
  ];

  return (
    <div id="volunteer-dashboard" style={{
      background:'linear-gradient(160deg,#f8fafc 0%,#f0fdf4 40%,#eff6ff 100%)',
      minHeight:'100vh',
      paddingBottom:'80px',
    }}>
      <style>{`
        @keyframes fd-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
        @keyframes fd-fadeup {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fd-anim { animation: fd-fadeup 0.5s ease both; }
        .fd-anim-1 { animation-delay:0.05s; }
        .fd-anim-2 { animation-delay:0.10s; }
        .fd-anim-3 { animation-delay:0.15s; }
        .fd-anim-4 { animation-delay:0.20s; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="container" style={{ paddingTop:'44px' }}>

        {/* ── Section header ── */}
        <div className="fd-anim" style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'linear-gradient(135deg,#dcfce7,#eff6ff)',
            border:'1px solid #86efac', borderRadius:'9999px',
            padding:'6px 18px', marginBottom:'14px',
          }}>
            <span style={{ fontSize:'1rem' }}>🚴</span>
            <span style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'0.78rem',
              color:'#15803d', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              Fleet Portal
            </span>
          </div>
          <h2 style={{ fontFamily:'Poppins', fontWeight:900, fontSize:'2.1rem',
            color:'#0f172a', marginBottom:'10px', letterSpacing:'-0.02em' }}>
            Fleet Delivery Dashboard
          </h2>
          <p style={{ color:'#64748b', maxWidth:'520px', margin:'0 auto', lineHeight:1.7 }}>
            Real-time GPS tracking, live distance calculation & order management
          </p>
        </div>

        {/* ── Main grid: left (driver + shift) | right (map) ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'300px 1fr',
          gap:'18px',
          marginBottom:'20px',
          alignItems:'start',
        }} className="fd-main-grid">

          {/* Left column */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div className="fd-anim fd-anim-1">
              <DriverCard v={rahul} driverStatus={driverStatus} onStatus={setStatus} hasActiveTask={!!activeTask} />
            </div>
            <div className="fd-anim fd-anim-2">
              <ShiftCard distanceKm={distanceKm} shiftState={shiftState} v={rahul} shiftActions={shiftActions} />
            </div>
          </div>

          {/* Live tracking map */}
          <div className="fd-anim fd-anim-3">
            <LiveTrackCard
              activeTask={activeTask}
              driverPos={driverPos}
              driverStatus={driverStatus}
              gpsHistory={gpsHistory}
              v={rahul}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="fd-anim fd-anim-4" style={{
          display:'flex', gap:'6px', marginBottom:'18px',
          background:'#fff', border:'1px solid #e2e8f0',
          padding:'6px', borderRadius:'18px', width:'fit-content',
          boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'8px 20px', borderRadius:'13px',
                fontFamily:'Poppins', fontWeight:700, fontSize:'0.87rem', cursor:'pointer',
                background: active ? t.bg : 'transparent',
                color: active ? t.color : '#94a3b8',
                border: active ? `1px solid ${t.border}` : '1px solid transparent',
                transition:'all 0.2s ease',
                display:'flex', alignItems:'center', gap:'7px',
              }}>
                {t.label}
                <span style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:'20px', height:'20px', borderRadius:'50%',
                  background: active ? t.color : '#e2e8f0',
                  color: active ? 'white' : '#64748b',
                  fontSize:'0.7rem', fontWeight:800,
                }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Task list ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {tab === 'active' && activeTasks.map(t => (
            <TaskCard key={t.id} task={t}
              onAccept={acceptTaskVolunteer} onPickup={markPickedUpVolunteer}
              onProof={uploadProofVolunteer}  onDeliver={markDeliveredVolunteer}
            />
          ))}
          {tab === 'active' && !activeTasks.length && <EmptyState icon="📭" msg="No active tasks. Check Available tab." />}

          {tab === 'available' && availableTasks.map(t => (
            <TaskCard key={t.id} task={t}
              onAccept={acceptTaskVolunteer} onPickup={markPickedUpVolunteer}
              onProof={uploadProofVolunteer}  onDeliver={markDeliveredVolunteer}
            />
          ))}
          {tab === 'available' && !availableTasks.length && <EmptyState icon="✅" msg="All orders are assigned!" />}

          {tab === 'completed' && completedTasks.map(t => (
            <TaskCard key={t.id} task={t}
              onAccept={acceptTaskVolunteer} onPickup={markPickedUpVolunteer}
              onProof={uploadProofVolunteer}  onDeliver={markDeliveredVolunteer}
            />
          ))}
          {tab === 'completed' && !completedTasks.length && <EmptyState icon="🚴" msg="Complete your first delivery!" />}
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 900px) {
          .fd-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

function EmptyState({ icon, msg }) {
  return (
    <div style={{
      textAlign:'center', padding:'52px 24px',
      background:'#fff', borderRadius:'20px',
      border:'1px solid #e2e8f0',
    }}>
      <p style={{ fontSize:'2.8rem', marginBottom:'12px' }}>{icon}</p>
      <p style={{ fontFamily:'Poppins', fontWeight:700, color:'#64748b', fontSize:'0.95rem' }}>{msg}</p>
    </div>
  );
}

export default Dashboard;
