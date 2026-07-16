import React, { useState } from 'react';
import { BookOpen, Backpack, PenTool, Laptop, GraduationCap, Users, MapPin, Award, CheckCircle, ChevronRight } from 'lucide-react';
import agImg from '../assets/ag.png';

const FEATURES = [
  { icon: '📖', title: 'Donate Books', desc: 'Give the gift of knowledge.', type: 'donate', item: 'Books & Notebooks' },
  { icon: '🎒', title: 'Donate School Bags', desc: "Support a student's education.", type: 'donate', item: 'School Bags' },
  { icon: '✏️', title: 'Donate Stationery', desc: 'Help students learn better.', type: 'donate', item: 'Stationery Kits' },
  { icon: '👕', title: 'Donate Uniforms', desc: 'Uniforms for dignity and equality.', type: 'donate', item: 'School Uniforms' },
  { icon: '💻', title: 'Donate Laptop/Tablet', desc: 'Empower through technology.', type: 'donate', item: 'Laptop / Tablet' },
  { icon: '📚', title: 'Sponsor School Fees', desc: 'Make education accessible.', type: 'donate', item: 'Other' },
  { icon: '👩‍🏫', title: 'Teaching Volunteer', desc: 'Share your knowledge, change lives.', type: 'donate', item: 'Other' },
  { icon: '🏫', title: 'School Request Portal', desc: 'Submit school support requests.', type: 'request', item: '' },
  { icon: '👧', title: 'Child Sponsorship', desc: 'Support a child, shape a future.', type: 'donate', item: 'Other' },
  { icon: '📅', title: 'Education Camp', desc: 'Join or support education camps.', type: 'donate', item: 'Other' },
  { icon: '🎓', title: 'Scholarships', desc: 'Help students achieve their dreams.', type: 'donate', item: 'Other' },
  { icon: '📍', title: 'Nearby Schools', desc: 'Find schools near you.', type: 'request', item: '' }
];

const EducationModule = () => {
  const [formType, setFormType] = useState('donate'); // 'request', 'donate'
  const [activeFeature, setActiveFeature] = useState('Donate Stationery');
  const [itemType, setItemType] = useState('Stationery Kits');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFeatureClick = (feat) => {
    setActiveFeature(feat.title);
    setFormType(feat.type);
    if (feat.type === 'donate' && feat.item) {
      setItemType(feat.item);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="education-module" style={{ padding: '40px 0', background: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Dashboard Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', fontWeight: '800' }}>Education Support <span style={{ color: '#16A34A' }}>Module</span></h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-soft)', fontSize: '1.1rem', marginTop: '10px' }}>
            Empowering the next generation by providing essential educational supplies, funding, and mentorship to students in need.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '40px',
          alignItems: 'start'
        }} className="edu-grid">
          <style>{`
            @media (min-width: 1024px) {
              .edu-grid { grid-template-columns: 1.5fr 1fr !important; }
            }
          `}</style>
          
          {/* Interactive Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: '20px',
            alignContent: 'start'
          }}>
            {FEATURES.map((feat, i) => {
              const isActive = activeFeature === feat.title;
              return (
                <div 
                  key={i} 
                  onClick={() => handleFeatureClick(feat)}
                  style={{
                    background: '#FFF',
                    borderRadius: '20px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: isActive ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                    boxShadow: isActive ? '0 8px 24px rgba(59,130,246,0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px', background: '#3B82F6', 
                      color: 'white', borderRadius: '50%', width: '22px', height: '22px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <CheckCircle size={14} strokeWidth={3} />
                    </div>
                  )}
                  <div style={{ 
                    fontSize: '2.5rem', 
                    background: isActive ? '#EFF6FF' : '#F8FAFC', 
                    width: '70px', height: '70px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    borderRadius: '50%',
                    transition: 'all 0.2s'
                  }}>
                    {feat.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>{feat.desc}</p>
                  </div>
                  <div style={{ 
                    marginTop: 'auto', 
                    width: '28px', height: '28px', 
                    borderRadius: '50%', 
                    border: isActive ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? '#3B82F6' : '#94A3B8',
                    background: isActive ? '#EFF6FF' : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Form Section */}
          <div className="card" style={{ background: 'var(--white)', padding: '35px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#F1F5F9', padding: '6px', borderRadius: 'var(--radius-md)' }}>
              <button onClick={() => setFormType('request')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: 'none', background: formType === 'request' ? '#3B82F6' : 'transparent', color: formType === 'request' ? '#FFF' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'request' ? '0 4px 12px rgba(59,130,246,0.2)' : 'none' }}>Request Support</button>
              <button onClick={() => setFormType('donate')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: 'none', background: formType === 'donate' ? '#10B981' : 'transparent', color: formType === 'donate' ? '#FFF' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'donate' ? '0 4px 12px rgba(16,185,129,0.2)' : 'none' }}>Donate Items</button>
            </div>

            <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '700' }}>
              {formType === 'request' ? 'Education Request Form' : 'Education Donation Form'}
            </h3>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 15px' }} />
                <h4 style={{ fontSize: '1.5rem', color: '#10B981', marginBottom: '10px', fontWeight: '700' }}>Submitted Successfully!</h4>
                <p style={{ color: 'var(--text-soft)' }}>Your {formType} has been recorded. We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formType === 'request' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Student Name</label>
                      <input type="text" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="Enter full name" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>School Name</label>
                      <input type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="If applicable" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Class/Grade</label>
                      <input type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="e.g. 5th Grade" />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Required Items</label>
                      <input type="text" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="e.g. Notebooks, Bag, Uniform" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Quantity</label>
                      <input type="number" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} min="1" defaultValue="1" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Priority Level</label>
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Address / Location</label>
                      <textarea required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', resize: 'none', height: '100px', background: '#F8FAFC', outline: 'none' }} placeholder="Full address"></textarea>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Contact Number</label>
                      <input type="tel" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="Phone number" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Supporting Document</label>
                      <input type="file" style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} />
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                      <button type="submit" disabled={isSubmitting} style={{ 
                        width: '100%', padding: '16px', background: '#3B82F6', color: '#FFF', 
                        border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer',
                        opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                      }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>
                  </div>
                )}
                {formType === 'donate' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Item Type</label>
                      <select 
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}
                      >
                        <option value="Books & Notebooks">Books & Notebooks</option>
                        <option value="School Bags">School Bags</option>
                        <option value="Stationery Kits">Stationery Kits</option>
                        <option value="School Uniforms">School Uniforms</option>
                        <option value="Laptop / Tablet">Laptop / Tablet</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Quantity</label>
                      <input type="number" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} min="1" defaultValue="1" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Condition</label>
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>New</option>
                        <option>Gently Used</option>
                      </select>
                    </div>
                     <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Pickup Address</label>
                      <textarea required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', resize: 'none', height: '100px', background: '#F8FAFC', outline: 'none' }} placeholder="Where can we collect these items?"></textarea>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Contact Number</label>
                      <input type="tel" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="Phone number" />
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                      <button type="submit" disabled={isSubmitting} style={{ 
                        width: '100%', padding: '16px', background: '#10B981', color: '#FFF', 
                        border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer',
                        opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                      }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Donation'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationModule;
