import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NGODashboard = () => {
  const { t } = useLanguage();

  const ngos = [
    {
      name: 'Feeding India Trust',
      area: 'Chennai City',
      focus: 'Surplus Food Redistribution',
      phone: '+91 98765 43210',
      email: 'chennai@feedingindia.org',
      color: '#10B981',
      bg: '#ECFDF5'
    },
    {
      name: 'No Food Waste',
      area: 'Tambaram & Guindy',
      focus: 'Wedding & Event Food Rescue',
      phone: '+91 98765 12345',
      email: 'info@nofoodwaste.org',
      color: '#F59E0B',
      bg: '#FFFBEB'
    },
    {
      name: 'Robin Hood Army',
      area: 'Adyar & Velachery',
      focus: 'Street Hunger Drives',
      phone: '+91 99887 76655',
      email: 'chennai@robinhoodarmy.com',
      color: '#3B82F6',
      bg: '#EFF6FF'
    },
    {
      name: 'Annalakshmi Foundation',
      area: 'T Nagar',
      focus: 'Daily Meals for Elderly',
      phone: '+91 91234 56789',
      email: 'hello@annalakshmi.org',
      color: '#8B5CF6',
      bg: '#F5F3FF'
    }
  ];

  return (
    <div className="screen-fit-section" style={{ background: '#F8FAFC' }} id="ngo-dashboard">
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div className="section-tag" style={{ justifyContent: 'center', margin: '0 auto 16px' }}>🤝 Partner NGOs</div>
          <h2 className="section-title">Connect with Local NGOs</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Easily reach out to verified local organizations to volunteer, donate in bulk, or coordinate large-scale food rescues.
          </p>
        </div>

        {/* NGO Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {ngos.map((ngo, idx) => (
            <div key={idx} className="card" style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '32px',
              borderTop: `6px solid ${ngo.color}`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                    {ngo.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: 500 }}>
                    <MapPin size={14} color={ngo.color} />
                    {ngo.area}
                  </div>
                </div>
                <div style={{ background: ngo.bg, color: ngo.color, padding: '8px', borderRadius: '50%' }}>
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div style={{ background: '#F1F5F9', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '24px', display: 'inline-block', width: 'max-content' }}>
                Focus: {ngo.focus}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={`tel:${ngo.phone}`} style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                  padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Phone size={18} color={ngo.color} />
                  {ngo.phone}
                </a>

                <a href={`mailto:${ngo.email}`} style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                  padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Mail size={18} color={ngo.color} />
                  {ngo.email}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NGODashboard;
