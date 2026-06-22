import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => scrollTo('home')}>
          <div className="navbar-logo-icon">🍽️</div>
          <span className="navbar-logo-text">Food <span>For Hungry</span></span>
        </div>

        {/* Center Nav Links */}
        <div className="navbar-links">
          <button className="navbar-link" onClick={() => scrollTo('home')}>Home</button>
          <button className="navbar-link" onClick={() => scrollTo('donate')}>Donate</button>
          <button className="navbar-link" onClick={() => scrollTo('request')}>Request</button>
          <button className="navbar-link" onClick={() => scrollTo('ngo-dashboard')}>NGOs</button>
          <button className="navbar-link" onClick={() => scrollTo('volunteer-dashboard')}>Volunteers</button>
          <button className="navbar-link" onClick={() => scrollTo('admin-dashboard')}>About</button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Language Pill Toggle */}
          <div className="lang-toggle">
            <button
              className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
              onClick={() => setLanguage('ta')}
            >தமிழ்</button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >English</button>
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >हिंदी</button>
          </div>

          <button className="bell-btn">
            <Bell size={20} />
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => scrollTo('donate')}
          >
            Donate Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
