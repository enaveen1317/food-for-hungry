import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();

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
        <div className="navbar-logo" onClick={() => scrollTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src={logoImg} alt="Food For Hungry Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.35)' }} />
          </div>
          <span className="navbar-logo-text" style={{ fontSize: '1.4rem' }}>Food <span>For Hungry</span></span>
        </div>

        {/* Center Nav Links */}
        <div className="navbar-links">
          <button className="navbar-link" onClick={() => scrollTo('home')}>{t('navHome')}</button>
          <button className="navbar-link" onClick={() => scrollTo('donate')}>{t('navDonate')}</button>
          <button className="navbar-link" onClick={() => scrollTo('request')}>{t('navRequest')}</button>
          <button className="navbar-link" onClick={() => scrollTo('volunteer-dashboard')}>{t('navVolunteers')}</button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Language Dropdown */}
          <div className="lang-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', fontSize: '1.2rem', pointerEvents: 'none' }}>🌐</span>
            <select
              className="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                appearance: 'none',
                background: '#ECFDF5',
                border: '1px solid #D1FAE5',
                borderRadius: '9999px',
                padding: '8px 36px 8px 40px',
                fontFamily: 'Poppins',
                fontWeight: '600',
                color: 'var(--green-deep)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'var(--transition)'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
            <span style={{ position: 'absolute', right: '14px', fontSize: '0.8rem', pointerEvents: 'none', color: 'var(--green-primary)' }}>▼</span>
          </div>

          <button className="bell-btn">
            <Bell size={20} />
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => scrollTo('donate')}
          >
            {t('btnDonateNow')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
