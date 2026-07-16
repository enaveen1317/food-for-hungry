import React, { useState } from 'react';
import { ArrowRight, MapPin, CheckCircle, Clock, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import timelineDonor from '../assets/timeline-donor.png';
import timelineDispatch from '../assets/timeline-dispatch.png';
import timelinePickup from '../assets/timeline-pickup.png';
import timelineDelivery from '../assets/timeline-delivery.png';
import requestBg from '../assets/request-bg.png';
import avImg from '../assets/av.png';
import asImg from '../assets/as.png';
import itImg from '../assets/it.png';
import aiImg from '../assets/ai.png';
import heroBg from '../assets/tn.png';
import cardDinnerChildren from '../assets/card-dinner-children.png';
import cardSurplusRice from '../assets/card-surplus-rice.png';
import cardElderlyMeals from '../assets/card-elderly-meals.png';
import storyMonsoon from '../assets/story-monsoon.png';
import storyCorporate from '../assets/story-corporate.png';
import emergencyHeroBg from '../assets/emergency-hero-bg.png';

const Home = () => {
  const { t, language } = useLanguage();
  const { donations, requests, volunteers, tasks } = useApp();

  // ── Live stats calculated from real AppContext data ──────────────────────
  const activeRequestsCount = requests.filter(r => !r.dispatched).length + donations.filter(d => d.status === 'pending' || d.status === 'accepted').length;
  const volunteersReadyCount = volunteers.filter(v => v.status === 'Available').length;
  const pickupsTodayCount = tasks.filter(t => t.status === 'active' || t.status === 'pickup').length;
  const livesImpactedCount = (donations.filter(d => d.status === 'delivered').reduce((acc, d) => acc + (parseInt(d.qty) || 20), 0) + 2840);

  // ── Filter & favourite state ──────────────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState('All');
  const [favourites, setFavourites] = useState({});
  const toggleFav = (key) => setFavourites(prev => ({ ...prev, [key]: !prev[key] }));

  // Map live requests to cards
  const dynamicSOSCards = requests.filter(r => !r.dispatched).map((r, i) => ({
    key: `sos-${r.id || i}`,
    category: 'Food Requests',
    priority: r.urgent ? 'SOS PRIORITY' : 'HIGH PRIORITY',
    priorityColor: r.urgent ? '#DC2626' : '#EF4444',
    priorityShadow: r.urgent ? 'rgba(220,38,38,0.4)' : 'rgba(239,68,68,0.4)',
    btnBg: 'linear-gradient(135deg,#F97316,#EA580C)',
    btnShadow: 'rgba(249,115,22,0.35)',
    img: emergencyHeroBg,
    icon: '🆘',
    title: r.name ? `SOS Request: ${r.name}` : 'Emergency Food Request',
    location: r.loc,
    meta1: `👥 Serves ~${r.ppl} People`,
    meta2color: r.urgent ? '#DC2626' : '#EF4444',
    meta2: '⏰ ASAP',
    foodType: '🍲 Any Food',
    btnLabel: 'btnFulfill',
    modalType: 'Fulfill Request',
    modalTarget: 'donate'
  }));

  // Card definitions so filters can show/hide them
  const CARDS = [
    ...dynamicSOSCards,
    { key: 'dinner', category: 'Food Requests', priority: 'HIGH PRIORITY', priorityColor: '#EF4444', priorityShadow: 'rgba(239,68,68,0.4)', btnBg: 'linear-gradient(135deg,#F97316,#EA580C)', btnShadow: 'rgba(249,115,22,0.35)', img: cardDinnerChildren, icon: '👨\u200d👩\u200d👧', title: 'Dinner for 18 Children', location: 'Hope Shelter, Perambur', meta1: '👨\u200d👩\u200d👧 Serves ~18 Children', meta2color: '#EF4444', meta2: '⏰ Needed today', foodType: '🥗 Veg Dinner', btnLabel: 'btnFulfill', modalType: 'Fulfill Request', modalTarget: 'donate' },
    { key: 'rice', category: 'Volunteer Needed', priority: 'VOLUNTEER NEEDED', priorityColor: '#16A34A', priorityShadow: 'rgba(22,163,74,0.4)', btnBg: 'linear-gradient(135deg,#16A34A,#15803D)', btnShadow: 'rgba(22,163,74,0.35)', img: cardSurplusRice, icon: '🍲', title: 'Surplus Rice & Dal (30 kg)', location: 'Grand Hotel, Velachery', meta1: '📦 30 kg Available', meta2color: '#16A34A', meta2: '🚚 Pickup Today', foodType: '🥗 Veg', btnLabel: 'btnAccept', modalType: 'Accept Pickup', modalTarget: 'volunteer-dashboard' },
    { key: 'elderly', category: 'Food Requests', priority: 'MEDIUM PRIORITY', priorityColor: '#F59E0B', priorityShadow: 'rgba(245,158,11,0.4)', btnBg: 'linear-gradient(135deg,#F97316,#EA580C)', btnShadow: 'rgba(249,115,22,0.35)', img: cardElderlyMeals, icon: '🏠', title: 'Packed Meals for Elderly', location: 'Old Age Home, T Nagar', meta1: '👴 Serves ~25 People', meta2color: '#F59E0B', meta2: '⏰ Needed by 6 PM', foodType: '🥗 Veg Meals', btnLabel: 'btnFulfill', modalType: 'Fulfill Request', modalTarget: 'donate' },
    { key: 'daily1', category: 'Daily Updates', priority: 'LATEST UPDATE', priorityColor: '#3B82F6', priorityShadow: 'rgba(59,130,246,0.4)', btnBg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', btnShadow: 'rgba(59,130,246,0.35)', img: storyMonsoon, icon: '📰', title: 'Monsoon Relief Food Camp', location: 'Chennai Central', meta1: '👥 150+ Served', meta2color: '#3B82F6', meta2: '🕒 1 hr ago', foodType: '🍲 Hot Meals', btnLabel: 'Read More', modalType: 'Info', modalTarget: 'none' },
    { key: 'daily2', category: 'Daily Updates', priority: 'NGO HIGHLIGHT', priorityColor: '#8B5CF6', priorityShadow: 'rgba(139,92,246,0.4)', btnBg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', btnShadow: 'rgba(139,92,246,0.35)', img: storyCorporate, icon: '🏢', title: 'Corporate Mega Drive', location: 'OMR IT Park', meta1: '📦 500 kg Rescued', meta2color: '#8B5CF6', meta2: '🕒 4 hrs ago', foodType: '🍱 Mixed Surplus', btnLabel: 'Read More', modalType: 'Info', modalTarget: 'none' },
  ];
  const visibleCards = activeFilter === 'All' ? CARDS : CARDS.filter(c => c.category === activeFilter);
  const [activeModal, setActiveModal] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNGOModal, setShowNGOModal] = useState(false);
  const [ngoSuccess, setNgoSuccess] = useState(false);
  const [ngoSubmitting, setNgoSubmitting] = useState(false);
  const [ngoForm, setNgoForm] = useState({
    orgName: '', type: '', city: '', district: '', address: '',
    phone: '', email: '', website: '', regNo: '', focus: ''
  });
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  const handleNgoChange = (e) => setNgoForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleNgoSubmit = () => {
    if (!ngoForm.orgName || !ngoForm.city || !ngoForm.phone || !ngoForm.email) return;
    setNgoSubmitting(true);
    setTimeout(() => { setNgoSubmitting(false); setNgoSuccess(true); }, 1400);
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero" style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0) 65%), url(${heroBg})`,
        backgroundSize: 'auto 100%',
        backgroundPosition: 'right bottom',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        margin: '0',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="hero-inner container" style={{ width: '100%', paddingLeft: '40px' }}>

          {/* Left: Text Content */}
          <div className="hero-content" style={{ padding: '40px 0', maxWidth: '600px' }}>

            {/* Eyebrow tag */}
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
                Zero Hunger Initiative
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-title" style={{ color: '#000000', letterSpacing: '-0.02em', fontWeight: 900 }}>
              From Waste to Worth –
              <span style={{ color: '#16A34A' }}>Feeding Every Hungry<br />Heart.</span>
            </h1>

            {/* Org / meta */}
            <div className="hero-meta" style={{ color: '#000000', fontSize: '1rem', fontWeight: 500 }}>
              Organised by <strong style={{ color: '#000000', fontWeight: 800 }}>Food For Hungry Foundation</strong><br />
              Tamil Nadu, India &nbsp;·&nbsp; <strong style={{ color: '#000000', fontWeight: 800 }}>Active Since 2022</strong>
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle" style={{ color: '#000000', fontSize: '1.1rem', fontWeight: 500, marginBottom: '36px', lineHeight: 1.6 }}>
              Connect surplus food from restaurants, events, and homes directly to NGOs and volunteers. Together, we reduce waste and end hunger — fast, verified, and transparent.
            </p>

            {/* CTAs */}
            <div className="hero-btns">
              <button className="hero-btn-primary" onClick={() => scrollTo('donate')}>
                🍱 Donate Food
              </button>
              <button className="hero-btn-secondary" onClick={() => scrollTo('request')}>
                Request Food <ArrowRight size={16} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-badges">
              <span className="trust-badge">✅ Verified NGO Network</span>
              <span className="trust-badge">🚴 Live GPS Routing</span>
              <span className="trust-badge">📍 Local Impact</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── NEW SECTION: SERVICE CARDS ───────────────────────── */}
      <section id="services" style={{ width: '100%', background: '#F8FAFC', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1400px' }}>
          <img src={avImg} alt="Our Core Services" style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* Clickable Overlays */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => {
                const el = document.getElementById('donate');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
              }}
              title="Go to Food Rescue"
            />
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => {
                const el = document.getElementById('education');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
              }}
              title="Go to Education Support"
            />
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => {
                const el = document.getElementById('clothes');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
              }}
              title="Go to Clothes Donation"
            />
          </div>
        </div>
      </section>

      {/* ── NEW SECTION: IMPACT DASHBOARD ───────────────────────── */}
      <div id="impact" style={{ background: '#F8FAFC', padding: '0', display: 'flex', justifyContent: 'center' }}>
        <img src={itImg} alt="Our Live Impact" style={{ width: '100%', maxWidth: '1400px', height: 'auto', display: 'block' }} />
      </div>

      {/* ── SECTION B: HOW FOOD RESCUE WORKS ────────────────────────────── */}
      <section className="section section-white" style={{ paddingTop: '20px', paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '60px' }}>
            <div className="section-tag" style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', padding: '8px 16px', fontSize: '0.95rem' }}>⚙️ {t('howTitleTag') || 'Our Operations'}</div>
            <h2 className="section-title" style={{ fontSize: '3.6rem', fontWeight: 900, marginTop: '20px', letterSpacing: '-0.02em', color: '#0f172a' }}>How <span style={{ color: '#16A34A' }}>We</span> Work</h2>
            <p className="section-sub" style={{ maxWidth: '700px', fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginTop: '20px' }}>
              A seamlessly integrated pipeline that moves surplus food from donor to beneficiary in under 60 minutes.
            </p>
          </div>

          <div className="timeline-zigzag-grid">
            {/* Background SVG curve connector lines */}
            <svg className="timeline-svg-connector" viewBox="0 0 1000 860" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
              {/* Curve 1 to 2 */}
              <path d="M 620 120 C 720 120, 720 340, 380 340" stroke="#000000" strokeWidth="2" strokeDasharray="4 6" />
              {/* Curve 2 to 3 */}
              <path d="M 380 340 C 280 340, 280 560, 620 560" stroke="#000000" strokeWidth="2" strokeDasharray="4 6" />
              {/* Curve 3 to 4 */}
              <path d="M 620 560 C 720 560, 720 780, 380 780" stroke="#000000" strokeWidth="2" strokeDasharray="4 6" />

              {/* Connection Dots */}
              <circle cx="380" cy="780" r="5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
            </svg>

            {/* Row 1: Step 01 */}
            <div className="timeline-step-row timeline-row-left">
              <div className="timeline-step-card card-step-1">
                <div className="timeline-step-img-wrap">
                  <img src={timelineDonor} alt="Donor lists surplus" className="timeline-step-img" />
                </div>
                <div className="timeline-step-body">
                  <div className="timeline-step-header">
                    <span className="timeline-step-badge badge-step-1">01</span>
                    <h3 className="timeline-step-title">{t('howStep1') || 'Donor Lists Surplus'}</h3>
                  </div>
                  <p className="timeline-step-desc">
                    {t('howDesc2') || 'Hotels, restaurants, events, or homes upload listing details, food photos, and quantity.'}
                  </p>
                  <div className="timeline-step-tags">
                    <span className="timeline-tag-pill tag-step-1">📝 Easy Listing</span>
                    <span className="timeline-tag-pill tag-step-1">📷 Photo & Details</span>
                    <span className="timeline-tag-pill tag-step-1">📍 Live Location</span>
                  </div>
                </div>
              </div>
              <div className="timeline-deco-wrap deco-right">
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="timeline-deco-svg">
                  <path d="M40 80 C40 50, 80 50, 80 80 C80 100, 40 120, 40 120" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  <circle cx="60" cy="80" r="8" stroke="#BBF7D0" strokeWidth="2" opacity="0.6" />
                  <rect x="90" y="70" width="60" height="50" rx="4" stroke="#BBF7D0" strokeWidth="2" opacity="0.6" />
                  <path d="M85 70 L120 40 L155 70" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  <path d="M140 105 C140 115, 175 115, 175 105 Z" stroke="#BBF7D0" strokeWidth="2" opacity="0.6" />
                  <circle cx="150" cy="98" r="3" fill="#BBF7D0" opacity="0.6" />
                  <circle cx="165" cy="98" r="3" fill="#BBF7D0" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Row 2: Step 02 */}
            <div className="timeline-step-row timeline-row-right">
              <div className="timeline-deco-wrap deco-left">
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="timeline-deco-svg">
                  <path d="M30 110 C50 110, 45 60, 90 60 C135 60, 130 110, 170 110" stroke="#FFEDD5" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                  <circle cx="90" cy="60" r="5" fill="#FFEDD5" opacity="0.7" />
                  <circle cx="170" cy="110" r="5" fill="#FFEDD5" opacity="0.7" />
                  <g transform="translate(20, 80)">
                    <circle cx="15" cy="25" r="5" stroke="#FFEDD5" strokeWidth="2" opacity="0.7" />
                    <circle cx="35" cy="25" r="5" stroke="#FFEDD5" strokeWidth="2" opacity="0.7" />
                    <path d="M10 20 L40 20 L35 12 L18 12 Z" stroke="#FFEDD5" strokeWidth="2" opacity="0.7" />
                    <path d="M33 12 L33 5" stroke="#FFEDD5" strokeWidth="2" opacity="0.7" />
                  </g>
                </svg>
              </div>
              <div className="timeline-step-card card-step-2">
                <div className="timeline-step-img-wrap">
                  <img src={timelineDispatch} alt="Smart Dispatch" className="timeline-step-img" />
                </div>
                <div className="timeline-step-body">
                  <div className="timeline-step-header">
                    <span className="timeline-step-badge badge-step-2">02</span>
                    <h3 className="timeline-step-title">{t('howStep2') || 'Smart Dispatch'}</h3>
                  </div>
                  <p className="timeline-step-desc">
                    {t('howDesc3') || 'Our algorithm checks freshness, quantity, and pings the nearest verified NGO and rider.'}
                  </p>
                  <div className="timeline-step-tags">
                    <span className="timeline-tag-pill tag-step-2">✨ AI Matching</span>
                    <span className="timeline-tag-pill tag-step-2">🔔 Instant Alerts</span>
                    <span className="timeline-tag-pill tag-step-2">🤝 Best Match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Step 03 */}
            <div className="timeline-step-row timeline-row-left">
              <div className="timeline-step-card card-step-3">
                <div className="timeline-step-img-wrap">
                  <img src={timelinePickup} alt="Route & Pickup" className="timeline-step-img" />
                </div>
                <div className="timeline-step-body">
                  <div className="timeline-step-header">
                    <span className="timeline-step-badge badge-step-3">03</span>
                    <h3 className="timeline-step-title">{t('howStep3') || 'Route & Pickup'}</h3>
                  </div>
                  <p className="timeline-step-desc">
                    {t('howDesc4') || 'Volunteer rider accepts, navigates via optimized GPS route, packs and secures food.'}
                  </p>
                  <div className="timeline-step-tags">
                    <span className="timeline-tag-pill tag-step-3">🚴 Optimized Route</span>
                    <span className="timeline-tag-pill tag-step-3">👁️ Live Tracking</span>
                    <span className="timeline-tag-pill tag-step-3">⏱️ Quick Pickup</span>
                  </div>
                </div>
              </div>
              <div className="timeline-deco-wrap deco-right">
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="timeline-deco-svg">
                  <path d="M40 100 Q 80 40, 120 100 T 200 100" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                  <circle cx="40" cy="100" r="5" fill="#DBEAFE" opacity="0.7" />
                  <circle cx="120" cy="100" r="5" fill="#DBEAFE" opacity="0.7" />
                  <circle cx="170" cy="100" r="5" fill="#DBEAFE" opacity="0.7" />
                </svg>
              </div>
            </div>

            {/* Row 4: Step 04 */}
            <div className="timeline-step-row timeline-row-right">
              {/* Quote Block (Desktop left column, mobile order: 2) */}
              <div className="timeline-quote-box">
                <p className="timeline-quote-text">
                  From a generous heart to a grateful heart <span style={{ color: '#16A34A', fontWeight: 700 }}>in under 60 minutes.</span> ❤️
                </p>
              </div>

              {/* Step 4 Card (Desktop right column, mobile order: 1) */}
              <div className="timeline-step-card card-step-4">
                <div className="timeline-step-img-wrap">
                  <img src={timelineDelivery} alt="Delivery Complete" className="timeline-step-img" />
                  <div className="timeline-img-overlay-checkmark">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                      <path d="M20 6 L9 17 L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="timeline-step-body">
                  <div className="timeline-step-header">
                    <span className="timeline-step-badge badge-step-4">04</span>
                    <h3 className="timeline-step-title">{t('howStep4') || 'Delivery Complete'}</h3>
                  </div>
                  <p className="timeline-step-desc">
                    {t('howDesc5') || 'Food reaches the shelter. Verification is confirmed and proof of delivery uploaded.'}
                  </p>
                  <div className="timeline-step-tags">
                    <span className="timeline-tag-pill tag-step-4">✅ Quality Check</span>
                    <span className="timeline-tag-pill tag-step-4">📁 Proof Upload</span>
                    <span className="timeline-tag-pill tag-step-4">😊 Delivery Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Value Strip */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
            <img src={aiImg} alt="Key Benefits" style={{ width: '100%', maxWidth: '1400px', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SECTION C: NEARBY ACTIVE REQUESTS ────────────────────────────── */}
      <section className="section section-cream" id="live-feed" style={{ paddingTop: '30px' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              🌿 LIVE FEED <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#DCFCE7', color: '#16A34A', borderRadius: '9999px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid #BBF7D0' }}>● <span style={{ animation: 'pulse 2s infinite' }}>((·))</span></span>
            </div>
            <h2 className="section-title">Nearby <span style={{ color: 'var(--green-primary)' }}>Active</span> Requests</h2>
            <p className="section-sub" style={{ marginBottom: '4px' }}>Real needs. Real people. Real time.</p>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '0' }}>See what's happening near you and make an impact today. 💚</p>
          </div>

          {/* Filter Bar — fully functional */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { icon: '🍽️', label: 'All' },
                { icon: '🍱', label: 'Food Requests' },
                { icon: '🤝', label: 'Volunteer Needed' },
                { icon: '🐾', label: 'Pet Food Support' },
                { icon: '📰', label: 'Daily Updates' },
              ].map((f, i) => {
                const isActive = activeFilter === f.label;
                return (
                  <button key={i}
                    onClick={() => setActiveFilter(f.label)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '9999px',
                      border: isActive ? 'none' : '1px solid #E5E7EB',
                      background: isActive ? 'var(--green-primary)' : 'white',
                      color: isActive ? 'white' : '#374151',
                      fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 12px rgba(22,163,74,0.3)' : 'none',
                    }}>
                    <span style={{ fontSize: '1rem' }}>{f.icon}</span> {f.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid #E5E7EB', background: 'white', fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              📍 Chennai, Tamil Nadu <span style={{ marginLeft: '4px' }}>▾</span>
            </div>
          </div>

          {/* Cards — rendered from CARDS array, filtered by activeFilter */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px', marginBottom: '32px' }}>
            {visibleCards.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '0.95rem' }}>
                No requests found in this category. Try a different filter.
              </div>
            )}
            {visibleCards.map((card) => (
              <div key={card.key} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9', transition: 'transform 0.25s, box-shadow 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.13)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'; }}>
                {/* Photo */}
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: card.priorityColor, color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: `0 2px 8px ${card.priorityShadow}` }}>
                    {card.priority === 'HIGH PRIORITY' ? '🔥' : card.priority === 'VOLUNTEER NEEDED' ? '🤝' : '🔔'} {card.priority}
                  </span>
                  {/* Favourite button — toggles heart */}
                  <button
                    onClick={() => toggleFav(card.key)}
                    style={{ position: 'absolute', top: '10px', right: '12px', background: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: '1.1rem', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {favourites[card.key] ? '❤️' : '🤍'}
                  </button>
                  {/* Category icon circle */}
                  <div style={{ position: 'absolute', bottom: '-20px', left: '16px', width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>{card.icon}</div>
                </div>
                {/* Body */}
                <div style={{ padding: '28px 18px 18px' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: '#111827', marginBottom: '4px' }}>{card.title}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280', fontSize: '0.8rem', marginBottom: '12px' }}>📍 {card.location}</p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>{card.meta1}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: card.meta2color, fontWeight: 600 }}>{card.meta2}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>Food Type</p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>{card.foodType}</span>
                    </div>
                    <button
                      style={{ background: card.btnBg, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 12px ${card.btnShadow}` }}
                      onClick={() => { setActiveModal({ title: card.title, location: card.location, type: card.modalType, target: card.modalTarget }); setModalSuccess(false); }}
                    >
                      {t(card.btnLabel)} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats Strip — LIVE calculated from AppContext */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px 28px', border: '1px solid #EEF2F7', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🛍️</div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: 'var(--green-primary)', lineHeight: 1.1 }}>Small Help.</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1.1 }}>Big Impact.</p>
                <p style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '4px' }}>Your kindness can fill many empty plates.</p>
              </div>
            </div>
            {[
              { icon: '🍲', val: (124 + activeRequestsCount).toString(), label: 'Active Requests', sub: 'in Chennai' },
              { icon: '🤝', val: (48 + volunteersReadyCount).toString(), label: 'Volunteers', sub: 'Ready to Help' },
              { icon: '🚚', val: (32 + pickupsTodayCount).toString(), label: 'Pickups Today', sub: 'In Progress' },
              { icon: '❤️', val: livesImpactedCount.toLocaleString('en-IN'), label: 'Lives You Can', sub: 'Impact Today' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid #F1F5F9' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{s.icon}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: ['#16A34A', '#3B82F6', '#F97316', '#EF4444'][i], lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', lineHeight: 1.3 }}>{s.label}</p>
                  <p style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION D: VERIFIED NGO NETWORK ────────────────────────────── */}
      <section className="section section-white" id="ngos">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-tag">{t('partnerTag')}</div>
              <h2 className="section-title">{t('partnerTitle')}</h2>
              <p className="section-sub" style={{ margin: 0 }}>{t('partnerSub')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {[
              {
                e: '🍱',
                name: 'Robin Hood Army — Chennai',
                state: 'Tamil Nadu',
                area: 'Chennai & surrounding districts',
                address: 'Decentralised chapters across Chennai, Tamil Nadu',
                phone: '+91 98843 17823',
                email: 'robinhoodarmychennai@gmail.com',
                website: 'https://robinhoodarmy.com',
                del: 12400, vol: 320,
                focus: ['Surplus food rescue', 'Homeless', 'Orphanages'],
                rating: '4.9',
                reg: 'Zero-funds volunteer organisation',
              },
              {
                e: '♻️',
                name: 'No Food Waste',
                state: 'Tamil Nadu',
                area: 'Coimbatore · Chennai · Trichy · Salem',
                address: 'No 4, Kothari Layout, 1st St, Ramanathapuram, Coimbatore – 641045',
                phone: '+91 90877 90877',
                email: 'info@nofoodwaste.org',
                website: 'https://nofoodwaste.org',
                del: 98700, vol: 2800,
                focus: ['Food recovery', 'Events & weddings', 'Daily meals'],
                rating: '4.9',
                reg: 'Registered under Societies Act, Tamil Nadu',
              },
              {
                e: '🌿',
                name: 'Akshaya Trust — Madurai',
                state: 'Tamil Nadu',
                area: 'Madurai city & surrounding districts',
                address: '9, West 1st Main St, Doak Nagar Extn, Madurai – 625 010',
                phone: '+91 98433 19933',
                email: 'mduakshaya@gmail.com',
                website: 'https://akshayatrust.org',
                del: 8400, vol: 180,
                focus: ['Destitute & elderly', 'Homeless', 'Shelters'],
                rating: '4.8',
                reg: '12A & 80G certified NGO',
              },
              {
                e: '🤝',
                name: 'Goonj — Tamil Nadu',
                state: 'Tamil Nadu',
                area: 'Chennai · Coimbatore · Pan-TN operations',
                address: 'Plot 25/26, 2nd Main Rd, Kovilambakkam, Chennai – 600117',
                phone: '+91 44 4953 3991',
                email: 'anisha@goonj.org',
                website: 'https://goonj.org',
                del: 45000, vol: 1200,
                focus: ['Disaster relief', 'Rural development', 'Migrants'],
                rating: '4.7',
                reg: 'FCRA registered · 80G certified',
              },
              {
                e: '🏛️',
                name: 'Indira Charitable Trust',
                state: 'Tamil Nadu',
                area: 'Tondiarpet, North Chennai',
                address: 'No. 124, O Block, VOC Nagar, Tondiarpet, Chennai – 600081',
                phone: '+91 97908 33859',
                email: 'indiracharitabletrust@gmail.com',
                website: 'https://indiracharitabletrust.com',
                del: 6300, vol: 95,
                focus: ['Poverty alleviation', 'Hunger relief', 'Children'],
                rating: '4.7',
                reg: 'Registered Trust, Tamil Nadu',
              },
              {
                e: '🍲',
                name: 'Feeding India — TN Chapter',
                state: 'Tamil Nadu',
                area: 'Tamil Nadu Chapter Active',
                address: 'Contact via official portal for Tamil Nadu partnerships',
                phone: 'contact@feedingindia.org',
                email: 'contact@feedingindia.org',
                website: 'https://feedingindia.org',
                del: 250000, vol: 8000,
                focus: ['School meals', 'Mid-day meals', 'Large-scale relief'],
                rating: '4.8',
                reg: 'Section 8 Company · MCA registered',
              },
              {
                e: '🏠',
                name: 'Udhavum Karangal',
                state: 'Tamil Nadu',
                area: 'Chennai & Coimbatore',
                address: '460, NSK Nagar, Anna Nagar, Chennai – 600106',
                phone: '+91 44 2621 6321',
                email: 'hq@udhavumkarangal.org',
                website: 'https://udhavumkarangal.org',
                del: 89000, vol: 450,
                focus: ['Destitute Care', 'Daily Feeding', 'Orphans'],
                rating: '4.9',
                reg: 'Registered NGO, Govt of Tamil Nadu',
              },
              {
                e: '🕊️',
                name: 'The Banyan',
                state: 'Tamil Nadu',
                area: 'Chennai & Kanchipuram',
                address: '6th Main Rd, Mogappair Eri Scheme, Chennai – 600037',
                phone: '+91 98400 33333',
                email: 'info@thebanyan.org',
                website: 'https://thebanyan.org',
                del: 62000, vol: 310,
                focus: ['Homeless feeding', 'Mental Health Care', 'Rescue'],
                rating: '4.9',
                reg: 'Registered Trust, 80G Certified',
              },
            ].map((n, i) => (
              <div key={i} className="card" style={{ flex: '1 1 320px', maxWidth: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '16px', transition: 'var(--transition)' }}>
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#ECFDF5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, border: '1px solid #D1FAE5' }}>{n.e}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.92rem', color: '#111827', lineHeight: 1.3, marginBottom: '3px' }}>{n.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.62rem', color: '#15803D', fontWeight: 700, background: '#DCFCE7', padding: '2px 6px', borderRadius: '9999px' }}>✔ Verified Partner</span>
                        <span style={{ fontSize: '0.62rem', color: '#1D4ED8', fontWeight: 700, background: '#DBEAFE', padding: '2px 6px', borderRadius: '9999px' }}>📍 {n.state}</span>
                      </div>
                      <p style={{ fontSize: '0.62rem', color: '#6B7280', marginTop: '3px' }}>{n.reg}</p>
                    </div>
                  </div>

                  {/* Location Box */}
                  <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px', borderLeft: '3px solid #16A34A' }}>
                    <p style={{ fontSize: '0.73rem', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>📍 {n.area}</p>
                    <p style={{ fontSize: '0.68rem', color: '#374151', lineHeight: 1.5 }}>{n.address}</p>
                  </div>

                  {/* Contact Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#374151' }}>📞</span>
                      <a href={`tel:${n.phone}`} style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600, textDecoration: 'none' }}>{n.phone}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#374151' }}>✉️</span>
                      <a href={`mailto:${n.email}`} style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600, textDecoration: 'none' }}>{n.email}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#374151' }}>🌐</span>
                      <a href={n.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>{n.website.replace('https://', '')}</a>
                    </div>
                  </div>

                  {/* Focus Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {n.focus.map((f, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px', background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Stats + CTA */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1 }}>{n.del.toLocaleString('en-IN')}</p>
                      <p style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>Deliveries</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1 }}>{n.vol.toLocaleString('en-IN')}</p>
                      <p style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>Volunteers</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={`tel:${n.phone}`} className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Connect</a>
                    <a href={n.website} target="_blank" rel="noopener noreferrer" style={{ minWidth: '56px', padding: '6px 10px', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#374151', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '8px' }}>{n.rating} ★</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION E: RESCUE STORIES ────────────────────────────── */}
      <section className="section section-cream" style={{ position: 'relative', overflow: 'hidden', paddingTop: '10px', marginTop: '-50px' }}>

        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '40px', left: '40px', opacity: 0.18, pointerEvents: 'none' }}>
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
            <path d="M40 10 C20 20, 5 40, 10 60 C15 80, 35 90, 40 110 C45 90, 65 80, 70 60 C75 40, 60 20, 40 10Z" fill="#16A34A" />
            <path d="M40 30 C30 40, 20 55, 25 68 C30 82, 40 88, 40 100" stroke="#16A34A" strokeWidth="2" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '80px', left: '130px', opacity: 0.15, pointerEvents: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#16A34A"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '60px', right: '120px', opacity: 0.15, pointerEvents: 'none' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#16A34A"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '30px', right: '50px', opacity: 0.12, pointerEvents: 'none' }}>
          <svg width="60" height="90" viewBox="0 0 60 90" fill="none">
            <path d="M30 8 C15 16, 5 30, 8 46 C11 62, 26 68, 30 82 C34 68, 49 62, 52 46 C55 30, 45 16, 30 8Z" fill="#16A34A" />
          </svg>
        </div>

        <div className="container">
          {/* Section Header */}
          <div className="section-header" style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', color: '#15803D', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', border: '1px solid #BBF7D0' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#16A34A"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" /></svg>
              {t('storyTag')}
            </div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '2.8rem', color: '#0F172A', marginBottom: '12px', lineHeight: 1.1 }}>{t('storyTitle')}</h2>
            <p style={{ color: '#374151', fontSize: '1rem', fontWeight: 500, lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 20px' }}>{t('storySub')}</p>
            {/* Green divider line */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #16A34A)' }}></div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#16A34A"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" /></svg>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #16A34A, transparent)' }}></div>
            </div>
          </div>

          {/* Story Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '28px', marginTop: '48px' }}>
            {[
              {
                emoji: '🎉',
                iconBg: '#EDE9FE',
                iconColor: '#7C3AED',
                accentColor: '#7C3AED',
                title: 'Wedding Leftovers',
                desc: '42 portions of premium meals rescued from a marriage hall in Adyar and delivered to a local orphanage within 45 minutes.',
                photo: new URL('../assets/story-wedding.png', import.meta.url).href,
                photoBg: '#EDE9FE',
                stats: [
                  { icon: '🍽️', value: '42', label: 'Meals Rescued' },
                  { icon: '📍', value: 'Adyar', label: 'Location' },
                  { icon: '⏱️', value: '45 min', label: 'Delivery Time' },
                ]
              },
              {
                emoji: '🌧️',
                iconBg: '#DCFCE7',
                iconColor: '#16A34A',
                accentColor: '#16A34A',
                title: 'Monsoon Relief',
                desc: 'During heavy rains, home cooks prepared and pooled 120 hot meals, distributed safely by our fleet to stranded families.',
                photo: new URL('../assets/story-monsoon.png', import.meta.url).href,
                photoBg: '#DCFCE7',
                stats: [
                  { icon: '🍱', value: '120', label: 'Meals Distributed' },
                  { icon: '👨‍👩‍👧', value: 'Stranded Families', label: 'Beneficiaries' },
                  { icon: '🚴', value: 'Our Fleet', label: 'Delivered Safely' },
                ]
              },
              {
                emoji: '🏢',
                iconBg: '#FEF3C7',
                iconColor: '#D97706',
                accentColor: '#D97706',
                title: 'Corporate Cafe',
                desc: 'An IT park cafeteria pledged their daily surplus. Now, 50 fresh meals reliably reach an elderly care home every evening.',
                photo: new URL('../assets/story-corporate.png', import.meta.url).href,
                photoBg: '#FEF3C7',
                stats: [
                  { icon: '🍽️', value: '50', label: 'Meals Every Day' },
                  { icon: '💚', value: 'Elderly Care Home', label: 'Recipient' },
                  { icon: '📅', value: 'Every Evening', label: 'Consistency' },
                ]
              }
            ].map((story, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(16,24,40,0.09)', border: '1px solid #F1F5F9', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(16,24,40,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,24,40,0.09)'; }}>

                {/* Card Top: icon + photo overlapping */}
                <div style={{ position: 'relative', height: '180px', background: story.photoBg, overflow: 'hidden' }}>
                  {/* Real photo */}
                  <img src={story.photo} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)' }}></div>
                  {/* Emoji icon circle - top left */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', width: '52px', height: '52px', borderRadius: '50%', background: story.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '3px solid white' }}>
                    {story.emoji}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 22px 0' }}>
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', marginBottom: '6px', lineHeight: 1.3 }}>{story.title}</h4>
                  {/* Accent underline */}
                  <div style={{ width: '36px', height: '3px', background: story.accentColor, borderRadius: '9999px', marginBottom: '12px' }}></div>
                  <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.7, fontWeight: 500, marginBottom: '18px' }}>{story.desc}</p>
                </div>

                {/* Stats Strip */}
                <div style={{ marginTop: 'auto', padding: '14px 22px 20px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${story.stats.length}, 1fr)`, gap: '8px' }}>
                    {story.stats.map((stat, si) => (
                      <div key={si} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{stat.icon}</div>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.82rem', color: '#0F172A', lineHeight: 1.2, marginBottom: '2px' }}>{stat.value}</p>
                        <p style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2 }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION F: SOS EMERGENCY ───────────────────────────── */}
      <section className="section" id="sos-request" style={{ background: '#F8FAFC', padding: '72px 0' }}>
        <div className="container">

          {/* ── Main Two-Column Card ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
            borderRadius: '32px',
            boxShadow: '0 32px 100px rgba(0,0,0,0.6), 0 0 50px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '52px 56px 40px',
            position: 'relative',
            overflow: 'visible',
          }}>

            {/* Two Column Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '56px',
              alignItems: 'center',
              marginBottom: '40px',
            }}>

              {/* ── LEFT COLUMN ── */}
              <div>

                {/* Badge — pulsing dot + bell + text */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: '28px',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.15)',
                }}>
                  <span style={{ fontSize: '1rem', display: 'inline-flex', alignItems: 'center', marginTop: '-2px' }}>🚨</span>
                  {t('sosActive')}
                </div>

                {/* Split-colour Title */}
                <h2 style={{
                  fontFamily: 'Poppins', fontWeight: 900,
                  fontSize: '3.4rem', lineHeight: 1.05,
                  margin: 0, letterSpacing: '-0.03em',
                }}>
                  {language === 'en' ? (
                    <>
                      <span style={{ color: '#F8FAFC', display: 'block' }}>Need Food</span>
                      <span style={{ color: '#EF4444', display: 'block', textShadow: '0 0 20px rgba(239, 68, 68, 0.25)' }}>Urgently?</span>
                    </>
                  ) : (
                    <span style={{ color: '#EF4444', display: 'block', fontSize: '2.8rem', textShadow: '0 0 20px rgba(239, 68, 68, 0.25)' }}>{t('sosTitle')}</span>
                  )}
                </h2>

                {/* Accent underline */}
                <div style={{
                  width: '68px', height: '3px',
                  background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 100%)',
                  borderRadius: '9999px',
                  margin: '14px 0 22px',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                }}></div>

                {/* Description */}
                <p style={{
                  color: '#94A3B8', fontSize: '0.97rem',
                  lineHeight: 1.8, fontWeight: 400,
                  marginBottom: '28px', maxWidth: '410px',
                }}>
                  {t('sosSub')}
                </p>

                {/* SOS Explanation Card */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1.5px dashed rgba(239, 68, 68, 0.25)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  maxWidth: '380px',
                }}>
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '50%',
                    border: '1.5px dashed #EF4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    background: 'rgba(239, 68, 68, 0.1)',
                    fontFamily: 'Poppins', fontWeight: 900,
                    color: '#EF4444', fontSize: '0.82rem',
                    letterSpacing: '-0.02em',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
                  }}>SOS</div>
                  <div>
                    <p style={{
                      fontFamily: 'Poppins', fontWeight: 700,
                      fontSize: '0.9rem', color: '#F1F5F9',
                      marginBottom: '3px',
                    }}>
                      {t('sosExplainTitle')}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 400 }}>
                      {t('sosExplainSub')}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => scrollTo('request')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '12px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white', height: '56px', padding: '0 32px',
                    fontSize: '1rem', fontWeight: 700, fontFamily: 'Poppins',
                    borderRadius: '16px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(239,68,68,0.4), 0 0 15px rgba(239,68,68,0.2)',
                    transition: 'transform 0.22s, box-shadow 0.22s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(239,68,68,0.5), 0 0 25px rgba(239,68,68,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.4), 0 0 15px rgba(239,68,68,0.2)';
                  }}
                >
                  {t('btnSOS')} &nbsp; ➔
                </button>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>

                {/* Image Container masked as a perfect circle */}
                <div style={{
                  position: 'relative',
                  width: '340px',
                  height: '340px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: '#FDE8E8', // fallback
                }}>
                  <img
                    src={new URL('../assets/clean-sos.png', import.meta.url).href}
                    alt="SOS Emergency Food Help"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>

                {/* Floating Arrival Card */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center', gap: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  zIndex: 2,
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: '#FEF2F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#B91C1C">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.65rem', color: '#9CA3AF',
                      fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.08em', margin: '0 0 2px 0',
                    }}>{t('nearestHelpTitle') || 'NEAREST HELP ON THE WAY'}</p>
                    <p style={{
                      fontFamily: 'Poppins', fontWeight: 700,
                      fontSize: '0.92rem', color: '#111827', margin: 0,
                    }}>
                      {t('estArrival') || 'Estimated Arrival'} <span style={{ color: '#B91C1C', fontWeight: 800 }}>{t('arrivalMins') || '18 mins'}</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* ── Four Feature Cards ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '32px',
              marginTop: '12px',
            }}>
              {[
                { icon: '🛡️', iconBg: 'rgba(34, 197, 94, 0.15)', iconBorder: 'rgba(34, 197, 94, 0.3)', title: t('sosFeature1Title'), desc: t('sosFeature1Desc') },
                { icon: '📍', iconBg: 'rgba(234, 179, 8, 0.15)', iconBorder: 'rgba(234, 179, 8, 0.3)', title: t('sosFeature2Title'), desc: t('sosFeature2Desc') },
                { icon: '👥', iconBg: 'rgba(59, 130, 246, 0.15)', iconBorder: 'rgba(59, 130, 246, 0.3)', title: t('sosFeature3Title'), desc: t('sosFeature3Desc') },
                { icon: '❤️', iconBg: 'rgba(244, 63, 94, 0.15)', iconBorder: 'rgba(244, 63, 94, 0.3)', title: t('sosFeature4Title'), desc: t('sosFeature4Desc') },
              ].map((f, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  padding: '20px 18px',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.3), 0 0 15px rgba(239,68,68,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    borderRadius: '12px',
                    background: f.iconBg,
                    border: `1.5px solid ${f.iconBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>{f.icon}</div>
                  <div>
                    <p style={{
                      fontFamily: 'Poppins', fontWeight: 700,
                      fontSize: '0.87rem', color: '#F8FAFC', marginBottom: '5px',
                    }}>{f.title}</p>
                    <p style={{ fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.5, fontWeight: 400 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <p style={{
              textAlign: 'center', marginTop: '28px',
              fontSize: '0.92rem', color: '#94A3B8', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              <span style={{ color: '#22C55E', fontSize: '1rem' }}>💚</span>
              {t('sosTagline')}
            </p>

          </div>

        </div>
      </section>

      {/* Interactive Modal Overlay */}
      {activeModal && (
        <div className="home-modal-overlay" onClick={() => !isSubmitting && setActiveModal(null)}>
          <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="home-modal-close" onClick={() => setActiveModal(null)} disabled={isSubmitting}>×</button>

            {!modalSuccess ? (
              <div>
                <h3 className="home-modal-title">Confirm Action</h3>
                <p className="home-modal-intro">Would you like to accept and register for this task?</p>
                <div className="home-modal-details">
                  <div className="detail-row">
                    <span className="detail-label">Task Type:</span>
                    <span className="detail-val badge badge-green">{activeModal.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Task Info:</span>
                    <span className="detail-val" style={{ fontWeight: 700 }}>{activeModal.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-val">📍 {activeModal.location}</span>
                  </div>
                </div>
                <div className="home-modal-btns">
                  <button className="btn btn-secondary" onClick={() => setActiveModal(null)} disabled={isSubmitting}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      setModalSuccess(true);
                    }, 1200);
                  }} disabled={isSubmitting}>
                    {isSubmitting ? 'Confirming...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div className="success-checkmark-circle">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="checkmark-success-svg">
                    <path d="M20 6 L9 17 L4 12" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="home-modal-title" style={{ color: '#16A34A', marginTop: '16px' }}>Task Confirmed!</h3>
                <p style={{ color: 'var(--text-soft)', marginBottom: '24px', fontSize: '0.95rem' }}>
                  {activeModal.type === 'Fulfill Request'
                    ? 'Request successfully assigned! Hope Shelter has been notified of your fulfillment.'
                    : 'Pickup accepted! Task added to your active list. Live GPS routing is ready.'}
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                  const target = activeModal.target;
                  setActiveModal(null);
                  setTimeout(() => scrollTo(target), 200);
                }}>
                  {activeModal.type === 'Fulfill Request' ? 'Go to Donation Form' : 'Go to Fleet Portal'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NGO REGISTRATION MODAL ──────────────────────────────── */}
      {showNGOModal && (
        <div onClick={() => !ngoSubmitting && setShowNGOModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', position: 'relative' }}>

            {/* Close */}
            <button onClick={() => setShowNGOModal(false)} style={{ position: 'absolute', top: '16px', right: '20px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.2rem', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>

            <div style={{ padding: '32px 32px 28px' }}>
              {!ngoSuccess ? (
                <>
                  {/* Header */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '10px' }}>🏛️ NGO REGISTRATION — TAMIL NADU</div>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: '#0F172A', marginBottom: '6px' }}>Register Your NGO</h2>
                    <p style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.6 }}>Join our verified network of food distribution partners across Tamil Nadu. Fill in your organisation details below.</p>
                  </div>

                  {/* Form Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Row 1 */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Organisation Name <span style={{ color: '#DC2626' }}>*</span></label>
                      <input name="orgName" value={ngoForm.orgName} onChange={handleNgoChange} placeholder="e.g. Akshaya Trust, No Food Waste" style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.9rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    {/* Row 2 - Type + Reg No */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Organisation Type</label>
                        <select name="type" value={ngoForm.type} onChange={handleNgoChange} style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box' }}>
                          <option value="">Select type...</option>
                          <option>Registered Trust</option>
                          <option>Society (Societies Act)</option>
                          <option>Section 8 Company</option>
                          <option>Charitable Institution</option>
                          <option>Volunteer Group</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Registration Number</label>
                        <input name="regNo" value={ngoForm.regNo} onChange={handleNgoChange} placeholder="Trust/Society/MCA reg. no." style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* Row 3 - City + District */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>City <span style={{ color: '#DC2626' }}>*</span></label>
                        <select name="city" value={ngoForm.city} onChange={handleNgoChange} style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box' }}>
                          <option value="">Select city...</option>
                          <option>Chennai</option>
                          <option>Coimbatore</option>
                          <option>Madurai</option>
                          <option>Trichy</option>
                          <option>Salem</option>
                          <option>Tirunelveli</option>
                          <option>Erode</option>
                          <option>Vellore</option>
                          <option>Thoothukudi</option>
                          <option>Dindigul</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>District</label>
                        <input name="district" value={ngoForm.district} onChange={handleNgoChange} placeholder="e.g. Madurai District" style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Registered Office Address</label>
                      <textarea name="address" value={ngoForm.address} onChange={handleNgoChange} rows={2} placeholder="Door no., Street, Area, City, PIN code" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    {/* Row 4 - Phone + Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Phone <span style={{ color: '#DC2626' }}>*</span></label>
                        <input name="phone" value={ngoForm.phone} onChange={handleNgoChange} placeholder="+91 XXXXX XXXXX" style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Email Address <span style={{ color: '#DC2626' }}>*</span></label>
                        <input name="email" value={ngoForm.email} onChange={handleNgoChange} type="email" placeholder="contact@yourorg.org" style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* Row 5 - Website + Focus */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Website (optional)</label>
                        <input name="website" value={ngoForm.website} onChange={handleNgoChange} placeholder="https://yourorg.org" style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: '6px' }}>Primary Focus Area</label>
                        <select name="focus" value={ngoForm.focus} onChange={handleNgoChange} style={{ width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Inter', fontSize: '0.88rem', color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box' }}>
                          <option value="">Select focus...</option>
                          <option>Food rescue & redistribution</option>
                          <option>Elderly care & shelters</option>
                          <option>Children & orphanages</option>
                          <option>Homeless & street community</option>
                          <option>Disaster relief</option>
                          <option>Rural communities</option>
                          <option>Women & migrants</option>
                          <option>School meal programs</option>
                        </select>
                      </div>
                    </div>

                    {/* Validation note */}
                    {(!ngoForm.orgName || !ngoForm.city || !ngoForm.phone || !ngoForm.email) && (
                      <p style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, margin: 0 }}>* Fields marked with red are required to submit.</p>
                    )}

                    {/* Submit */}
                    <button onClick={handleNgoSubmit} disabled={ngoSubmitting || !ngoForm.orgName || !ngoForm.city || !ngoForm.phone || !ngoForm.email} style={{ width: '100%', height: '50px', background: ngoSubmitting ? '#D1FAE5' : 'linear-gradient(135deg, #16A34A, #22C55E)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', cursor: ngoSubmitting ? 'not-allowed' : 'pointer', marginTop: '4px', transition: 'all 0.3s', opacity: (!ngoForm.orgName || !ngoForm.city || !ngoForm.phone || !ngoForm.email) ? 0.5 : 1 }}>
                      {ngoSubmitting ? '⏳ Submitting Application...' : '🏛️ Submit NGO Registration'}
                    </button>
                  </div>
                </>
              ) : (
                /* Success Screen */
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: '72px', height: '72px', background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>✅</div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: '#15803D', marginBottom: '8px' }}>Registration Submitted!</h3>
                  <p style={{ color: '#374151', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    Thank you, <strong style={{ color: '#0F172A' }}>{ngoForm.orgName}</strong>!<br />
                    Your NGO registration for <strong style={{ color: '#0F172A' }}>{ngoForm.city}</strong> has been received.<br />
                    Our team will verify your details and contact you at <strong style={{ color: '#15803D' }}>{ngoForm.email}</strong> within 2–3 business days.
                  </p>
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', textAlign: 'left' }}>
                    {[
                      ['Organisation', ngoForm.orgName],
                      ['City', ngoForm.city],
                      ['Phone', ngoForm.phone],
                      ['Email', ngoForm.email],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0', borderBottom: '1px solid #D1FAE5' }}>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{k}</span>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowNGOModal(false)} style={{ width: '100%', height: '46px', background: 'linear-gradient(135deg, #16A34A, #22C55E)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
