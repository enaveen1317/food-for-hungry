/**
 * Simulated API Service Layer
 * This abstracts the backend implementation. Currently uses an advanced LocalStorage wrapper
 * to simulate a real database (with network latency). When moving to production (e.g. Firebase/Supabase),
 * only this file needs to be updated. All React components consume these methods asynchronously.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const BASE_URL = 'http://localhost:3001/api';

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
      if (err.message === "Failed to fetch") throw new Error("Backend server is not running. Please start the server.");
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
      if (err.message === "Failed to fetch") throw new Error("Backend server is not running. Please start the server.");
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
      if (err.message === "Failed to fetch") throw new Error("Backend server is not running. Please start the server.");
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
      console.warn("Backend server not running or failed. Mock email verification status: false.");
      await delay(800);
      return { verified: false, mock: true };
    }
  },

  loginWithEmail: async (email, password) => {
    await delay(800);
    if (email === "admin@ffh.org" && password === "admin123") {
      return { success: true, user: { role: 'admin', name: 'System Admin' } };
    }
    const volunteers = getDB('ffh_registered_volunteers');
    const user = volunteers.find(v => v.personalInfo.email === email);
    if (user) {
      return { success: true, user: { role: 'volunteer', id: user.volunteerId, ...user } };
    }
    throw new Error("Invalid credentials");
  },

  // --- VOLUNTEER REGISTRATION ---

  uploadDocument: async (file) => {
    await delay(1500);
    // Simulate cloud storage upload by converting to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  },

  registerVolunteer: async (volunteerData) => {
    await delay(2000);
    const db = getDB('ffh_registered_volunteers');
    
    // Generate Volunteer ID (VOL-TN-YYYY-XXXXX)
    const year = new Date().getFullYear();
    const count = String(db.length + 1).padStart(5, '0');
    const volunteerId = `VOL-TN-${year}-${count}`;
    
    const newVolunteer = {
      ...volunteerData,
      volunteerId,
      status: 'Pending Verification',
      createdAt: new Date().toISOString(),
      stats: {
        completedDeliveries: 0,
        rating: 0,
        profileCompletion: 80
      }
    };
    
    db.push(newVolunteer);
    setDB('ffh_registered_volunteers', db);
    
    return { success: true, volunteerId, data: newVolunteer };
  },

  // --- ADMIN FUNCTIONS ---

  getPendingApplications: async () => {
    await delay(1000);
    const db = getDB('ffh_registered_volunteers');
    return db.filter(v => v.status === 'Pending Verification');
  },

  updateVolunteerStatus: async (volunteerId, newStatus) => {
    await delay(1000);
    const db = getDB('ffh_registered_volunteers');
    const index = db.findIndex(v => v.volunteerId === volunteerId);
    if (index === -1) throw new Error("Volunteer not found");
    
    db[index].status = newStatus;
    if (newStatus === 'Active') {
      db[index].stats.profileCompletion = 100;
    }
    setDB('ffh_registered_volunteers', db);
    return { success: true, data: db[index] };
  },

  // --- DASHBOARD FUNCTIONS ---
  
  getVolunteerProfile: async (volunteerId) => {
    await delay(600);
    const db = getDB('ffh_registered_volunteers');
    const user = db.find(v => v.volunteerId === volunteerId);
    if (!user) throw new Error("Volunteer not found");
    return user;
  }
};
