import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Activity, Award, User, Phone, Mail, ChevronRight, CheckCircle, TrendingUp, Heart, Filter, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VolunteerRegistrationModal from '../components/volunteers/VolunteerRegistrationModal';

const VolunteersManagement = () => {
  const navigate = useNavigate();
  const { volunteers: contextVolunteers } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  
  const stats = [
    { label: 'Active Volunteers', value: contextVolunteers.length.toString(), icon: <User size={24} color="#16A34A" /> },
    { label: 'Total Deliveries', value: contextVolunteers.reduce((acc, v) => acc + (v.deliveries || 0), 0).toString(), icon: <Clock size={24} color="#16A34A" /> },
    { label: 'Communities Reached', value: '340+', icon: <MapPin size={24} color="#16A34A" /> },
    { label: 'Food Rescued (kg)', value: '120k', icon: <Activity size={24} color="#16A34A" /> },
  ];

  const displayVolunteers = contextVolunteers.map((v, idx) => {
    const roles = ['Food Rescue Lead', 'Education Mentor', 'Clothing Drive', 'Logistics Coordinator'];
    return {
      id: idx,
      name: v.name,
      role: roles[idx % roles.length],
      rating: (4 + (v.points % 10) / 10).toFixed(1),
      tasks: v.deliveries,
      location: v.area,
      status: v.status === 'Delivering' ? 'On Mission' : (v.status || 'Available'),
      avatar: v.name.substring(0, 2).toUpperCase()
    };
  });

  const filteredVolunteers = displayVolunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Food') return v.role.includes('Food');
    if (activeFilter === 'Education') return v.role.includes('Education');
    if (activeFilter === 'Clothes') return v.role.includes('Clothing');
    return true;
  });

  return (
    <div style={{ padding: '80px 48px', background: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Hero Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', color: '#16A34A', padding: '8px 16px', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
            <Award size={18} /> Volunteer Network
          </div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0a1628', lineHeight: 1.1, marginBottom: '24px' }}>
            Our Community <span style={{ color: '#16A34A' }}>Heroes</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, maxWidth: '600px', fontFamily: 'Inter, sans-serif', marginBottom: '32px' }}>
            Meet the dedicated volunteers who rescue surplus food, support education, distribute clothing, and serve communities across Tamil Nadu. Join our growing network of changemakers.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setShowJoinModal(true)} style={{ background: '#16A34A', color: 'white', padding: '16px 32px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.3)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Join as Volunteer <ChevronRight size={20} />
            </button>
            <button onClick={() => alert('Guidelines: Must be 18+ and have a valid ID. Training is provided.')} style={{ background: '#F8FAFC', color: '#0a1628', padding: '16px 32px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              View Guidelines
            </button>
          </div>
        </div>
        
        {/* Statistics Grid */}
        <div style={{ flex: '1 1 500px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#FFFFFF', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F0FDF4', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0a1628', marginBottom: '4px' }}>{stat.value}</h3>
                <p style={{ color: '#64748B', fontWeight: 500, fontSize: '0.95rem' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Directory */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#F8FAFC', borderRadius: '32px', padding: '40px', border: '1px solid #E2E8F0' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '24px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a1628' }}>Volunteer Directory</h3>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search by name, role, or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #CBD5E1', width: '300px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none' }} 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '14px', border: '1px solid #CBD5E1' }}>
              {['All', 'Food', 'Education', 'Clothes'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{ background: activeFilter === filter ? '#16A34A' : 'transparent', color: activeFilter === filter ? 'white' : '#64748B', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredVolunteers.map(vol => (
            <div key={vol.id} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                    {vol.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a1628', marginBottom: '4px' }}>{vol.name}</h4>
                    <p style={{ color: '#16A34A', fontSize: '0.85rem', fontWeight: 600, background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>
                      {vol.role}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9rem' }}>
                  <MapPin size={16} color="#94A3B8" /> {vol.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} color="#94A3B8" /> {vol.tasks} Completed Tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9rem' }}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" /> {vol.rating} Performance Rating
                </div>
              </div>
              
              <button style={{ width: '100%', background: vol.status === 'On Mission' ? '#FEF2F2' : (vol.status === 'Available' ? '#F0FDF4' : '#F8FAFC'), color: vol.status === 'On Mission' ? '#DC2626' : (vol.status === 'Available' ? '#16A34A' : '#64748B'), border: vol.status === 'On Mission' ? '1px solid #DC2626' : (vol.status === 'Available' ? '1px solid #16A34A' : '1px solid #E2E8F0'), padding: '12px', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {vol.status === 'On Mission' ? <Activity size={18} /> : <Clock size={18} />} 
                {vol.status}
              </button>
            </div>
          ))}
        </div>
        
      </div>

      {/* Join as Volunteer Modal */}
      {showJoinModal && (
        <VolunteerRegistrationModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
};

export default VolunteersManagement;
