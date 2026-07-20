import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                overflow: 'hidden', flexShrink: 0,
                border: '2px solid #ccfbf1',
                boxShadow: '0 2px 8px rgba(13,148,136,0.2)',
                background: 'white'
              }}>
                <img src={logoImg} alt="Food For Hungry" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.3)' }} />
              </div>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
                Food <span style={{ color: '#4ade80' }}>For Hungry</span>
              </span>
            </div>
            <p className="footer-tagline">{t('footerTagline')}</p>
          </div>
          <div>
            <div className="footer-col-title">{t('footerCol1')}</div>
            <button className="footer-link" onClick={() => scrollTo('donate')}>{t('footerLink1')}</button>
            <button className="footer-link" onClick={() => scrollTo('request')}>{t('footerLink2')}</button>
            <button className="footer-link" onClick={() => scrollTo('donor-dashboard')}>{t('footerLink3')}</button>
            <button className="footer-link" onClick={() => window.location.href = '/admin'}>Admin Portal</button>
          </div>
          <div>
            <div className="footer-col-title">{t('footerCol2')}</div>
            <button className="footer-link" onClick={() => scrollTo('volunteer-dashboard')}>{t('footerLink4')}</button>
            <button className="footer-link" onClick={() => scrollTo('ngos')}>{t('footerLink5')}</button>
            <button className="footer-link" onClick={() => scrollTo('home')}>{t('footerLink6')}</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">{t('footerCopy')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
