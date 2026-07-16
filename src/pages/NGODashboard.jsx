import React from 'react';
import { Package, Shield, AlertTriangle, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const NGODashboard = () => {
  const { t } = useLanguage();
  const { donations, requests, acceptDonationNGO, dispatchRiderNGO, dispatchSOSRequest } = useApp();

  // Filter for available donations that the NGO can accept
  const availableDonations = donations.filter(d => d.progress < 3);
  
  // Filter for active dispatches
  const activeDispatches = donations.filter(d => d.progress >= 3 && d.progress < 5);
  
  // Filter for SOS requests that need dispatch
  const pendingSOS = requests.filter(r => !r.dispatched);

  return (
    <div style={{ padding: '60px 48px', background: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Module Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#10B981', padding: '8px 16px', borderRadius: '30px', fontWeight: 600, fontSize: '0.85rem', marginBottom: '16px' }}>
          <Shield size={16} /> NGO Partner Portal
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0a1628', lineHeight: 1.2 }}>
          Accept Donations & <span style={{ color: '#10B981' }}>Dispatch Relief</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#64748B', marginTop: '12px', maxWidth: '600px', fontFamily: 'Inter, sans-serif' }}>
          Manage incoming surplus food from donors and respond to verified SOS emergency requests across the city in real-time.
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* SOS Section (Prioritized) */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <AlertTriangle size={28} color="#DC2626" />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>SOS Emergency Requests</h3>
            {pendingSOS.length > 0 && (
              <span style={{ background: '#DC2626', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                {pendingSOS.length} Action Required
              </span>
            )}
          </div>

          {pendingSOS.length === 0 ? (
            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#334155', fontWeight: 600 }}>No active SOS requests</h4>
              <p style={{ color: '#64748B', marginTop: '8px', fontFamily: 'Inter, sans-serif' }}>The city is safe right now. We will notify you of any emergencies.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {pendingSOS.map((req) => (
                <div key={req.id} style={{ background: '#FEF2F2', borderRadius: '24px', padding: '24px', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 25px rgba(220,38,38,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ background: '#DC2626', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>URGENT SOS</span>
                      <span style={{ color: '#991B1B', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Request #{req.id}</span>
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#7F1D1D', marginBottom: '4px' }}>{req.name}</h4>
                    <p style={{ color: '#991B1B', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Requires food for {req.ppl} people</p>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#7F1D1D', fontSize: '0.9rem', fontWeight: 600 }}>
                    <MapPin size={18} /> Location: {req.loc}
                  </div>
                  
                  <button 
                    onClick={() => dispatchSOSRequest(req.id, 'Rahul S.')}
                    style={{ marginTop: 'auto', background: '#DC2626', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <AlertTriangle size={20} />
                    Dispatch Volunteer Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Incoming Donations Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Package size={28} color="#10B981" />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Available Donations</h3>
            {availableDonations.length > 0 && (
              <span style={{ background: '#ecfdf5', color: '#10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                {availableDonations.length} Pending
              </span>
            )}
          </div>

          {availableDonations.length === 0 ? (
            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
              <Package size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#334155', fontWeight: 600 }}>No pending donations</h4>
              <p style={{ color: '#64748B', marginTop: '8px', fontFamily: 'Inter, sans-serif' }}>You're all caught up! Wait for new donors to list surplus food.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {availableDonations.map((don) => (
                <div key={don.id} style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ background: '#ECFDF5', color: '#10B981', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{don.id}</span>
                      <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}><Clock size={14}/> {don.time}</span>
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: '4px' }}>{don.food}</h4>
                    <p style={{ color: '#475569', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Donor: {don.donor} • Qty: <span style={{ fontWeight: 600 }}>{don.qty}</span></p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                    <MapPin size={18} color="#10B981" /> Pickup: {don.address}
                  </div>
                  
                  <button 
                    onClick={() => dispatchRiderNGO(don.id, 'Rahul S.')}
                    style={{ marginTop: 'auto', background: '#10B981', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 4px 14px rgba(16,185,129,0.2)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <CheckCircle size={20} />
                    Accept & Dispatch
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Dispatches Section */}
        {activeDispatches.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Clock size={28} color="#3B82F6" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Active Deliveries</h3>
              <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                {activeDispatches.length} In Progress
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {activeDispatches.map((don) => (
                <div key={don.id} style={{ background: '#F8FAFC', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ background: '#E2E8F0', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{don.id}</span>
                      <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}><Clock size={14}/> {don.time}</span>
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: '4px' }}>{don.food}</h4>
                    <p style={{ color: '#475569', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Donor: {don.donor} • Qty: <span style={{ fontWeight: 600 }}>{don.qty}</span></p>
                  </div>
                  
                  <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                    <MapPin size={18} color="#3B82F6" /> Pickup: {don.address}
                  </div>
                  
                  <button 
                    disabled
                    style={{ marginTop: 'auto', background: 'white', color: '#64748B', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <CheckCircle size={20} color="#3B82F6" />
                    Dispatched to {don.volunteer || 'Volunteer'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default NGODashboard;
