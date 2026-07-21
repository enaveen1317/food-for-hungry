import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Upload, CheckCircle, ChevronRight, ChevronLeft, Shield, AlertCircle, Smartphone, Mail } from 'lucide-react';
import { api } from '../../services/api';

const VolunteerRegistrationModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);

  React.useEffect(() => {
    let timer;
    if (countdown > 0) timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  React.useEffect(() => {
    let timer;
    if (emailCountdown > 0) timer = setInterval(() => setEmailCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [emailCountdown]);



  // Form State
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '', dob: '', gender: '', phone: '', email: '', aadhaar: '',
      district: '', taluk: '', village: '', pincode: '',
      gpsLocation: null
    },
    volunteerDetails: {
      types: [], skills: '', languages: '', occupation: '', experience: '',
      availableDays: '', availableTime: '', ownVehicle: 'No', vehicleType: '', licenseNumber: ''
    },
    emergencyContact: {
      name: '', relationship: '', phone: ''
    },
    agreements: {
      guidelines: false, liveLocation: false, privacy: false
    }
  });

  // Files State
  const [files, setFiles] = useState({
    profilePhoto: null,
    aadhaarDoc: null,
    licenseDoc: null
  });

  React.useEffect(() => {
    let poller;
    if (emailSent && !emailVerified && formData.personalInfo.email) {
      poller = setInterval(async () => {
        try {
          const res = await api.checkEmailVerification(formData.personalInfo.email);
          if (res.verified) {
            setEmailVerified(true);
            clearInterval(poller);
          }
        } catch (err) {
          // ignore
        }
      }, 3000);
    }
    return () => clearInterval(poller);
  }, [emailSent, emailVerified, formData.personalInfo.email]);

  const [successData, setSuccessData] = useState(null);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleCheckboxToggle = (section, field, value) => {
    setFormData(prev => {
      const arr = prev[section][field] || [];
      const newArr = arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value];
      return { ...prev, [section]: { ...prev[section], [field]: newArr } };
    });
  };

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const captureGPS = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('personalInfo', 'gpsLocation', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.warn("Could not get location:", error);
          setShowLocationPicker(true); // Fallback to map
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setShowLocationPicker(true);
    }
  };

  const isValidPhone = /^[6-9]\d{9}$/.test(formData.personalInfo.phone);

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
      // In production, this will trigger Firebase Phone Auth and send a real SMS
      await api.sendOTP(formData.personalInfo.phone);
      setOtpSent(true);
      setCountdown(30);
      setOtpCode(['', '', '', '', '', '']); // Clear code for real entry
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
      
      if (!otpVerified) throw new Error("Please verify your phone number first.");
      if (!formData.agreements.guidelines || !formData.agreements.liveLocation || !formData.agreements.privacy) {
        throw new Error("You must agree to all terms and conditions.");
      }

      // Step 1: Upload Documents
      let uploadedDocs = { profilePhotoUrl: '', aadhaarDocUrl: '', licenseDocUrl: '' };
      if (files.profilePhoto) uploadedDocs.profilePhotoUrl = await api.uploadDocument(files.profilePhoto);
      if (files.aadhaarDoc) uploadedDocs.aadhaarDocUrl = await api.uploadDocument(files.aadhaarDoc);
      if (files.licenseDoc) uploadedDocs.licenseDocUrl = await api.uploadDocument(files.licenseDoc);

      // Step 2: Register in DB
      const finalData = { ...formData, documents: uploadedDocs };
      const response = await api.registerVolunteer(finalData);
      
      setSuccessData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ background: '#DCFCE7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="#16A34A" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0a1628', marginBottom: '16px' }}>Application Submitted!</h2>
            <p style={{ color: '#64748B', fontSize: '1.2rem', marginBottom: '16px' }}>
              Your Volunteer ID: <span style={{ fontWeight: 800, color: '#0a1628' }}>{successData.volunteerId}</span>
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Your application is currently <strong style={{color: '#F59E0B'}}>Pending Verification</strong>.
              You can track your status on your dashboard.
            </p>
            <button onClick={() => navigate('/volunteer-dashboard')} style={btnPrimary}>
              Go to Volunteer Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {showLocationPicker && (
          <LocationPickerMap 
            onClose={() => setShowLocationPicker(false)}
            onSelect={(latLng) => {
              handleInputChange('personalInfo', 'gpsLocation', latLng);
              setShowLocationPicker(false);
            }}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a1628' }}>Volunteer Registration</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={24} /></button>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ height: '6px', flex: 1, borderRadius: '4px', background: s <= step ? '#16A34A' : '#E2E8F0', transition: '0.3s' }}></div>
          ))}
        </div>

        {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}><AlertCircle size={18}/> {error}</div>}

        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0a1628' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input label="Full Name *" value={formData.personalInfo.fullName} onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)} />
                <Input label="Date of Birth *" type="date" value={formData.personalInfo.dob} onChange={e => handleInputChange('personalInfo', 'dob', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Gender *</label>
                  <select style={inputStyle} value={formData.personalInfo.gender} onChange={e => handleInputChange('personalInfo', 'gender', e.target.value)}>
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div style={{ display: 'none' }}></div>
              </div>

              {/* Email Verification Section */}
              <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <label style={labelStyle}>Email Address *</label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <input style={{...inputStyle, flex: 1, borderColor: (formData.personalInfo.email && !/^\S+@\S+\.\S+$/.test(formData.personalInfo.email)) ? '#DC2626' : '#CBD5E1'}} type="email" placeholder="example@email.com" value={formData.personalInfo.email} onChange={e => {
                      handleInputChange('personalInfo', 'email', e.target.value);
                      if (emailVerified) setEmailVerified(false);
                      if (emailSent) setEmailSent(false);
                    }} disabled={emailVerified} />
                  
                  {!emailVerified ? (
                    <button onClick={sendVerificationEmail} disabled={emailLoading || !/^\S+@\S+\.\S+$/.test(formData.personalInfo.email) || emailCountdown > 0} style={{ background: (emailLoading || !/^\S+@\S+\.\S+$/.test(formData.personalInfo.email) || emailCountdown > 0) ? '#94A3B8' : '#0a1628', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 600, cursor: (emailLoading || !/^\S+@\S+\.\S+$/.test(formData.personalInfo.email) || emailCountdown > 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', whiteSpace: 'nowrap' }}>
                      <Mail size={18} /> {emailLoading ? 'Sending...' : (emailSent ? (emailCountdown > 0 ? `Resend in ${emailCountdown}s` : 'Resend Email') : 'Send Verification Email')}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700, padding: '0 16px', background: '#DCFCE7', borderRadius: '10px', whiteSpace: 'nowrap' }}><CheckCircle size={20}/> Verified</div>
                  )}
                </div>
                {formData.personalInfo.email && !/^\S+@\S+\.\S+$/.test(formData.personalInfo.email) && <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600, display: 'block' }}>Please enter a valid email address.</span>}
                {emailSent && !emailVerified && <span style={{ fontSize: '0.85rem', color: '#0a1628', fontWeight: 600, display: 'block' }}>Verification email sent. Please check your inbox and click the link to verify.</span>}
              </div>

              {/* OTP Section */}
              <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <label style={labelStyle}>Mobile Number *</label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <input style={{...inputStyle, flex: 1, borderColor: (formData.personalInfo.phone && !isValidPhone) ? '#DC2626' : '#CBD5E1'}} type="tel" placeholder="+91" maxLength="10" value={formData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', 'phone', e.target.value.replace(/\D/g, ''))} disabled={otpVerified} />
                  {!otpVerified ? (
                    <button onClick={sendOTP} disabled={loading || !isValidPhone || countdown > 0} style={{ background: (loading || !isValidPhone || countdown > 0) ? '#94A3B8' : '#0a1628', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 600, cursor: (loading || !isValidPhone || countdown > 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                      <Smartphone size={18} /> {loading ? 'Wait...' : (otpSent ? (countdown > 0 ? `Resend in ${countdown}s` : 'Resend') : 'Send OTP')}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700, padding: '0 16px', background: '#DCFCE7', borderRadius: '10px' }}><CheckCircle size={20}/> Verified</div>
                  )}
                </div>
                {formData.personalInfo.phone && !isValidPhone && <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>Please enter a valid 10-digit Indian mobile number.</span>}
                
                {otpSent && !otpVerified && (
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Enter the 6-digit code sent to your phone</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <OTPInput value={otpCode} onChange={setOtpCode} disabled={loading} />
                      <button onClick={verifyOTP} disabled={loading || otpCode.join('').length !== 6} style={{ background: (loading || otpCode.join('').length !== 6) ? '#94A3B8' : '#16A34A', color: 'white', border: 'none', borderRadius: '10px', height: '55px', padding: '0 24px', fontWeight: 700, fontSize: '1rem', cursor: (loading || otpCode.join('').length !== 6) ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: (loading || otpCode.join('').length !== 6) ? 'none' : '0 4px 14px rgba(22, 163, 74, 0.2)' }}>
                        {loading ? 'Wait...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0a1628', marginTop: '12px' }}>Address Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <AutocompleteInput label="District *" value={formData.personalInfo.district} onChange={e => handleInputChange('personalInfo', 'district', e.target.value)} options={["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Kanyakumari", "Chengalpattu", "Kanchipuram"]} />
                <AutocompleteInput label="Taluk" value={formData.personalInfo.taluk} onChange={e => handleInputChange('personalInfo', 'taluk', e.target.value)} options={["Guindy", "Mylapore", "Velachery", "Alandur", "Tambaram", "Pallavaram", "Sholinganallur", "Aminjikarai", "Ayanavaram", "Egmore", "Mambalam", "Perambur", "Purasawalkam", "Tondiarpet", "Ambattur", "Poonamallee"]} />
                <AutocompleteInput label="Village / City *" value={formData.personalInfo.village} onChange={e => handleInputChange('personalInfo', 'village', e.target.value)} options={["Anna Nagar", "T Nagar", "Adyar", "Besant Nagar", "Nungambakkam", "Alwarpet", "Mylapore", "Royapettah", "Triplicane", "Thiruvanmiyur", "Velachery", "Madipakkam", "Pallikaranai", "Medavakkam", "Tambaram", "Chromepet", "Pallavaram"]} />
                <Input label="Pincode *" value={formData.personalInfo.pincode} onChange={e => handleInputChange('personalInfo', 'pincode', e.target.value)} />
              </div>
              
              <div style={{ background: '#ECFDF5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #A7F3D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#16A34A', padding: '10px', borderRadius: '50%' }}><MapPin size={20} color="white" /></div>
                  <div>
                    <h5 style={{ fontWeight: 700, color: '#065F46', margin: 0, fontSize: '0.95rem' }}>Current GPS Location</h5>
                    <p style={{ color: '#047857', margin: 0, fontSize: '0.85rem' }}>{formData.personalInfo.gpsLocation ? `Lat: ${formData.personalInfo.gpsLocation.lat.toFixed(4)}, Lng: ${formData.personalInfo.gpsLocation.lng.toFixed(4)}` : 'Required for emergency routing'}</p>
                  </div>
                </div>
                <button onClick={captureGPS} disabled={loading} style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
                  {formData.personalInfo.gpsLocation ? 'Update Location' : 'Capture Location'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0a1628' }}>Volunteer Details</h3>
              
              <div>
                <label style={labelStyle}>Volunteer Type (Multiple Select) *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['Food Rescue', 'Education Support', 'Clothes Distribution', 'Medical Support', 'Transport', 'Emergency SOS'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: formData.volunteerDetails.types.includes(type) ? '#DCFCE7' : '#F8FAFC', border: formData.volunteerDetails.types.includes(type) ? '1px solid #16A34A' : '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s', fontWeight: 600, fontSize: '0.9rem', color: formData.volunteerDetails.types.includes(type) ? '#16A34A' : '#475569' }}>
                      <input type="checkbox" checked={formData.volunteerDetails.types.includes(type)} onChange={() => handleCheckboxToggle('volunteerDetails', 'types', type)} style={{ display: 'none' }} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Skills (Multiple Select)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['First Aid', 'Event Management', 'Cooking', 'Teaching', 'Driving', 'Counseling', 'Social Media'].map(skill => (
                    <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: (formData.volunteerDetails.skills || []).includes(skill) ? '#DBEAFE' : '#F8FAFC', border: (formData.volunteerDetails.skills || []).includes(skill) ? '1px solid #2563EB' : '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s', fontWeight: 600, fontSize: '0.85rem', color: (formData.volunteerDetails.skills || []).includes(skill) ? '#2563EB' : '#475569' }}>
                      <input type="checkbox" checked={(formData.volunteerDetails.skills || []).includes(skill)} onChange={() => handleCheckboxToggle('volunteerDetails', 'skills', skill)} style={{ display: 'none' }} />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input label="Languages Known" value={formData.volunteerDetails.languages} onChange={e => handleInputChange('volunteerDetails', 'languages', e.target.value)} />
                <Input label="Occupation" value={formData.volunteerDetails.occupation} onChange={e => handleInputChange('volunteerDetails', 'occupation', e.target.value)} />
                <Input label="Experience (Years / Details)" value={formData.volunteerDetails.experience} onChange={e => handleInputChange('volunteerDetails', 'experience', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input label="Available Days (e.g. Weekends)" value={formData.volunteerDetails.availableDays} onChange={e => handleInputChange('volunteerDetails', 'availableDays', e.target.value)} />
                <Input label="Available Time (e.g. 6PM - 9PM)" value={formData.volunteerDetails.availableTime} onChange={e => handleInputChange('volunteerDetails', 'availableTime', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Own Vehicle?</label>
                  <select style={inputStyle} value={formData.volunteerDetails.ownVehicle} onChange={e => handleInputChange('volunteerDetails', 'ownVehicle', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                {formData.volunteerDetails.ownVehicle === 'Yes' && (
                  <>
                    <div>
                      <label style={labelStyle}>Vehicle Type</label>
                      <select style={inputStyle} value={formData.volunteerDetails.vehicleType} onChange={e => handleInputChange('volunteerDetails', 'vehicleType', e.target.value)}>
                        <option value="">Select Type</option><option>Two Wheeler</option><option>Four Wheeler</option><option>Heavy Vehicle</option>
                      </select>
                    </div>
                    <Input label="Driving License Number" value={formData.volunteerDetails.licenseNumber} onChange={e => handleInputChange('volunteerDetails', 'licenseNumber', e.target.value)} />
                  </>
                )}
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0a1628', marginTop: '12px' }}>Emergency Contact</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <Input label="Contact Person" value={formData.emergencyContact.name} onChange={e => handleInputChange('emergencyContact', 'name', e.target.value)} />
                <Input label="Relationship" value={formData.emergencyContact.relationship} onChange={e => handleInputChange('emergencyContact', 'relationship', e.target.value)} />
                <Input label="Phone Number" value={formData.emergencyContact.phone} onChange={e => handleInputChange('emergencyContact', 'phone', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0a1628' }}>Document Verification</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Upload your documents to complete verification. Max size 5MB per file.</p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <FileUploadCard label="Profile Photo *" field="profilePhoto" file={files.profilePhoto} onChange={handleFileChange} />
                <FileUploadCard label="Aadhaar / Gov ID *" field="aadhaarDoc" file={files.aadhaarDoc} onChange={handleFileChange} />
                <FileUploadCard label="Driving License (Optional)" field="licenseDoc" file={files.licenseDoc} onChange={handleFileChange} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0a1628' }}>Agreements & Submission</h3>
              
              <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AgreementCheckbox 
                  label="I agree to follow the strict Volunteer Code of Conduct and Guidelines." 
                  checked={formData.agreements.guidelines} 
                  onChange={() => handleInputChange('agreements', 'guidelines', !formData.agreements.guidelines)} 
                />
                <AgreementCheckbox 
                  label="I agree to share my live GPS location with the District Manager ONLY during active SOS or Delivery requests." 
                  checked={formData.agreements.liveLocation} 
                  onChange={() => handleInputChange('agreements', 'liveLocation', !formData.agreements.liveLocation)} 
                />
                <AgreementCheckbox 
                  label="I agree to the Privacy Policy regarding my personal data." 
                  checked={formData.agreements.privacy} 
                  onChange={() => handleInputChange('agreements', 'privacy', !formData.agreements.privacy)} 
                />
              </div>

              <div style={{ background: '#EFF6FF', padding: '20px', borderRadius: '12px', border: '1px solid #BFDBFE', display: 'flex', gap: '12px' }}>
                <Shield color="#3B82F6" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontWeight: 700, color: '#1E3A8A', margin: '0 0 4px' }}>Secure Submission</h5>
                  <p style={{ color: '#1E40AF', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>Your data is encrypted and securely stored. By submitting, your application will be sent to the District Manager for verification.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #E2E8F0' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} disabled={loading} style={btnSecondary}>
              <ChevronLeft size={20} /> Back
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!otpVerified || !emailVerified)} style={{ ...btnPrimary, background: (step === 1 && (!otpVerified || !emailVerified)) ? '#94A3B8' : '#16A34A', cursor: (step === 1 && (!otpVerified || !emailVerified)) ? 'not-allowed' : 'pointer', boxShadow: (step === 1 && (!otpVerified || !emailVerified)) ? 'none' : '0 4px 14px rgba(22, 163, 74, 0.2)' }}>
              Continue <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={submitApplication} disabled={loading || !otpVerified || !emailVerified || !formData.agreements.guidelines || !formData.agreements.liveLocation || !formData.agreements.privacy} style={btnPrimary}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// --- STYLES & SUBCOMPONENTS ---

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 22, 40, 0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 20px 20px', overflowY: 'auto' };
const modalStyle = { background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '800px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', margin: '0 auto' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' };
const btnPrimary = { background: '#16A34A', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.2)' };
const btnSecondary = { background: '#F8FAFC', color: '#475569', padding: '12px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={onChange} style={inputStyle} />
  </div>
);

const AutocompleteInput = ({ label, value, onChange, options }) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const wrapperRef = React.useRef(null);
  
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => { onChange(e); setShowOptions(true); }}
        onFocus={() => setShowOptions(true)}
        style={inputStyle} 
      />
      {showOptions && value && filteredOptions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #CBD5E1', borderRadius: '10px', marginTop: '4px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
          {filteredOptions.map(opt => (
            <div 
              key={opt} 
              onClick={() => { onChange({ target: { value: opt } }); setShowOptions(false); }}
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontWeight: 500, color: '#334155' }}
              onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FileUploadCard = ({ label, field, file, onChange }) => (
  <div style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: file ? '#F0FDF4' : 'transparent', borderColor: file ? '#16A34A' : '#CBD5E1' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ background: file ? '#16A34A' : '#F1F5F9', padding: '12px', borderRadius: '12px' }}>
        <Upload color={file ? "white" : "#64748B"} size={24} />
      </div>
      <div>
        <h5 style={{ margin: '0 0 4px', fontWeight: 700, color: '#0a1628', fontSize: '1rem' }}>{label}</h5>
        <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>{file ? file.name : 'PNG, JPG, PDF up to 5MB'}</p>
      </div>
    </div>
    <div>
      <label style={{ background: 'white', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', color: '#0a1628' }}>
        {file ? 'Change File' : 'Browse'}
        <input type="file" style={{ display: 'none' }} onChange={e => onChange(field, e.target.files[0])} />
      </label>
    </div>
  </div>
);

const AgreementCheckbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ width: '20px', height: '20px', accentColor: '#16A34A', marginTop: '2px' }} />
    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{label}</span>
  </label>
);

const OTPInput = ({ value, onChange, disabled }) => {
  const inputs = React.useRef([]);
  
  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 1) {
      const newOtp = [...value];
      newOtp[index] = val;
      onChange(newOtp);
      if (val !== '' && index < 5) inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (pastedData.length > 0) {
      const newOtp = [...value];
      pastedData.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
      onChange(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputs.current[focusIndex].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {value.map((digit, index) => (
        <input
          key={index}
          ref={el => inputs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          style={{ width: '45px', height: '55px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, borderRadius: '12px', border: '1px solid #CBD5E1', background: disabled ? '#F1F5F9' : '#FFFFFF', outline: 'none', color: '#0a1628', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#16A34A'}
          onBlur={e => e.target.style.borderColor = '#CBD5E1'}
        />
      ))}
    </div>
  );
};

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const LocationPickerMap = ({ onSelect, onClose }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [markerLatLgn, setMarkerLatLgn] = React.useState({ lat: 13.0827, lng: 80.2707 }); 

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0a1628' }}>Select Location</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px', marginTop: 0 }}>Drag the pin or click on the map to set your exact location.</p>
        
        <div style={{ height: '350px', width: '100%', borderRadius: '12px', background: '#F1F5F9', marginBottom: '24px', overflow: 'hidden' }}>
          {!isLoaded ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={markerLatLgn}
              zoom={12}
              onClick={(e) => setMarkerLatLgn({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
            >
              <Marker
                position={markerLatLgn}
                draggable={true}
                onDragEnd={(e) => setMarkerLatLgn({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
              />
            </GoogleMap>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: 'white', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSelect(markerLatLgn)} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#16A34A', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Confirm Location</button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistrationModal;
