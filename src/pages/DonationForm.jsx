import React, { useState } from 'react';
import { Upload, Mic, Camera, MapPin, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import requestBg from '../assets/request-bg.png';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const DonationForm = () => {
  const { t } = useLanguage();
  const { submitDonation } = useApp();

  const [step, setStep] = useState(1);
  const [foodTitle, setFoodTitle] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('Portions');
  const [prepTime, setPrepTime] = useState('14:00');
  const [bestBefore, setBestBefore] = useState('20:00');
  const [storage, setStorage] = useState('Hot / Warm');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [windowTime, setWindowTime] = useState('Next 2 Hours');
  const [photo, setPhoto] = useState(null);
  const [packaging, setPackaging] = useState('Packed in individual boxes');
  const [submittedDonationId, setSubmittedDonationId] = useState(null);

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const steps = [
    { num: 1, label: t('dfStep1') || 'Food Info' },
    { num: 2, label: t('dfStep2') || 'Freshness' },
    { num: 3, label: t('dfStep3') || 'Pickup' },
    { num: 4, label: t('dfStep4') || 'Packaging' },
    { num: 5, label: t('dfStep5') || 'Review' }
  ];

  const estimatedPeople = qty ? Math.floor(parseInt(qty) * (unit === 'kg' ? 2.5 : 1)) : 0;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleConfirmDispatch = () => {
    const donationId = submitDonation({
      donor: 'Self (Donor)',
      foodTitle: foodTitle || 'Wedding Meals',
      qty: qty || '20',
      unit: unit,
      category,
      prepTime,
      bestBefore,
      storage,
      address: address || 'Anna Nagar, Chennai',
      contact: contact || '+91 98765 43210',
      window: windowTime,
      packaging,
      ngo: 'Hope Shelter'
    });
    setSubmittedDonationId(donationId);
  };

  const handleResetForm = () => {
    setFoodTitle('');
    setCategory('Cooked Meals');
    setQty('');
    setUnit('Portions');
    setPrepTime('14:00');
    setBestBefore('20:00');
    setStorage('Hot / Warm');
    setAddress('');
    setContact('');
    setWindowTime('Next 2 Hours');
    setPhoto(null);
    setPackaging('Packed in individual boxes');
    setSubmittedDonationId(null);
    setStep(1);
  };

  if (submittedDonationId) {
    return (
      <div className="screen-fit-section" style={{ background: `url(${requestBg}) no-repeat center center`, backgroundSize: 'cover' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div className="success-checkmark-circle" style={{ margin: '0 auto 24px', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%' }}>
              <CheckCircle size={36} color="var(--green-primary)" />
            </div>
            <h3 style={{ fontFamily: 'Poppins', fontSize: '1.8rem', fontWeight: 800, color: 'var(--green-deep)', marginBottom: '12px' }}>Surplus Dispatched!</h3>
            <p style={{ color: 'var(--text-soft)', marginBottom: '24px' }}>
              Your donation <strong>{submittedDonationId}</strong> has been listed. Nearby NGOs and volunteers have been notified.
            </p>
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '4px' }}>Food details:</p>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{foodTitle || 'Wedding Meals'} ({qty || '20'} {unit})</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '8px' }}>📍 Pickup: {address || 'Anna Nagar, Chennai'}</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleResetForm}>Donate More</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => scrollTo('donor-dashboard')}>Track Progress</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-fit-section" style={{ background: `url(${requestBg}) no-repeat center center`, backgroundSize: 'cover' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div className="section-tag">📦 List Surplus</div>
          <h2 className="section-title">{t('formTitle') || 'Rescue Your Food'}</h2>
          <p className="section-sub">Join thousands of donors fighting hunger. It takes just 2 minutes to list your surplus.</p>
        </div>

        {/* Stepper */}
        <div className="stepper-container">
          {steps.map(s => (
            <div key={s.num} className={`stepper-step ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
              <div className="stepper-circle">{step > s.num ? '✓' : s.num}</div>
              <span className="stepper-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="card" style={{ padding: '40px' }}>
          {step === 1 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>{t('dfWhatDonating') || 'What are you donating?'}</h3>
              
              <div className="form-group">
                <label className="form-label">Food Title <span style={{ color: 'var(--red-sos)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Leftover Wedding Meals (Rice & Curry)"
                  value={foodTitle}
                  onChange={e => setFoodTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('dfCategory') || 'Category'}</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Cooked Meals">{t('dfCookedMeals') || 'Cooked Meals'}</option>
                    <option value="Raw Ingredients">{t('dfRawIngredients') || 'Raw Ingredients'}</option>
                    <option value="Baked Goods">{t('dfBakedGoods') || 'Baked Goods / Bread'}</option>
                    <option value="Packaged Food">{t('dfPackagedFood') || 'Packaged Food'}</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('dfQuantity') || 'Quantity'}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" className="form-input" style={{ flex: 2 }} placeholder="e.g. 20" value={qty} onChange={e => setQty(e.target.value)} />
                    <select className="form-input" style={{ flex: 1, padding: '0 12px' }} value={unit} onChange={e => setUnit(e.target.value)}>
                      <option value="Portions">Portions</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>

              {qty && parseInt(qty) > 0 && (
                <div style={{ background: 'var(--green-mint)', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.5rem' }}>❤️</div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--green-deep)' }}>{t('dfEstImpact') || 'Estimated Impact'}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--green-primary)', fontWeight: 600 }}>This donation can serve approximately {estimatedPeople} people.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>{t('dfFreshness') || 'Freshness & Quality'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('dfTimePrep') || 'Time Prepared'}</label>
                  <input type="time" className="form-input" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('dfBestBefore') || 'Best Before'}</label>
                  <input type="time" className="form-input" value={bestBefore} onChange={e => setBestBefore(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('dfStorage') || 'Current Storage Condition'}</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm ${storage === 'Hot / Warm' ? 'active' : ''}`}
                    style={storage === 'Hot / Warm' ? { flex: 1 } : { flex: 1, borderColor: 'var(--border)', color: 'var(--text-soft)', background: '#F8FAFC' }}
                    onClick={() => setStorage('Hot / Warm')}
                  >
                    {t('dfHotWarm') || 'Hot / Warm'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm ${storage === 'Room Temp' ? 'active' : ''}`}
                    style={storage === 'Room Temp' ? { flex: 1 } : { flex: 1, borderColor: 'var(--border)', color: 'var(--text-soft)', background: '#F8FAFC' }}
                    onClick={() => setStorage('Room Temp')}
                  >
                    {t('dfRoomTemp') || 'Room Temp'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm ${storage === 'Refrigerated' ? 'active' : ''}`}
                    style={storage === 'Refrigerated' ? { flex: 1 } : { flex: 1, borderColor: 'var(--border)', color: 'var(--text-soft)', background: '#F8FAFC' }}
                    onClick={() => setStorage('Refrigerated')}
                  >
                    {t('dfRefrigerated') || 'Refrigerated'}
                  </button>
                </div>
              </div>

              <div style={{ background: '#FFF7ED', border: '1px solid var(--orange-light)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle color="var(--orange)" size={20} style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>{t('dfPriorityRec') || 'Priority Pickup Recommended'}</p>
                  <p style={{ fontSize: '0.8rem', color: '#C2410C', marginTop: '4px' }}>Cooked meals kept warm should be distributed within 4 hours of preparation.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>{t('dfPickupDetails') || 'Pickup Details'}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('dfPickupAddress') || 'Pickup Address'}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search address..."
                    style={{ paddingLeft: '40px' }}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                  <MapPin size={18} color="var(--text-soft)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
                </div>
                <div style={{ height: '120px', background: '#E2E8F0', borderRadius: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 600 }}>
                    🗺️ Location Preview: {address || 'Anna Nagar, Chennai'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">{t('dfContactNumber') || 'Contact Number'}</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('dfAvailableWindow') || 'Available Window'}</label>
                  <select
                    className="form-input"
                    value={windowTime}
                    onChange={e => setWindowTime(e.target.value)}
                  >
                    <option value="Next 1 Hour">Next 1 Hour</option>
                    <option value="Next 2 Hours">Next 2 Hours</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fade-in">
              <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>{t('dfPackagingProof') || 'Packaging & Proof'}</h3>
              
              <div className="form-group">
                <label className="form-label">Food Photo (For AI Quality Check)</label>
                <div
                  style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer', transition: 'var(--transition)' }}
                  onClick={() => setPhoto('uploaded')}
                >
                  {photo ? (
                    <div>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle size={28} color="var(--green-primary)" />
                      </div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>Photo Uploaded Successfully!</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--green-primary)', marginTop: '6px' }}>Verified with AI Freshness check.</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)' }}>
                        <Camera size={24} color="var(--green-primary)" />
                      </div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>Click to upload food photo</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '6px' }}>Show packaging clearly for faster NGO approval.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('dfPackagingType') || 'Packaging Type'}</label>
                <select
                  className="form-input"
                  value={packaging}
                  onChange={e => setPackaging(e.target.value)}
                >
                  <option value="Packed in individual boxes">Packed in individual boxes</option>
                  <option value="Bulk containers (needs serving)">Bulk containers (needs serving)</option>
                  <option value="Loose / requires packaging">Loose / requires packaging</option>
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={32} color="var(--green-primary)" />
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.6rem', fontWeight: 800 }}>{t('dfReadyRescue') || 'Ready to Rescue!'}</h3>
                <p style={{ color: 'var(--text-soft)' }}>{t('dfReviewDetails') || 'Review your details before dispatching to our network.'}</p>
              </div>
              
              <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{t('dfFoodType') || 'Food Type'}</span>
                  <span style={{ fontWeight: 600 }}>{foodTitle || 'Surplus Meals'} ({category})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Quantity</span>
                  <span style={{ fontWeight: 600 }}>{qty || '20'} {unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{t('dfPickupArea') || 'Pickup Area'}</span>
                  <span style={{ fontWeight: 600 }}>{address || 'Anna Nagar, Chennai'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{t('dfEstImpact') || 'Estimated Impact'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--green-primary)' }}>~{estimatedPeople || 50} Meals Rescued</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--blue-soft)', padding: '16px', borderRadius: '12px', color: '#1E40AF', fontSize: '0.85rem', marginBottom: '24px' }}>
                <AlertCircle size={20} />
                <span>{t('dfConfirmSafe') || 'By submitting, you confirm the food is safe for human consumption and was handled safely.'}</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            {step > 1 ? (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>{t('dfBack') || 'Back'}</button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>{t('dfNextStep') || 'Next Step '}{' '}<ArrowRight size={18} /></button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleConfirmDispatch}>{t('dfConfirmDispatch') || 'Confirm & Dispatch'}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
