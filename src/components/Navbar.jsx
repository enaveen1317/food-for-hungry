import React from 'react';
import { Heart, Bell, User, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
      <div className="container flex items-center justify-between" style={{ height: '80px' }}>
        
        {/* Left: Logo */}
        <div onClick={() => scrollTo('home')} className="flex items-center gap-2 cursor-pointer">
          <Heart size={32} color="var(--primary)" fill="var(--primary)" />
          <span className="text-2xl font-bold text-main">Food<span className="text-primary"> For Hungry</span></span>
        </div>
        
        {/* Center: Main Links */}
        <div className="flex items-center gap-6 font-medium hidden md:flex">
          <button onClick={() => scrollTo('home')} className="nav-link">Home</button>
          <button onClick={() => scrollTo('donate')} className="nav-link">Donate</button>
          <button onClick={() => scrollTo('request')} className="nav-link">Request Food</button>
          <button onClick={() => scrollTo('ngo-dashboard')} className="nav-link">NGOs</button>
          <button onClick={() => scrollTo('volunteer-dashboard')} className="nav-link">Volunteers</button>
          <button onClick={() => scrollTo('heatmap')} className="nav-link">Heatmap</button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-muted" style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <Globe size={18} />
            <select 
              value={language}
              style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: '600', color: 'inherit' }}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
              <option value="hi">HI</option>
            </select>
          </div>
          <button className="nav-link text-muted flex items-center justify-center" style={{ padding: '0.5rem' }}>
            <Bell size={22} />
          </button>
          <button onClick={() => scrollTo('admin-dashboard')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', gap: '0.5rem' }}>
            <User size={18} /> Admin
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
