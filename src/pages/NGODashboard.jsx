import React, { useState } from 'react';
import { Package, Shield, AlertTriangle, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const NGODashboard = () => {
  const { t } = useLanguage();
  const { donations, requests, acceptDonationNGO, dispatchRiderNGO, dispatchSOSRequest } = useApp();
  const [activeTab, setActiveTab] = useState('donations');

  // Filter for pending donations that the NGO can accept
  const pendingDonations = donations.filter(d => d.status === 'Volunteer Assigned' || d.status === 'Listed' || d.progress < 4);
  
  // Filter for SOS requests that need dispatch
  const pendingSOS = requests.filter(r => !r.dispatched);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC', fontFamily: 'Inter, Poppins, sans-serif' }}>
      
      {/* Header */}
      <header style={{ height: '64px', background: '#1E293B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Shield size={20} color="#34D399" />
          </div>
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.25rem' }}>NGO Partner Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', background: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
            FIT
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #E2E8F0', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('donations')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'donations' ? '#ECFDF5' : 'transparent', color: activeTab === 'donations' ? '#10B981' : '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
          >
            <Package size={20} />
            Incoming Donations
            {pendingDonations.length > 0 && (
              <span style={{ marginLeft: 'auto', background: '#10B981', color: 'white', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '99px' }}>{pendingDonations.length}</span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('sos')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'sos' ? '#FEF2F2' : 'transparent', color: activeTab === 'sos' ? '#DC2626' : '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
          >
            <AlertTriangle size={20} />
            SOS Alerts
            {pendingSOS.length > 0 && (
              <span style={{ marginLeft: 'auto', background: '#DC2626', color: 'white', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '99px' }}>{pendingSOS.length}</span>
            )}
          </button>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#64748B', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }} onClick={() => window.location.href = '/'}>
               ← Back to Website
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          
          {activeTab === 'donations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#0F172A', marginBottom: '4px' }}>Available Donations</h1>
                  <p style={{ color: '#64748B', fontSize: '1rem' }}>Accept surplus food and dispatch volunteers to collect it.</p>
                </div>
              </div>

              {pendingDonations.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <Package size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', color: '#334155', fontWeight: 600 }}>No pending donations</h3>
                  <p style={{ color: '#64748B', marginTop: '8px' }}>You're all caught up! Wait for new donors to list surplus food.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {pendingDonations.map((don) => (
                    <div key={don.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ background: '#ECFDF5', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{don.id}</span>
                          <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {don.time}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: '4px' }}>{don.food}</h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '12px' }}>Donor: {don.donor} • Qty: {don.qty}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: 500 }}>
                          <MapPin size={16} /> Pickup: {don.address}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => dispatchRiderNGO(don.id, 'Rahul S.')}
                          style={{ background: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <CheckCircle size={18} />
                          Accept & Dispatch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#0F172A', marginBottom: '4px' }}>SOS Emergency Requests</h1>
                  <p style={{ color: '#64748B', fontSize: '1rem' }}>Immediate response required for these verified requests.</p>
                </div>
              </div>

              {pendingSOS.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <AlertTriangle size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', color: '#334155', fontWeight: 600 }}>No active SOS requests</h3>
                  <p style={{ color: '#64748B', marginTop: '8px' }}>There are no emergencies reported at this time.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {pendingSOS.map((req) => (
                    <div key={req.id} style={{ background: '#FEF2F2', borderRadius: '16px', padding: '24px', border: '1px solid #FECACA', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ background: '#DC2626', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>URGENT SOS</span>
                          <span style={{ color: '#991B1B', fontSize: '0.85rem', fontWeight: 600 }}>Request #{req.id}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: '#7F1D1D', marginBottom: '4px' }}>{req.name}</h3>
                        <p style={{ color: '#991B1B', fontSize: '0.95rem', marginBottom: '12px' }}>Requires food for {req.ppl} people</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7F1D1D', fontSize: '0.85rem', fontWeight: 600 }}>
                          <MapPin size={16} /> Location: {req.loc}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => dispatchSOSRequest(req.id, 'Rahul S.')}
                          style={{ background: '#DC2626', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <AlertTriangle size={18} />
                          Dispatch Volunteer Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default NGODashboard;
