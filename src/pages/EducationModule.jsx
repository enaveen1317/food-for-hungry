import React, { useState } from 'react';
import { BookOpen, Backpack, PenTool, Laptop, GraduationCap, Users, MapPin, Award, CheckCircle } from 'lucide-react';
import agImg from '../assets/ag.png';
import nvImg from '../assets/nv.png';
const EducationModule = () => {
  const [formType, setFormType] = useState('request'); // 'request', 'donate'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const STATS = [
    { icon: <Users size={20} />, label: 'Students Supported', value: '12,450', color: '#3B82F6' },
    { icon: <BookOpen size={20} />, label: 'Books Donated', value: '45,200', color: '#10B981' },
    { icon: <Backpack size={20} />, label: 'School Kits', value: '8,900', color: '#F59E0B' },
    { icon: <Users size={20} />, label: 'Active Volunteers', value: '1,240', color: '#8B5CF6' },
    { icon: <MapPin size={20} />, label: 'Partner Schools', value: '142', color: '#EC4899' },
    { icon: <GraduationCap size={20} />, label: 'Education Requests', value: '850', color: '#14B8A6' },
  ];

  const FEATURES = [
    { icon: '📖', title: 'Donate Books' },
    { icon: '🎒', title: 'Donate School Bags' },
    { icon: '✏️', title: 'Donate Stationery' },
    { icon: '👕', title: 'Donate Uniforms' },
    { icon: '💻', title: 'Donate Laptop/Tablet' },
    { icon: '📚', title: 'Sponsor School Fees' },
    { icon: '👩‍🏫', title: 'Teaching Volunteer' },
    { icon: '🏫', title: 'School Request Portal' },
    { icon: '👧', title: 'Child Sponsorship' },
    { icon: '📅', title: 'Education Camp' },
    { icon: '🎓', title: 'Scholarships' },
    { icon: '📍', title: 'Nearby Schools' },
    { icon: '📊', title: 'Impact Tracker' },
    { icon: '📜', title: 'Donor Certificates' }
  ];

  return (
    <div className="education-module" style={{ padding: '20px 0', background: '#F8FAFC' }}>
      <div className="container">
        {/* Dashboard Image Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', fontWeight: '800' }}>Education Support <span style={{ color: '#16A34A' }}>Module</span></h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-soft)', fontSize: '1.1rem' }}>
            Empowering the next generation by providing essential educational supplies, funding, and mentorship to students in need.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', '@media (min-width: 992px)': { gridTemplateColumns: '1.2fr 1fr' } }}>
          {/* Features Grid */}
          <div>
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <img src={nvImg} alt="How You Can Help Options" style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.01)' }} />
            </div>
          </div>

          {/* Form Section */}
          <div className="card" style={{ background: 'var(--white)', padding: '35px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
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
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>Books & Notebooks</option>
                        <option>School Bags</option>
                        <option>Stationery Kits</option>
                        <option>School Uniforms</option>
                        <option>Laptop / Tablet</option>
                        <option>Other</option>
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
