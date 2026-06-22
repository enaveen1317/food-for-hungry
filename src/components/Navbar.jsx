import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      <div className="wrap nav-row">
        {/* Logo */}
        <div className="nav-logo" onClick={() => go('home')}>
          <div className="nav-logo-leaf">🌿</div>
          <span className="nav-logo-name">Food <strong>For Hungry</strong></span>
        </div>

        {/* Center links */}
        <div className="nav-links">
          {[
            ['home',      'Home'],
            ['donate',    'Donate'],
            ['request',   'Request Food'],
            ['volunteers','Volunteers'],
            ['ngo-dashboard','NGOs'],
            ['stories',   'Stories'],
            ['about',     'About'],
          ].map(([id, label]) => (
            <button key={id} className="nav-lnk" onClick={() => go(id)}>{label}</button>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          {/* Language pill */}
          <div className="lang-sw">
            {[['ta','தமிழ்'],['en','EN'],['hi','हि']].map(([code, label]) => (
              <button
                key={code}
                className={`lang-sw-btn${language === code ? ' on' : ''}`}
                onClick={() => setLanguage(code)}
              >{label}</button>
            ))}
          </div>

          <button className="nav-login" onClick={() => go('home')}>Login</button>
          <button className="btn btn-green btn-sm" onClick={() => go('donate')}>Donate Food</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
