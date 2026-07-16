const path = require('path');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const sqlite3 = require('sqlite3').verbose();

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile_number TEXT NOT NULL,
      otp_verified BOOLEAN DEFAULT 0,
      verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      attempts INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT 0,
      email_verified_at DATETIME,
      verification_token TEXT,
      token_expiry DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

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
    db.run(`INSERT INTO verifications (mobile_number) VALUES (?)`, [phone]);

    if (accountSid === 'AC_MOCK_ACCOUNT_SID') {
      console.log('Mock Twilio keys used. Simulating OTP send to', phone);
      return res.json({ success: true, status: 'mock', message: 'Mock OTP sent. Use 123456 to verify.' });
    }

    // Send via Twilio
    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phone, channel: 'sms' });

    res.json({ success: true, status: verification.status });
  } catch (error) {
    console.error('Twilio Error:', error.message);
    res.status(500).json({ error: 'Failed to send real OTP. Please ensure valid Twilio API keys are provided in server.js' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp || otp.length !== 6) {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  if (accountSid === 'AC_MOCK_ACCOUNT_SID' && otp === '123456') {
    db.run('UPDATE verifications SET otp_verified = 1, verified_at = CURRENT_TIMESTAMP WHERE mobile_number = ?', [phone]);
    return res.json({ success: true, message: 'Mock OTP verified successfully.' });
  }

  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code: otp });

    if (verificationCheck.status === 'approved') {
      db.run(
        `UPDATE verifications SET otp_verified = 1, verified_at = CURRENT_TIMESTAMP WHERE mobile_number = ?`,
        [phone]
      );
      return res.json({ verified: true });
    } else {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Twilio Verification Error:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP. Please ensure valid Twilio API keys are provided.' });
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

    db.get('SELECT id FROM email_verifications WHERE email = ?', [email], (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      const insertOrUpdate = () => {
        if (row) {
          db.run(
            'UPDATE email_verifications SET verification_token = ?, token_expiry = ?, email_verified = 0 WHERE email = ?',
            [token, expiry, email],
            sendEmail
          );
        } else {
          db.run(
            'INSERT INTO email_verifications (email, verification_token, token_expiry) VALUES (?, ?, ?)',
            [email, token, expiry],
            sendEmail
          );
        }
      };

      const sendEmail = async (dbErr) => {
        if (dbErr) return res.status(500).json({ error: 'Database error on save' });

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
          console.log('Verification email sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          res.json({ success: true, message: 'Verification email sent' });
        } catch (emailErr) {
          console.error('SMTP Error:', emailErr);
          res.status(500).json({ error: 'Failed to send verification email. Check SMTP settings.' });
        }
      };

      insertOrUpdate();
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/api/email/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid token.');

  db.get(
    'SELECT * FROM email_verifications WHERE verification_token = ?',
    [token],
    (err, row) => {
      if (err) return res.status(500).send('Database error.');
      if (!row) return res.status(400).send('Invalid or expired token.');

      if (new Date(row.token_expiry) < new Date()) {
        return res.status(400).send('Token has expired. Please request a new one.');
      }

      db.run(
        'UPDATE email_verifications SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP, verification_token = NULL, token_expiry = NULL WHERE id = ?',
        [row.id],
        (updateErr) => {
          if (updateErr) return res.status(500).send('Failed to update verification status.');
          res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
              <h2 style="color: #16A34A;">Email Verified Successfully!</h2>
              <p>You can now return to the registration page and continue.</p>
              <script>
                setTimeout(() => window.close(), 3000);
              </script>
            </div>
          `);
        }
      );
    }
  );
});

app.get('/api/check-email-verification', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  db.get('SELECT email_verified FROM email_verifications WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.json({ verified: false });
    res.json({ verified: row.email_verified === 1 });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Production Backend running on http://localhost:${PORT}`);
});
