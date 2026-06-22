import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        {/* Logo */}
        <div className="nav-logo" onClick={() => go('home')}>
          <div className="nav-logo-box">🍽️</div>
          <span className="nav-logo-text">Food <em>For Hungry</em></span>
        </div>

        {/* Center links */}
        <div className="nav-links">
          {[['home','Home'],['donate','Donate Food'],['request','Request Food'],['ngo-dashboard','NGOs'],['volunteer-dashboard','Volunteers'],['admin-dashboard','About']].map(([id,label]) => (
            <button key={id} className="nav-link" onClick={() => go(id)}>{label}</button>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          {/* Language pill */}
          <div className="lang-pill">
            {[['ta','தமிழ்'],['en','EN'],['hi','हिंदी']].map(([code,label]) => (
              <button key={code} className={`lang-opt${language===code?' on':''}`} onClick={() => setLanguage(code)}>{label}</button>
            ))}
          </div>

          <button className="nav-bell" title="Notifications">🔔</button>

          <button className="btn btn-primary btn-sm" onClick={() => go('donate')}>
            Donate Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
