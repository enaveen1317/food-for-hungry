import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Upload, CheckCircle, ChevronRight, ChevronLeft, Shield, AlertCircle, Smartphone, Mail, Activity, Eye } from 'lucide-react';
import { api } from '../../services/api';

const RegistrationWizard = ({ onCancel }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 9;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States for APIs
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    personalInfo: { fullName: '', dob: '', gender: '', phone: '', email: '', gpsLocation: null },
    address: { district: '', taluk: '', village: '', pincode: '' },
    volunteerDetails: { types: [], skills: [], languages: '', occupation: '', experience: '', availableDays: '', availableTime: '', ownVehicle: 'No', vehicleType: '', licenseNumber: '' },
    emergencyContact: { name: '', relationship: '', phone: '' },
    agreements: { guidelines: false, liveLocation: false, privacy: false }
  });

  const [files, setFiles] = useState({ profilePhoto: null, aadhaarDoc: null });
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown > 0) timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let timer;
    if (emailCountdown > 0) timer = setInterval(() => setEmailCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [emailCountdown]);

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

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleCheckboxToggle = (section, field, value) => {
    setFormData(prev => {
      const arr = prev[section][field] || [];
      const newArr = arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value];
      return { ...prev, [section]: { ...prev[section], [field]: newArr } };
    });
  };

  const captureGPS = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('personalInfo', 'gpsLocation', { lat: position.coords.latitude, lng: position.coords.longitude });
          setLoading(false);
        },
        (error) => {
          console.warn(error);
          setLoading(false);
        }
      );
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setEmailLoading(true);
      setError('');
      await api.sendEmailVerification(formData.personalInfo.email, formData.personalInfo.fullName);
      setEmailSent(true);
      setEmailCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      await api.sendOTP(formData.personalInfo.phone);
      setOtpSent(true);
      setCountdown(30);
      setOtpCode(['', '', '', '', '', '']); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const codeString = otpCode.join('');
      if (codeString.length !== 6) throw new Error("Please enter a 6-digit OTP");
      await api.verifyOTP(formData.personalInfo.phone, codeString);
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        personalInfo: {
          fullName: formData.personalInfo.fullName,
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone,
          address: `${formData.address.village}, ${formData.address.taluk}, ${formData.address.district} - ${formData.address.pincode}`,
          district: formData.address.district,
          taluk: formData.address.taluk,
          gpsLocation: formData.personalInfo.gpsLocation
        },
        volunteerDetails: formData.volunteerDetails
      };

      const response = await api.registerVolunteer(payload);
      setSuccessData(response);
      setStep(9);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError('');
    // Validations
    if (step === 1 && (!formData.personalInfo.fullName || !formData.personalInfo.dob || !formData.personalInfo.gender)) return setError('All fields required.');
    if (step === 2 && (!formData.address.district || !formData.address.village || !formData.address.pincode || !formData.personalInfo.gpsLocation)) return setError('Address and GPS Location required.');
    if (step === 3 && !emailVerified) return setError('Email verification required.');
    if (step === 4 && !otpVerified) return setError('Mobile verification required.');
    if (step === 5 && (formData.volunteerDetails.types.length === 0)) return setError('Select at least one volunteer type.');
    if (step === 6 && (!formData.emergencyContact.name || !formData.emergencyContact.phone)) return setError('Emergency contact required.');
    if (step === 7 && (!files.aadhaarDoc)) return setError('Please upload your ID document.');
    
    setStep(s => s + 1);
  };

  // ── Render Steps ──
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 1: Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Input label="Full Name *" value={formData.personalInfo.fullName} onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)} />
              <Input label="Date of Birth *" type="date" value={formData.personalInfo.dob} onChange={e => handleInputChange('personalInfo', 'dob', e.target.value)} />
              <div>
                <label style={labelStyle}>Gender *</label>
                <select style={inputStyle} value={formData.personalInfo.gender} onChange={e => handleInputChange('personalInfo', 'gender', e.target.value)}>
                  <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 2: Address & Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <Input label="District *" value={formData.address.district} onChange={e => handleInputChange('address', 'district', e.target.value)} />
              <Input label="Taluk" value={formData.address.taluk} onChange={e => handleInputChange('address', 'taluk', e.target.value)} />
              <Input label="Village / City *" value={formData.address.village} onChange={e => handleInputChange('address', 'village', e.target.value)} />
              <Input label="Pincode *" value={formData.address.pincode} onChange={e => handleInputChange('address', 'pincode', e.target.value)} />
            </div>
            <div style={{ background: '#ECFDF5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #A7F3D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#16A34A', padding: '10px', borderRadius: '50%' }}><MapPin size={20} color="white" /></div>
                <div>
                  <h5 style={{ fontWeight: 700, color: '#065F46', margin: 0 }}>Current GPS Location *</h5>
                  <p style={{ color: '#047857', margin: 0, fontSize: '0.85rem' }}>{formData.personalInfo.gpsLocation ? `Lat: ${formData.personalInfo.gpsLocation.lat.toFixed(4)}, Lng: ${formData.personalInfo.gpsLocation.lng.toFixed(4)}` : 'Required for NGO assignment'}</p>
                </div>
              </div>
              <button onClick={captureGPS} disabled={loading} style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
                {formData.personalInfo.gpsLocation ? 'Update Location' : 'Capture Location'}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 3: Email Verification</h3>
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <label style={labelStyle}>Email Address *</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{...inputStyle, flex: 1}} type="email" placeholder="example@email.com" value={formData.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} disabled={emailVerified} />
                {!emailVerified ? (
                  <button onClick={sendVerificationEmail} disabled={emailLoading || emailCountdown > 0} style={{ background: '#0a1628', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 600, cursor: 'pointer' }}>
                    {emailLoading ? 'Sending...' : (emailSent ? (emailCountdown > 0 ? `Wait ${emailCountdown}s` : 'Resend') : 'Send Link')}
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700, padding: '0 16px', background: '#DCFCE7', borderRadius: '10px' }}><CheckCircle size={20}/> Verified</div>
                )}
              </div>
              {emailSent && !emailVerified && <p style={{ fontSize: '0.85rem', color: '#0a1628', marginTop: '10px' }}>Verification email sent. Check your inbox and click the link to verify.</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 4: Mobile Verification</h3>
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <label style={labelStyle}>Mobile Number *</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input style={{...inputStyle, flex: 1}} type="tel" placeholder="10-digit number" maxLength="10" value={formData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', 'phone', e.target.value.replace(/\D/g, ''))} disabled={otpVerified} />
                {!otpVerified ? (
                  <button onClick={sendOTP} disabled={loading || countdown > 0} style={{ background: '#0a1628', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 600, cursor: 'pointer' }}>
                    {loading ? 'Wait...' : (otpSent ? (countdown > 0 ? `Wait ${countdown}s` : 'Resend') : 'Send OTP')}
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700, padding: '0 16px', background: '#DCFCE7', borderRadius: '10px' }}><CheckCircle size={20}/> Verified</div>
                )}
              </div>
              
              {otpSent && !otpVerified && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input style={{...inputStyle, flex: 1, letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center'}} type="text" maxLength="6" placeholder="------" value={otpCode.join('')} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').split('');
                    const newOtp = [...otpCode];
                    for (let i = 0; i < 6; i++) newOtp[i] = val[i] || '';
                    setOtpCode(newOtp);
                  }} />
                  <button onClick={verifyOTP} disabled={loading} style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 600, cursor: 'pointer' }}>Verify</button>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 5: Skills & Availability</h3>
            <label style={labelStyle}>Volunteer Type (Multiple) *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {['Food Rescue', 'Education Support', 'Clothes Distribution', 'Medical Support', 'Transport'].map(type => (
                <label key={type} style={{ padding: '10px 16px', background: formData.volunteerDetails.types.includes(type) ? '#DCFCE7' : '#F8FAFC', border: formData.volunteerDetails.types.includes(type) ? '1px solid #16A34A' : '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: formData.volunteerDetails.types.includes(type) ? '#16A34A' : '#475569' }}>
                  <input type="checkbox" checked={formData.volunteerDetails.types.includes(type)} onChange={() => handleCheckboxToggle('volunteerDetails', 'types', type)} style={{ display: 'none' }} />
                  {type}
                </label>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Input label="Languages Known" value={formData.volunteerDetails.languages} onChange={e => handleInputChange('volunteerDetails', 'languages', e.target.value)} />
              <div>
                <label style={labelStyle}>Own Vehicle?</label>
                <select style={inputStyle} value={formData.volunteerDetails.ownVehicle} onChange={e => handleInputChange('volunteerDetails', 'ownVehicle', e.target.value)}>
                  <option>No</option><option>Yes</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 6: Emergency Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <Input label="Contact Person Name *" value={formData.emergencyContact.name} onChange={e => handleInputChange('emergencyContact', 'name', e.target.value)} />
              <Input label="Relationship" value={formData.emergencyContact.relationship} onChange={e => handleInputChange('emergencyContact', 'relationship', e.target.value)} />
              <Input label="Phone Number *" value={formData.emergencyContact.phone} onChange={e => handleInputChange('emergencyContact', 'phone', e.target.value)} />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 7: Identity Verification</h3>
            <div style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: files.aadhaarDoc ? '#F0FDF4' : 'white', borderColor: files.aadhaarDoc ? '#16A34A' : '#CBD5E1' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: '#F1F5F9', padding: '12px', borderRadius: '12px' }}><Upload color="#64748B" /></div>
                <div>
                  <h5 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1rem' }}>Government ID (Aadhaar/DL) *</h5>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>{files.aadhaarDoc ? files.aadhaarDoc.name : 'PDF, JPG up to 5MB'}</p>
                </div>
              </div>
              <label style={{ background: 'white', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Browse <input type="file" style={{ display: 'none' }} onChange={e => setFiles({ ...files, aadhaarDoc: e.target.files[0] })} />
              </label>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="animate-fade-in">
            <h3 style={stepTitleStyle}>Step 8: Preview Application</h3>
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}>
              <p><strong>Name:</strong> {formData.personalInfo.fullName}</p>
              <p><strong>Email:</strong> {formData.personalInfo.email} ✅</p>
              <p><strong>Phone:</strong> {formData.personalInfo.phone} ✅</p>
              <p><strong>District:</strong> {formData.address.district}</p>
              <p><strong>Roles:</strong> {formData.volunteerDetails.types.join(', ')}</p>
              
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.agreements.guidelines} onChange={() => handleInputChange('agreements', 'guidelines', !formData.agreements.guidelines)} />
                  I agree to the Volunteer Code of Conduct.
                </label>
                <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.agreements.liveLocation} onChange={() => handleInputChange('agreements', 'liveLocation', !formData.agreements.liveLocation)} />
                  I consent to sharing my live GPS location during missions.
                </label>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ background: '#DCFCE7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="#16A34A" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0a1628', marginBottom: '16px' }}>Application Submitted!</h2>
            <p style={{ color: '#64748B', fontSize: '1.2rem', marginBottom: '16px' }}>
              Your Volunteer ID: <span style={{ fontWeight: 800, color: '#0a1628' }}>{successData?.volunteerId}</span>
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Assigned NGO: <strong>{successData?.nearestNgo}</strong><br/>
              Status: <strong style={{color: '#F59E0B'}}>Pending Verification</strong>
            </p>
            <button onClick={() => navigate('/volunteer')} style={{ background: '#16A34A', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Go to Volunteer Dashboard
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 22, 40, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '800px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {step < 9 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a1628' }}>Registration Wizard</h2>
            <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={24} /></button>
          </div>
        )}

        {step < 9 && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: '6px', flex: 1, borderRadius: '4px', background: i + 1 <= step ? '#16A34A' : '#E2E8F0', transition: '0.3s' }}></div>
            ))}
          </div>
        )}

        {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><AlertCircle size={18}/> {error}</div>}

        <div style={{ minHeight: '300px' }}>
          {renderStep()}
        </div>

        {step < 9 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', marginTop: '32px', borderTop: '1px solid #E2E8F0' }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} disabled={loading} style={{ background: '#F8FAFC', color: '#475569', padding: '12px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div></div>}
            
            {step < 8 ? (
              <button onClick={nextStep} style={{ background: '#16A34A', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button onClick={submitApplication} disabled={loading || !formData.agreements.guidelines} style={{ background: '#16A34A', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// Subcomponents
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' };
const stepTitleStyle = { fontSize: '1.4rem', fontWeight: 700, color: '#0a1628', marginBottom: '24px' };

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={onChange} style={inputStyle} />
  </div>
);

export default RegistrationWizard;
