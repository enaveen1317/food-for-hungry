import React from 'react';
import { useLanguage } from '../context/LanguageContext';

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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div className="navbar-logo-icon">🍽️</div>
              <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>Food For Hungry</span>
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
