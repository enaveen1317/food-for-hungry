/**
 * Simulated API Service Layer
 * This abstracts the backend implementation. Currently uses an advanced LocalStorage wrapper
 * to simulate a real database (with network latency). When moving to production (e.g. Firebase/Supabase),
 * only this file needs to be updated. All React components consume these methods asynchronously.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));
export const BASE_URL = 'http://localhost:3001/api';

export const api = {
  // --- AUTHENTICATION & OTP ---
  sendOTP: async (phone) => {
    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+91' + phone.replace('+91', '') })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");
      return data;
    } catch (err) {
      console.error("sendOTP Error:", err);
      throw err;
    }
  },

  verifyOTP: async (phone, code) => {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+91' + phone.replace('+91', ''), otp: code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to verify OTP");
      return data;
    } catch (err) {
      console.error("verifyOTP Error:", err);
      throw err;
    }
  },

  sendEmailVerification: async (email, fullName) => {
    try {
      const response = await fetch(`${BASE_URL}/email/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send email verification");
      return data;
    } catch (err) {
      console.error("sendEmailVerification Error:", err);
      throw err;
    }
  },

  checkEmailVerification: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/check-email-verification?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to check email verification status");
      return data;
    } catch (err) {
      console.error("checkEmailVerification Error:", err);
      throw err;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid credentials");
      return data;
    } catch (err) {
      console.error("loginWithEmail Error:", err);
      throw err;
    }
  },

  // --- DONATIONS & WORKFLOW ---
  submitDonation: async (donationData) => {
    try {
      const response = await fetch(`${BASE_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit donation");
      return data;
    } catch (err) {
      console.error("submitDonation Error:", err);
      throw err;
    }
  },

  getDonations: async () => {
    try {
      const response = await fetch(`${BASE_URL}/donations`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data.donations;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  acceptDonation: async (id) => {
    try {
      await fetch(`${BASE_URL}/donations/${id}/accept`, { method: 'POST' });
    } catch (err) { console.error(err); }
  },

  dispatchVolunteer: async (id, volunteerName) => {
    try {
      const response = await fetch(`${BASE_URL}/donations/${id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerName })
      });
      return await response.json();
    } catch (err) { console.error(err); }
  },

  getTasks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data.tasks;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  updateTaskStatus: async (taskId, status, donationId) => {
    try {
      await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, donationId })
      });
    } catch (err) { console.error(err); }
  },

  getStats: async () => {
    try {
      const response = await fetch(`${BASE_URL}/stats`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data.stats;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  // --- MAP & LIVE TRACKING ---
  getNGOs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/ngos`);
      const data = await response.json();
      return data.ngos || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getVolunteers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/volunteers`);
      const data = await response.json();
      return data.volunteers || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getSOSRequests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/sos-requests`);
      const data = await response.json();
      return data.requests || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  submitSOS: async (requestData) => {
    try {
      const response = await fetch(`${BASE_URL}/sos-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit SOS request");
      return data;
    } catch (err) {
      console.error("submitSOS Error:", err);
      throw err;
    }
  },

  // --- VOLUNTEER REGISTRATION ---
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload document");
      return data.url;
    } catch (err) {
      console.error("uploadDocument Error:", err);
      throw err;
    }
  },

  registerVolunteer: async (volunteerData) => {
    const payload = {
      fullName: volunteerData.personalInfo.fullName,
      email: volunteerData.personalInfo.email,
      phone: volunteerData.personalInfo.phone,
      address: volunteerData.personalInfo.address,
      district: volunteerData.personalInfo.district,
      taluk: volunteerData.personalInfo.taluk,
      skills: volunteerData.volunteerDetails.skills,
      languages: volunteerData.volunteerDetails.languages,
      preferredService: volunteerData.volunteerDetails.types.join(', '),
      location: volunteerData.personalInfo.gpsLocation
    };
    try {
      const response = await fetch(`${BASE_URL}/volunteers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      return data;
    } catch (err) {
      console.error("Register Error:", err);
      throw err;
    }
  }
};
