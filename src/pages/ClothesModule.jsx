import React, { useState } from 'react';
import { Shirt, Users, ThermometerSnowflake, Truck, AlertCircle, Building2, MapPin, CheckCircle } from 'lucide-react';
import nsImg from '../assets/ns.png';

const ClothesModule = () => {
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
    { icon: <Shirt size={20} />, label: 'Clothes Donated', value: '38,900', color: '#10B981' },
    { icon: <Users size={20} />, label: 'Families Supported', value: '15,200', color: '#3B82F6' },
    { icon: <ThermometerSnowflake size={20} />, label: 'Winter Kits', value: '6,450', color: '#8B5CF6' },
    { icon: <Truck size={20} />, label: 'Collection Drives', value: '185', color: '#F59E0B' },
    { icon: <AlertCircle size={20} />, label: 'Active Requests', value: '312', color: '#EF4444' },
    { icon: <Building2 size={20} />, label: 'Distribution Centers', value: '45', color: '#14B8A6' },
  ];

  const FEATURES = [
    { icon: '👕', title: "Men's Clothes" },
    { icon: '👗', title: "Women's Clothes" },
    { icon: '🧒', title: "Children's Clothes" },
    { icon: '🎒', title: 'School Uniforms' },
    { icon: '🥾', title: 'Footwear' },
    { icon: '🧥', title: 'Winter Clothes' },
    { icon: '🛏', title: 'Blankets' },
    { icon: '👜', title: 'Bags' },
    { icon: '📦', title: 'Schedule Pickup' },
    { icon: '📍', title: 'Nearby Center' },
    { icon: '🔍', title: 'Quality Verification' },
    { icon: '📊', title: 'Distribution Tracking' },
    { icon: '📜', title: 'Donation History' }
  ];

  return (
    <div className="clothes-module" style={{ padding: '80px 0', background: '#FDF4FF' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', fontWeight: '800' }}>Clothes Donation <span style={{ color: '#16A34A' }}>Module</span></h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-soft)', fontSize: '1.1rem' }}>
            Providing warmth and dignity to families in need by donating clothes, winter wear, and essentials.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {STATS.map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', '@media (min-width: 992px)': { gridTemplateColumns: '1.2fr 1fr' } }}>
          {/* Features Grid */}
          <div>
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <img src={nsImg} alt="Ways to Contribute Options" style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.01)' }} />
            </div>
          </div>

          {/* Form Section */}
          <div className="card" style={{ background: 'var(--white)', padding: '35px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#FDF4FF', padding: '6px', borderRadius: 'var(--radius-md)' }}>
              <button onClick={() => setFormType('request')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: 'none', background: formType === 'request' ? '#D946EF' : 'transparent', color: formType === 'request' ? '#FFF' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'request' ? '0 4px 12px rgba(217,70,239,0.2)' : 'none' }}>Request Clothes</button>
              <button onClick={() => setFormType('donate')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: 'none', background: formType === 'donate' ? '#10B981' : 'transparent', color: formType === 'donate' ? '#FFF' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'donate' ? '0 4px 12px rgba(16,185,129,0.2)' : 'none' }}>Donate Clothes</button>
            </div>

            <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '700' }}>
              {formType === 'request' ? 'Clothes Request Form' : 'Clothes Donation Form'}
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
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Family Name / Individual</label>
                      <input type="text" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="Enter name" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Number of Members</label>
                      <input type="number" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} min="1" defaultValue="1" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Priority</label>
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent (Winter/Disaster)</option>
                      </select>
                    </div>
                    
                    <div style={{ gridColumn: 'span 2' }}>
                       <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Sizes Needed</label>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none', fontSize: '0.85rem' }} placeholder="Men's (e.g. M, L)" />
                          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none', fontSize: '0.85rem' }} placeholder="Women's (e.g. S, M)" />
                          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none', fontSize: '0.85rem' }} placeholder="Children's (e.g. 5-7 yrs)" />
                       </div>
                    </div>
                    
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Clothes Type Needed</label>
                      <input type="text" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} placeholder="e.g. Winter Jackets, Daily Wear, Blankets" />
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
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Quantity Needed</label>
                      <input type="number" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} min="1" defaultValue="1" />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                      <button type="submit" disabled={isSubmitting} style={{ 
                        width: '100%', padding: '16px', background: '#D946EF', color: '#FFF', 
                        border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer',
                        opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(217,70,239,0.3)'
                      }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>
                  </div>
                )}
                {formType === 'donate' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Item Category</label>
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>Men's Clothes</option>
                        <option>Women's Clothes</option>
                        <option>Children's Clothes</option>
                        <option>Winter Wear / Blankets</option>
                        <option>Shoes / Footwear</option>
                        <option>Mixed Items</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Estimated Pieces</label>
                      <input type="number" required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }} min="1" defaultValue="10" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Condition</label>
                      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#F8FAFC', outline: 'none' }}>
                        <option>Gently Used & Washed</option>
                        <option>New with Tags</option>
                      </select>
                    </div>
                     <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Pickup Address</label>
                      <textarea required style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', resize: 'none', height: '100px', background: '#F8FAFC', outline: 'none' }} placeholder="Where should we pick this up?"></textarea>
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

export default ClothesModule;
