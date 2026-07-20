import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Upload, MapPin, Award, User, Clock, Check, AlertCircle, FileText, ChevronRight, Lock } from 'lucide-react';
import { api } from '../services/api';

const JoinVolunteer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Steps
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // API States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    personalInfo: { fullName: '', dob: '', gender: '', email: '', phone: '', gpsLocation: null },
    address: { state: 'Tamil Nadu', district: '', taluk: '', village: '', pincode: '', fullAddress: '' },
    volunteerDetails: { categories: [], availability: [], skills: [], languages: '', vehicleAvailable: false, drivingLicense: false, previousExperience: '' },
    emergencyContact: { name: '', phone: '' },
    agreements: { rules: false }
  });

  const [files, setFiles] = useState({ aadhaar: null, profilePhoto: null });
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown > 0) timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let poller;
    if (emailSent && !emailVerified && formData.personalInfo.email) {
      poller = setInterval(async () => {
        try {
          const res = await api.checkEmailVerification(formData.personalInfo.email);
          if (res.verified) {
            setEmailVerified(true);
            clearInterval(poller);
          }
        } catch (err) {}
      }, 3000);
    }
    return () => clearInterval(poller);
  }, [emailSent, emailVerified, formData.personalInfo.email]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const toggleArray = (section, field, value) => {
    setFormData(prev => {
      const arr = prev[section][field];
      const newArr = arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value];
      return { ...prev, [section]: { ...prev[section], [field]: newArr } };
    });
  };

  const captureGPS = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleChange('personalInfo', 'gpsLocation', { lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        (err) => {
          console.warn(err);
          setLoading(false);
        }
      );
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!formData.personalInfo.email) return setError("Please enter an email address.");
    try {
      setEmailLoading(true); setError('');
      await api.sendEmailVerification(formData.personalInfo.email, formData.personalInfo.fullName);
      setEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!formData.personalInfo.phone || formData.personalInfo.phone.length < 10) return setError("Please enter a valid 10-digit mobile number.");
    try {
      setLoading(true); setError('');
      await api.sendOTP(formData.personalInfo.phone);
      setOtpSent(true); setCountdown(60); setOtpCode(['','','','','','']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError('');
      await api.verifyOTP(formData.personalInfo.phone, otpCode.join(''));
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.personalInfo.fullName || !formData.personalInfo.dob || !formData.personalInfo.gender) {
        return setError("Please fill all mandatory personal fields.");
      }
      if (!emailVerified) return setError("Email must be verified before proceeding.");
      if (!otpVerified) return setError("Mobile number must be verified before proceeding.");
    }
    if (step === 2) {
      if (!formData.address.district || !formData.address.taluk || !formData.address.village || !formData.address.pincode || !formData.address.fullAddress) {
        return setError("Please fill all address fields.");
      }
    }
    if (step === 3) {
      if (!files.aadhaar || !files.profilePhoto) return setError("Please upload required documents.");
      if (!formData.emergencyContact.name || !formData.emergencyContact.phone) return setError("Emergency contact is required.");
    }
    if (step === 4) {
      if (formData.volunteerDetails.categories.length === 0) return setError("Please select at least one volunteer category.");
      if (formData.volunteerDetails.availability.length === 0) return setError("Please select your availability.");
    }

    setStep(s => Math.min(totalSteps, s + 1));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreements.rules) return setError("You must agree to the volunteer terms and privacy policy.");
    try {
      setLoading(true); setError('');
      const payload = {
        personalInfo: {
          fullName: formData.personalInfo.fullName,
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone,
          address: `${formData.address.fullAddress}, ${formData.address.village}, ${formData.address.taluk}, ${formData.address.district}, ${formData.address.state} - ${formData.address.pincode}`,
          district: formData.address.district,
          taluk: formData.address.taluk,
          gpsLocation: formData.personalInfo.gpsLocation
        },
        volunteerDetails: {
          types: formData.volunteerDetails.categories,
          skills: formData.volunteerDetails.skills,
          languages: formData.volunteerDetails.languages,
          vehicleAvailable: formData.volunteerDetails.vehicleAvailable,
          drivingLicense: formData.volunteerDetails.drivingLicense,
          previousExperience: formData.volunteerDetails.previousExperience,
          availability: formData.volunteerDetails.availability.join(', ')
        }
      };

      const res = await api.registerVolunteer(payload);
      setSuccessData(res);
      window.scrollTo(0,0);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', padding: '40px' }}>
        <div style={{ background: 'white', padding: '60px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#DCFCE7', borderRadius: '50%', marginBottom: '24px' }}>
            <CheckCircle size={56} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins, sans-serif' }}>Application Submitted</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '32px' }}>
            Successfully received! Your volunteer application is now pending NGO approval.
          </p>
          
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Volunteer ID</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{successData.volunteerId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Assigned NGO</span>
              <span style={{ fontWeight: 700, color: '#16A34A' }}>{successData.nearestNgo || 'Processing...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Assigned District</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{formData.address.district}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Application Status</span>
              <span style={{ fontWeight: 600, color: '#EAB308', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> Pending Approval</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Est. Approval Time</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>24 - 48 Hours</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ flex: 1, background: 'white', color: '#0f172a', border: '1px solid #CBD5E1', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', transition: '0.2s' }}>
              Go to Homepage
            </button>
            <button onClick={() => navigate('/volunteer')} style={{ flex: 1, background: '#0f172a', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', transition: '0.2s' }}>
              Track Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ['Personal Info', 'Address Details', 'Identity Verification', 'Skills & Availability', 'Review & Submit'];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── HEADER & PROGRESS ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '32px 48px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', margin: '0 0 24px', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Volunteer Onboarding</h1>
          
          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', background: '#E2E8F0', zIndex: 1 }}></div>
            <div style={{ position: 'absolute', top: '16px', left: '10%', width: `${((step - 1) / (totalSteps - 1)) * 80}%`, height: '3px', background: '#16A34A', zIndex: 1, transition: 'width 0.4s ease' }}></div>
            
            {stepTitles.map((title, i) => {
              const num = i + 1;
              const isActive = step === num;
              const isCompleted = step > num;
              const isLocked = step < num;
              
              return (
                <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, width: '20%' }}>
                  <div style={{ 
                    width: '34px', height: '34px', borderRadius: '50%', 
                    background: isCompleted ? '#16A34A' : isActive ? '#16A34A' : '#F1F5F9',
                    border: `2px solid ${isActive || isCompleted ? '#16A34A' : '#E2E8F0'}`,
                    color: isActive || isCompleted ? 'white' : '#94A3B8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700,
                    transition: 'all 0.3s'
                  }}>
                    {isCompleted ? <Check size={18} /> : isLocked ? <Lock size={14} /> : num}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#64748B', textAlign: 'center' }}>{title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 24px' }}>
        
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, marginBottom: '24px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="fade-in">
              <h3 style={sectionTitleStyle}>Step 1: Personal Information</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>Please provide your accurate details. Verification is mandatory for security purposes.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <Input label="Full Name (As per ID)" value={formData.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} required />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <Input label="Date of Birth" type="date" value={formData.personalInfo.dob} onChange={e => handleChange('personalInfo', 'dob', e.target.value)} required />
                  <div>
                    <label style={labelStyle}>Gender *</label>
                    <select style={inputStyle} value={formData.personalInfo.gender} onChange={e => handleChange('personalInfo', 'gender', e.target.value)} required>
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Email Verification Box */}
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={labelStyle}>Email Address *</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="email" style={{...inputStyle, flex: 1}} value={formData.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} disabled={emailVerified} required placeholder="you@example.com" />
                    {!emailVerified ? (
                      <button onClick={sendEmail} disabled={emailLoading} style={actionBtnStyle}>
                        {emailLoading ? 'Sending...' : emailSent ? 'Resend Link' : 'Send Verification'}
                      </button>
                    ) : (
                      <div style={verifiedBadgeStyle}><CheckCircle size={18} /> Verified</div>
                    )}
                  </div>
                  {emailSent && !emailVerified && <p style={{ margin: '10px 0 0', fontSize: '0.85rem', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> We sent a verification link to your email. Click it to verify.</p>}
                </div>

                {/* Mobile Verification Box */}
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={labelStyle}>Mobile Number *</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0 12px', borderRadius: '6px', color: '#475569', fontWeight: 600 }}>+91</div>
                    <input type="tel" maxLength="10" style={{...inputStyle, flex: 1}} value={formData.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value.replace(/\D/g, ''))} disabled={otpVerified} required placeholder="9876543210" />
                    {!otpVerified ? (
                      <button onClick={sendOTP} disabled={loading || countdown > 0} style={actionBtnStyle}>
                        {loading ? 'Sending...' : otpSent ? (countdown > 0 ? `Wait ${countdown}s` : 'Resend OTP') : 'Send OTP'}
                      </button>
                    ) : (
                      <div style={verifiedBadgeStyle}><CheckCircle size={18} /> Verified</div>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div style={{ marginTop: '16px', borderTop: '1px dashed #CBD5E1', paddingTop: '16px' }}>
                      <label style={labelStyle}>Enter 6-digit OTP sent to your mobile</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" maxLength="6" style={{...inputStyle, flex: 1, letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center', fontWeight: 700}} value={otpCode.join('')} onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').split('');
                          const newOtp = [...otpCode];
                          for (let i = 0; i < 6; i++) newOtp[i] = val[i] || '';
                          setOtpCode(newOtp);
                        }} placeholder="------" />
                        <button onClick={verifyOTP} disabled={loading || otpCode.join('').length < 6} style={{ ...actionBtnStyle, background: '#0f172a', color: 'white', border: 'none' }}>Verify OTP</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {step === 2 && (
            <div className="fade-in">
              <h3 style={sectionTitleStyle}>Step 2: Address Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input label="State" value={formData.address.state} readOnly disabled />
                <Input label="District *" value={formData.address.district} onChange={e => handleChange('address', 'district', e.target.value)} required />
                <Input label="Taluk *" value={formData.address.taluk} onChange={e => handleChange('address', 'taluk', e.target.value)} required />
                <Input label="Village / City *" value={formData.address.village} onChange={e => handleChange('address', 'village', e.target.value)} required />
                <Input label="Pincode *" value={formData.address.pincode} onChange={e => handleChange('address', 'pincode', e.target.value)} required />
              </div>
              <div style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Full Address (House No, Street) *</label>
                <textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} value={formData.address.fullAddress} onChange={e => handleChange('address', 'fullAddress', e.target.value)} required></textarea>
              </div>
              
              <div style={{ marginTop: '24px', padding: '20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>GPS Location (Optional)</p>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>{formData.personalInfo.gpsLocation ? `Lat: ${formData.personalInfo.gpsLocation.lat.toFixed(4)}, Lng: ${formData.personalInfo.gpsLocation.lng.toFixed(4)}` : 'Helps assign nearest NGO accurately.'}</p>
                </div>
                <button type="button" onClick={captureGPS} style={{ background: 'white', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F1F5F9'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                  <MapPin size={18} /> {formData.personalInfo.gpsLocation ? 'Update Location' : 'Capture Location'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Identity Verification */}
          {step === 3 && (
            <div className="fade-in">
              <h3 style={sectionTitleStyle}>Step 3: Identity Verification</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
                <FileUpload label="Upload Aadhaar / Govt ID *" file={files.aadhaar} onChange={e => setFiles({...files, aadhaar: e.target.files[0]})} />
                <FileUpload label="Upload Profile Photo *" file={files.profilePhoto} onChange={e => setFiles({...files, profilePhoto: e.target.files[0]})} />
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Emergency Contact</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input label="Contact Name *" value={formData.emergencyContact.name} onChange={e => handleChange('emergencyContact', 'name', e.target.value)} required />
                <Input label="Contact Number *" value={formData.emergencyContact.phone} onChange={e => handleChange('emergencyContact', 'phone', e.target.value)} required />
              </div>
            </div>
          )}

          {/* STEP 4: Skills & Availability */}
          {step === 4 && (
            <div className="fade-in">
              <h3 style={sectionTitleStyle}>Step 4: Skills & Availability</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Volunteer Category * (Select multiple)</label>
                <div style={checkboxGridStyle}>
                  {['Food Rescue', 'Education', 'Clothes Distribution', 'Medical Support', 'Disaster Relief'].map(cat => (
                    <Checkbox key={cat} label={cat} checked={formData.volunteerDetails.categories.includes(cat)} onChange={() => toggleArray('volunteerDetails', 'categories', cat)} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Availability *</label>
                <div style={checkboxGridStyle}>
                  {['Weekdays', 'Weekends', 'Full Time', 'Part Time'].map(av => (
                    <Checkbox key={av} label={av} checked={formData.volunteerDetails.availability.includes(av)} onChange={() => toggleArray('volunteerDetails', 'availability', av)} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <Input label="Languages Known" placeholder="English, Tamil, Hindi..." value={formData.volunteerDetails.languages} onChange={e => handleChange('volunteerDetails', 'languages', e.target.value)} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <Checkbox label="Own Vehicle Available" checked={formData.volunteerDetails.vehicleAvailable} onChange={e => handleChange('volunteerDetails', 'vehicleAvailable', e.target.checked)} />
                  <Checkbox label="Valid Driving License" checked={formData.volunteerDetails.drivingLicense} onChange={e => handleChange('volunteerDetails', 'drivingLicense', e.target.checked)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Previous Volunteer Experience</label>
                <textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} placeholder="Briefly describe any past experience..." value={formData.volunteerDetails.previousExperience} onChange={e => handleChange('volunteerDetails', 'previousExperience', e.target.value)}></textarea>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="fade-in">
              <h3 style={sectionTitleStyle}>Step 5: Review & Submit</h3>
              
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Personal Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <ReviewItem label="Name" value={formData.personalInfo.fullName} />
                  <ReviewItem label="Email" value={formData.personalInfo.email} />
                  <ReviewItem label="Phone" value={formData.personalInfo.phone} />
                  <ReviewItem label="DOB" value={formData.personalInfo.dob} />
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Address Details</h4>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>{formData.address.fullAddress}, {formData.address.village}, {formData.address.taluk}, {formData.address.district}, {formData.address.state} - {formData.address.pincode}</p>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Volunteer Preferences</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <ReviewItem label="Categories" value={formData.volunteerDetails.categories.join(', ')} />
                  <ReviewItem label="Availability" value={formData.volunteerDetails.availability.join(', ')} />
                  <ReviewItem label="Vehicle" value={formData.volunteerDetails.vehicleAvailable ? 'Yes' : 'No'} />
                </div>
              </div>

              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '2px' }} checked={formData.agreements.rules} onChange={e => handleChange('agreements', 'rules', e.target.checked)} />
                  <div>
                    <span style={{ fontSize: '0.95rem', color: '#92400E', fontWeight: 600 }}>I agree to the volunteer terms and privacy policy.</span>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#B45309' }}>I confirm that the information provided is accurate and I am willing to serve the community in times of need.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ── NAVIGATION BUTTONS ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
            {step > 1 ? (
              <button type="button" onClick={handleBack} style={{ background: 'white', border: '1px solid #CBD5E1', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer', fontSize: '0.95rem', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F8FAFC'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                Back
              </button>
            ) : <div></div>}
            
            {step < totalSteps ? (
              <button type="button" onClick={handleNext} disabled={(step === 1 && (!emailVerified || !otpVerified))} style={{ background: (step === 1 && (!emailVerified || !otpVerified)) ? '#94A3B8' : '#0f172a', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: (step === 1 && (!emailVerified || !otpVerified)) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading || !formData.agreements.rules} style={{ background: (!formData.agreements.rules) ? '#94A3B8' : '#16A34A', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: (!formData.agreements.rules) ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.2)' }}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>

        </div>
      </div>
      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// ── Shared UI Components ──
const sectionTitleStyle = { fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', fontFamily: 'Poppins, sans-serif' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: 'white', color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const actionBtnStyle = { background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0 16px', borderRadius: '8px', fontWeight: 600, color: '#0f172a', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', transition: '0.2s' };
const verifiedBadgeStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', background: '#DCFCE7', color: '#16A34A', fontWeight: 600, borderRadius: '8px', fontSize: '0.9rem' };
const checkboxGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' };

const Input = ({ label, type = "text", value, onChange, readOnly, disabled, required, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={onChange} readOnly={readOnly} disabled={disabled} required={required} placeholder={placeholder} style={{...inputStyle, background: disabled ? '#F8FAFC' : 'white'}} />
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', background: checked ? '#F0FDF4' : 'white', border: `1px solid ${checked ? '#86EFAC' : '#E2E8F0'}`, padding: '12px', borderRadius: '8px', transition: '0.2s' }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ cursor: 'pointer', width: '18px', height: '18px', marginTop: '2px' }} />
    <span style={{ fontSize: '0.95rem', color: checked ? '#166534' : '#334155', fontWeight: checked ? 600 : 500 }}>{label}</span>
  </label>
);

const FileUpload = ({ label, file, onChange }) => (
  <div style={{ border: '2px dashed #CBD5E1', padding: '24px', borderRadius: '12px', textAlign: 'center', background: '#F8FAFC', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#94A3B8'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'}>
    <p style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{label}</p>
    <label style={{ background: 'white', border: '1px solid #CBD5E1', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'inline-block', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F1F5F9'} onMouseOut={e=>e.currentTarget.style.background='white'}>
      <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Browse File
      <input type="file" style={{ display: 'none' }} onChange={onChange} />
    </label>
    {file && <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle size={16}/> {file.name}</p>}
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{value || '-'}</span>
  </div>
);

export default JoinVolunteer;
