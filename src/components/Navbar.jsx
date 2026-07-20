import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path);
    } else if (link.id) {
      if (pathname !== '/') {
        navigate(`/#${link.id}`);
      } else {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 110;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Food Rescue', id: 'donate' },
    { label: 'Education', id: 'education' },
    { label: 'Clothes', id: 'clothes' },
    { label: 'Volunteers', id: 'volunteers' },
    { label: 'NGO Partners', id: 'ngo' },
    { label: 'Impact', id: 'impact' },
    { label: 'Contact', id: 'footer' },
    { label: 'Join Volunteer', path: '/join-volunteer' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 200 }}>

      {/* ══ Announcement Bar ══ */}
      <div style={{
        background: '#0a1628',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 48px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: contact + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.72)', fontSize: '0.73rem', fontFamily: 'Inter, sans-serif' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.68 3.4 2 2 0 0 1 3.66 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6.12 6.12l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +91 98765 43210
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.72)', fontSize: '0.73rem', fontFamily: 'Inter, sans-serif' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }}></span>
            Online | In-person
          </span>
        </div>

        {/* Right: deadline + language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.72)', fontSize: '0.73rem', fontFamily: 'Inter, sans-serif' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Donation Deadline: Dec 31, 2026
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.73rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="en" style={{ background: '#0a1628' }}>English</option>
              <option value="hi" style={{ background: '#0a1628' }}>हिंदी</option>
              <option value="te" style={{ background: '#0a1628' }}>తెలుగు</option>
              <option value="ml" style={{ background: '#0a1628' }}>മലയാളം</option>
              <option value="kn" style={{ background: '#0a1628' }}>ಕನ್ನಡ</option>
            </select>
          </span>
        </div>
      </div>

      {/* ══ Main Navbar ══ */}
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 16px rgba(10,22,40,0.07)',
      }}>
        <div style={{
          margin: '0 auto',
          padding: '0 48px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}>

          {/* Logo */}
          <div
            onClick={() => handleNavClick({ id: 'home' })}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              overflow: 'hidden', flexShrink: 0,
              border: '2px solid #ccfbf1',
              boxShadow: '0 2px 8px rgba(13,148,136,0.2)',
            }}>
              <img src={logoImg} alt="Food For Hungry" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.3)' }} />
            </div>
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: '1.45rem',
              color: '#0a1628',
              letterSpacing: '-0.02em',
            }}>
              Food <span style={{ color: '#16A34A' }}>For Hungry</span>
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(link)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#000000',
                  cursor: 'pointer',
                  padding: '8px 13px',
                  borderRadius: '6px',
                  transition: 'background 0.18s, color 0.18s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#000000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000000'; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleNavClick({ id: 'donate' })}
            style={{
              flexShrink: 0,
              background: '#000000',
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '0 22px',
              height: '42px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222222'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,0,0,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)'; }}
          >
            Donate Now →
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
