import React, { useState } from 'react';
import { MapPin, CheckCircle, Clock, AlertCircle, Users, Truck, Phone } from 'lucide-react';

const initialDonations = [
  { donor: 'Hotel Saravana Bhavan', food: '30 plates rice & dal', time: '8 min ago', status: 'pending' },
  { donor: 'Raj Catering Services', food: '60 kg veg biryani', time: '24 min ago', status: 'accepted' },
  { donor: 'Krishna Bakery', food: '200 buns + bread', time: '1 hr ago', status: 'pickup' },
  { donor: 'Ananya Home Kitchen', food: '15 kg sambar rice', time: '2 hrs ago', status: 'delivered' },
  { donor: 'Green Bowl Restaurant', food: '40 plates pasta salad', time: '3 hrs ago', status: 'delivered' },
];

const initialRequests = [
  { id: 1, name: 'Ravi & Family', loc: 'Dharavi Colony, Chennai', ppl: 8, urgent: true, dispatched: false },
  { id: 2, name: 'Anbu Night Shelter', loc: 'Adyar Bridge Camp', ppl: 25, urgent: true, dispatched: false },
  { id: 3, name: 'Old Age Home, T Nagar', loc: 'T Nagar West', ppl: 40, urgent: false, dispatched: false },
];

const volunteers = [
  { name: 'Karthik R.', area: 'Anna Nagar', status: 'On delivery', deliveries: 3 },
  { name: 'Meena S.', area: 'Adyar', status: 'Available', deliveries: 1 },
  { name: 'Pradeep K.', area: 'Velachery', status: 'Available', deliveries: 5 },
  { name: 'Divya T.', area: 'T Nagar', status: 'On delivery', deliveries: 2 },
];

const StatusDot = ({ s }) => {
  const colors = {
    pending: { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B', label: 'Pending' },
    accepted: { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6', label: 'Accepted' },
    pickup: { bg: '#FFEDD5', text: '#D97706', dot: '#F97316', label: 'Picked up' },
    delivered: { bg: '#DCFCE7', text: '#16A34A', dot: '#10B981', label: 'Delivered' },
  };

  const c = colors[s] || colors.pending;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      background: c.bg,
      color: c.text
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot }}></span>
      {c.label}
    </span>
  );
};

const NGODashboard = () => {
  const [donations, setDonations] = useState(initialDonations);
  const [requests, setRequests] = useState(initialRequests);

  const handleAccept = (idx) => {
    const updated = [...donations];
    updated[idx].status = 'accepted';
    setDonations(updated);
  };

  const handleDispatch = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, dispatched: true } : r));
    alert('Volunteer dispatched successfully! GPS tracking initialized.');
  };

  return (
    <div style={{ background: '#F8FAFC', padding: '80px 0', minHeight: '100vh' }} id="ngo-dashboard">
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div className="section-tag">🏢 NGO Dashboard</div>
          <h2 className="section-title">Feeding India Trust — Chennai</h2>
          <p className="section-sub">Manage incoming food offers, respond to urgent requests, and coordinate your volunteer fleet from one unified control center.</p>
        </div>

        {/* Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { ico: '🍱', n: '23', l: 'Incoming Today', bg: '#EFF6FF', color: '#1E40AF', border: '#DBEAFE' },
            { ico: '🙏', n: '14', l: 'Pending Requests', bg: '#FFF7ED', color: '#C2410C', border: '#FFEDD5' },
            { ico: '🚴', n: '8', l: 'Volunteers Active', bg: '#F3E8FF', color: '#6B21A8', border: '#E9D5FF' },
            { ico: '✅', n: '1,240', l: 'Total Deliveries', bg: '#ECFDF5', color: '#047857', border: '#D1FAE5' },
          ].map((s, idx) => (
            <div key={idx} className="card" style={{ padding: '24px', background: 'white', border: `1px solid ${s.border}`, borderTop: `4px solid ${s.color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '2rem' }}>{s.ico}</span>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1.1 }}>{s.n}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* Left Column: Donations & SOS Requests */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Incoming Donations Panel */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🍱 Incoming Donations Today
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {donations.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < donations.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-dark)' }}>{d.donor}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '2px' }}>{d.food} • {d.time}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusDot s={d.status} />
                      {d.status === 'pending' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAccept(i)}>Accept</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Food Requests Panel */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                🆘 Urgent Food Requests
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {requests.map((r, i) => (
                  <div key={r.id} style={{
                    background: r.dispatched ? '#F0FDF4' : (r.urgent ? 'var(--red-soft)' : 'white'),
                    border: `1px solid ${r.dispatched ? '#BBF7D0' : (r.urgent ? 'var(--red-border)' : 'var(--border)')}`,
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{r.name}</p>
                        {r.dispatched ? (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-primary)', background: 'var(--green-mint)', padding: '2px 8px', borderRadius: '9999px' }}>Dispatched</span>
                        ) : (
                          r.urgent && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--red-sos)', background: '#FEF2F2', padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--red-border)' }}>Critical SOS</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {r.loc} • {r.ppl} people
                      </p>
                    </div>
                    <div>
                      {r.dispatched ? (
                        <button className="btn btn-secondary btn-sm" disabled style={{ background: '#E2E8F0', color: 'var(--text-soft)' }}>Assigned</button>
                      ) : (
                        <button
                          className={`btn btn-sm ${r.urgent ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => handleDispatch(r.id)}
                        >
                          {r.urgent ? '🆘 Dispatch' : 'Assign →'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Volunteers & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Volunteers Panel */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                🚴 Volunteers on Duty Today
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {volunteers.map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🧑</div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{v.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>📍 Coverage: {v.area}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>{v.deliveries} deliveries</span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: v.status === 'Available' ? 'var(--green-mint)' : 'var(--orange-light)',
                        color: v.status === 'Available' ? 'var(--green-primary)' : 'var(--orange)'
                      }}>{v.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Week at a Glance Panel */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                📋 This Week at a Glance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['Meals delivered this week', '647'],
                  ['Active donor partners', '18'],
                  ['Volunteer hours logged', '92 hrs'],
                  ['SOS cases resolved', '6/6']
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-soft)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{val}</span>
                  </div>
                ))}
                
                <div style={{ marginTop: '16px', padding: '16px', background: 'var(--green-mint)', border: '1px solid var(--green-light)', borderRadius: '16px' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.85rem', marginBottom: '4px' }}>💡 Weekly Operations Highlight</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--green-deep)', lineHeight: 1.5 }}>
                    Coordinated emergency delivery for 200 flood-displaced residents in Tambaram on June 4th — within 4 hours of the alert. Great job fleet!
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default NGODashboard;
