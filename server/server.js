const path = require('path');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const { Pool } = require('pg');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_tracking', (data) => {
    if (data.taskId) {
      socket.join(`task_${data.taskId}`);
      console.log(`Socket ${socket.id} joined task_${data.taskId}`);
    }
  });

  socket.on('location_update', (data) => {
    // data should have taskId, lat, lng
    if (data.taskId) {
      io.to(`task_${data.taskId}`).emit('location_changed', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const initializeDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verifications (
        id SERIAL PRIMARY KEY,
        mobile_number VARCHAR(20) NOT NULL,
        otp_verified BOOLEAN DEFAULT false,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attempts INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS email_verifications (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        email_verified BOOLEAN DEFAULT false,
        email_verified_at TIMESTAMP,
        verification_token VARCHAR(255),
        token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile_number VARCHAR(20) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'volunteer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ngos (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        lat REAL,
        lng REAL,
        district VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        volunteer_id VARCHAR(50) UNIQUE NOT NULL,
        address TEXT,
        district VARCHAR(100),
        taluk VARCHAR(100),
        skills TEXT,
        languages TEXT,
        preferred_service TEXT,
        lat REAL,
        lng REAL,
        assigned_ngo_id INTEGER REFERENCES ngos(id),
        status VARCHAR(50) DEFAULT 'Pending Verification',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50),
        title VARCHAR(255),
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS donations (
        id VARCHAR(50) PRIMARY KEY,
        donor VARCHAR(255),
        food TEXT,
        qty VARCHAR(50),
        category VARCHAR(100),
        prepTime VARCHAR(50),
        bestBefore VARCHAR(50),
        storage VARCHAR(50),
        address TEXT,
        contact VARCHAR(50),
        window VARCHAR(50),
        packaging VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Listed',
        progress INTEGER DEFAULT 1,
        ngo_id INTEGER REFERENCES ngos(id),
        volunteer_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(50) PRIMARY KEY,
        donation_id VARCHAR(50) REFERENCES donations(id),
        donor VARCHAR(255),
        food TEXT,
        pickup TEXT,
        drop_loc TEXT,
        urgency VARCHAR(50),
        distance_km REAL,
        distance_remaining REAL,
        payout VARCHAR(50),
        status VARCHAR(50),
        pickupTime VARCHAR(50),
        dropTime VARCHAR(50),
        proofUploaded BOOLEAN DEFAULT false,
        eta INTEGER,
        assignedAt TIMESTAMP,
        volunteer_name VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS sos_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        loc TEXT,
        people_count INTEGER,
        urgent BOOLEAN DEFAULT false,
        dispatched BOOLEAN DEFAULT false,
        volunteer_name VARCHAR(255),
        lat REAL,
        lng REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Mock NGOs
    const res = await pool.query('SELECT count(*) as count FROM ngos');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query("INSERT INTO ngos (name, email, lat, lng, district) VALUES ('Helping Hands NGO Tambaram', 'admin@ffh.com', 12.9249, 80.1100, 'Chengalpattu')");
      await pool.query("INSERT INTO ngos (name, email, lat, lng, district) VALUES ('Food Bank Chennai', 'admin2@ffh.com', 13.0827, 80.2707, 'Chennai')");
    }
    console.log("PostgreSQL initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize PostgreSQL:", err);
  }
};
initializeDB();

// Twilio Config - THESE MUST BE REPLACED WITH REAL KEYS
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_MOCK_ACCOUNT_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'MOCK_AUTH_TOKEN';
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID || 'VA_MOCK_SERVICE_SID';

const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_ENCRYPTION === 'tls' ? false : process.env.MAIL_PORT == 465,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Rate limiting map (in-memory for simplicity)
const rateLimitMap = new Map();

app.post('/api/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\+91[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid Indian mobile number.' });
  }

  // Rate limiting (5 attempts per hour)
  const now = Date.now();
  const history = rateLimitMap.get(phone) || [];
  const recentAttempts = history.filter(time => now - time < 3600000);
  if (recentAttempts.length >= 5) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  recentAttempts.push(now);
  rateLimitMap.set(phone, recentAttempts);

  try {
    // Record in DB
    await pool.query(`INSERT INTO verifications (mobile_number) VALUES ($1)`, [phone]);

    // Send via Twilio
    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phone, channel: 'sms' });

    res.json({ success: true, status: verification.status });
  } catch (error) {
    console.error('Twilio Error:', error.message);
    return res.status(500).json({ error: 'Failed to send OTP. Check Twilio credentials.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp || otp.length !== 6) {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code: otp });

    if (verificationCheck.status === 'approved') {
      await pool.query(
        `UPDATE verifications SET otp_verified = true, verified_at = CURRENT_TIMESTAMP WHERE mobile_number = $1`,
        [phone]
      );
      return res.json({ verified: true });
    } else {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Twilio Verification Error:', error.message);
    res.status(500).json({ error: 'Twilio Verify Error: ' + error.message });
  }
});

app.post('/api/email/send-verification', async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Rate limiting (1 attempt per 60 seconds)
  const now = Date.now();
  const history = rateLimitMap.get(email) || [];
  const recentAttempts = history.filter(time => now - time < 60000); // 60 seconds
  if (recentAttempts.length > 0) {
    return res.status(429).json({ error: 'Please wait 60 seconds before requesting another email.' });
  }
  history.push(now);
  rateLimitMap.set(email, history);

  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(now + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const resDB = await pool.query('SELECT id FROM email_verifications WHERE email = $1', [email]);
    
    if (resDB.rows.length > 0) {
      await pool.query(
        'UPDATE email_verifications SET verification_token = $1, token_expiry = $2, email_verified = false WHERE email = $3',
        [token, expiry, email]
      );
    } else {
      await pool.query(
        'INSERT INTO email_verifications (email, verification_token, token_expiry) VALUES ($1, $2, $3)',
        [email, token, expiry]
      );
    }

    const verificationLink = `http://localhost:3001/api/email/verify?token=${token}`;

    try {
      const fromName = process.env.MAIL_FROM_NAME;
      const fromAddress = process.env.MAIL_FROM_ADDRESS;

      if (!process.env.MAIL_HOST || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
        throw new Error("Missing SMTP credentials in .env file. Please configure MAIL_HOST, MAIL_USERNAME, and MAIL_PASSWORD.");
      }

      const nameToUse = fullName || 'Volunteer';

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: email,
        subject: 'Welcome to Food For Hungry - Verify Your Email',
        html: `
          <p>Hello ${nameToUse},</p>
          <p>Thank you for registering as a volunteer with Food For Hungry.</p>
          <p>Please verify your email by clicking the button below.</p>
          <br/>
          <a href="${verificationLink}" style="padding: 12px 24px; background: #16A34A; color: white; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
          <br/><br/>
          <p>If you did not create this account, simply ignore this email.</p>
          <p>Regards,<br/>Food For Hungry Team</p>
        `,
      });
      res.json({ success: true, message: 'Verification email sent' });
    } catch (emailErr) {
      console.error('SMTP Error:', emailErr);
      res.status(500).json({ error: 'Failed to send verification email. Check SMTP settings.' });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/api/email/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid token.');

  try {
    const resDB = await pool.query('SELECT * FROM email_verifications WHERE verification_token = $1', [token]);
    if (resDB.rows.length === 0) return res.status(400).send('Invalid or expired token.');

    const row = resDB.rows[0];
    if (new Date(row.token_expiry) < new Date()) {
      return res.status(400).send('Token has expired. Please request a new one.');
    }

    await pool.query(
      'UPDATE email_verifications SET email_verified = true, email_verified_at = CURRENT_TIMESTAMP, verification_token = NULL, token_expiry = NULL WHERE id = $1',
      [row.id]
    );

    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h2 style="color: #16A34A;">Email Verified Successfully!</h2>
        <p>You can now return to the registration page and continue.</p>
        <script>
          setTimeout(() => window.close(), 3000);
        </script>
      </div>
    `);
  } catch (err) {
    return res.status(500).send('Database error.');
  }
});

app.get('/api/check-email-verification', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const resDB = await pool.query('SELECT email_verified FROM email_verifications WHERE email = $1', [email]);
    if (resDB.rows.length === 0) return res.json({ verified: false });
    res.json({ verified: resDB.rows[0].email_verified === true });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Import Enterprise Workflow routes
require('./routes/volunteerWorkflow')(app, pool, client, transporter, io);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Production Backend running on http://localhost:${PORT}`);
});
