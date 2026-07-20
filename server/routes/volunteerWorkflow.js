module.exports = function(app, db, twilioClient, transporter) {
  
  // Helper: Haversine distance
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Helper: Generate Volunteer ID
  function generateVolunteerId() {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM volunteers', (err, row) => {
        if (err) return reject(err);
        const count = row.count + 1;
        const idStr = String(count).padStart(5, '0');
        resolve(`VOL-TN-2026-${idStr}`);
      });
    });
  }

  app.post('/api/volunteers/register', async (req, res) => {
    try {
      const { 
        fullName, email, phone, address, district, taluk, 
        skills, languages, preferredService, location 
      } = req.body;

      // STEP 1: Store securely & generate ID
      const volunteerId = await generateVolunteerId();
      
      const lat = location?.lat || 12.9249; // Default Tambaram
      const lng = location?.lng || 80.1100;

      // STEP 2: Find nearest NGO
      db.all('SELECT * FROM ngos', (err, ngos) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        
        let nearestNgo = ngos[0];
        let minDistance = Infinity;

        ngos.forEach(ngo => {
          const dist = getDistanceFromLatLonInKm(lat, lng, ngo.lat, ngo.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestNgo = ngo;
          }
        });

        if (!nearestNgo) {
           nearestNgo = { id: 1, name: 'Helping Hands NGO Tambaram', email: 'admin@ffh.com' };
        }

        // Insert into Users
        db.run(
          `INSERT INTO users (full_name, email, mobile_number, role) VALUES (?, ?, ?, 'volunteer')`,
          [fullName, email, phone],
          function(err) {
            if (err) return res.status(500).json({ error: 'Failed to create user' });
            const userId = this.lastID;

            // Insert into Volunteers
            db.run(
              `INSERT INTO volunteers 
               (user_id, volunteer_id, address, district, taluk, skills, languages, preferred_service, lat, lng, assigned_ngo_id, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Verification')`,
              [userId, volunteerId, address, district, taluk, JSON.stringify(skills), JSON.stringify(languages), preferredService, lat, lng, nearestNgo.id],
              async (err) => {
                if (err) return res.status(500).json({ error: 'Failed to create volunteer profile: ' + err.message });

                // Respond to client early so they don't wait for emails
                res.json({ success: true, volunteerId, nearestNgo: nearestNgo.name, status: 'Pending Verification' });

                // STEP 3: Send Email to Volunteer
                try {
                  const fromStr = `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`;
                  await transporter.sendMail({
                    from: fromStr,
                    to: email,
                    subject: 'Volunteer Application Received',
                    html: `
                      <p>Dear ${fullName},</p>
                      <p>Thank you for joining Food For Hungry.</p>
                      <p>Your Volunteer ID: <strong>${volunteerId}</strong></p>
                      <p>Status: <strong>Pending Verification</strong></p>
                      <p>Nearest NGO: <strong>${nearestNgo.name}</strong></p>
                      <p>You will receive approval shortly.</p>
                      <br/>
                      <a href="http://localhost:5173/volunteer/dashboard" style="padding: 10px 20px; background: #16A34A; color: white; text-decoration: none; border-radius: 5px;">Track your application</a>
                    `
                  });
                } catch(e) { console.error("Email to volunteer failed", e); }

                // STEP 4: Send Email to Assigned NGO
                try {
                  const fromStr = `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`;
                  await transporter.sendMail({
                    from: fromStr,
                    to: nearestNgo.email,
                    subject: 'New Volunteer Registration',
                    html: `
                      <p>A new volunteer has registered.</p>
                      <ul>
                        <li>Name: ${fullName}</li>
                        <li>Phone: ${phone}</li>
                        <li>Email: ${email}</li>
                        <li>District: ${district}</li>
                        <li>Skills: ${JSON.stringify(skills)}</li>
                        <li>Preferred Service: ${preferredService}</li>
                        <li>Volunteer ID: ${volunteerId}</li>
                      </ul>
                      <p>Please review and approve.</p>
                      <a href="http://localhost:5173/admin" style="padding: 10px; background: #16A34A; color: white; text-decoration: none; margin-right: 10px;">Approve</a>
                      <a href="http://localhost:5173/admin" style="padding: 10px; background: #DC2626; color: white; text-decoration: none;">Reject</a>
                    `
                  });
                } catch(e) { console.error("Email to NGO failed", e); }

                // STEP 5: Notification to Admin Dashboard
                db.run(`INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)`,
                  ['NEW_VOLUNTEER', '🔔 New Volunteer Registered', `${fullName} from ${district} assigned to ${nearestNgo.name}. Pending Approval.`]
                );

                // STEP 6: Send SMS to Volunteer
                try {
                  if (twilioClient && process.env.TWILIO_ACCOUNT_SID !== 'AC_MOCK_ACCOUNT_SID') {
                    // Send directly using Messages API (not Verify API)
                    await twilioClient.messages.create({
                      body: `Food For Hungry\nYour volunteer application received.\nID: ${volunteerId}\nNearest NGO: ${nearestNgo.name}\nTrack status inside the app.`,
                      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890', // Must use a Twilio number here or Messaging Service
                      to: phone.startsWith('+91') ? phone : '+91' + phone
                    });
                  }
                } catch(e) { 
                  console.error("Twilio SMS failed (likely trial restriction)", e.message); 
                  // We catch and ignore so the flow still completes for the user
                }

              }
            );
          }
        );
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });

  // STEP 7 & 8: Approve Workflow
  app.post('/api/volunteers/approve', (req, res) => {
    const { volunteerId } = req.body;
    db.get('SELECT v.*, u.email, u.full_name, u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE v.volunteer_id = ?', [volunteerId], (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Volunteer not found' });

      db.run('UPDATE volunteers SET status = "Approved" WHERE volunteer_id = ?', [volunteerId], async (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'DB Error' });
        
        res.json({ success: true, message: 'Volunteer Approved' });

        // Step 7: Send Email
        try {
           const fromStr = `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`;
           await transporter.sendMail({
              from: fromStr,
              to: row.email,
              subject: 'Food For Hungry - Volunteer Approved!',
              html: `<p>Dear ${row.full_name},</p><p>Congratulations! Your account is now Active.</p><p>Welcome to Food For Hungry. You can now accept missions.</p>`
           });
        } catch(e) {}

        // Step 7: Send SMS
        try {
          if (twilioClient && process.env.TWILIO_ACCOUNT_SID !== 'AC_MOCK_ACCOUNT_SID') {
            await twilioClient.messages.create({
              body: `Food For Hungry: Congratulations ${row.full_name}, your account is now Active! Log in to view today's tasks.`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: row.mobile_number
            });
          }
        } catch(e) {}

        // Step 10: Notification
        db.run(`INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)`,
          ['VOLUNTEER_APPROVED', '✅ Volunteer Approved', `${row.full_name} (${row.volunteer_id}) has been approved.`]
        );
      });
    });
  });

  // STEP 9: NGO Dashboard
  app.get('/api/ngos/dashboard', (req, res) => {
    const ngoId = req.query.ngoId || 1;
    db.all('SELECT v.*, u.full_name, u.email, u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE v.assigned_ngo_id = ? ORDER BY v.created_at DESC', [ngoId], (err, volunteers) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      
      const pending = volunteers.filter(v => v.status === 'Pending Verification');
      const approved = volunteers.filter(v => v.status === 'Approved');
      const rejected = volunteers.filter(v => v.status === 'Rejected');

      res.json({
        success: true,
        stats: { pending: pending.length, approved: approved.length, rejected: rejected.length },
        volunteers: volunteers
      });
    });
  });

  // STEP 10: Notification Center
  app.get('/api/notifications', (req, res) => {
    db.all('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50', (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      res.json({ success: true, notifications: rows });
    });
  });

  // -- NEW: DONATIONS & WORKFLOW --

  app.post('/api/donations', (req, res) => {
    const d = req.body;
    const randomId = 'DON-' + Math.floor(1000 + Math.random() * 9000);
    db.run(`INSERT INTO donations (id, donor, food, qty, category, prepTime, bestBefore, storage, address, contact, window, packaging, ngo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomId, d.donor || 'Self', d.foodTitle, d.qty + ' ' + (d.unit || 'Portions'), d.category, d.prepTime, d.bestBefore, d.storage, d.address, d.contact, d.window, d.packaging, 1], // default ngo_id 1
      function(err) {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ success: true, id: randomId });
        
        db.run(`INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)`,
          ['NEW_DONATION', '📦 New Food Donation', `A new surplus donation of ${d.foodTitle} (${d.qty}) has been listed in ${d.address}.`]
        );
      }
    );
  });

  app.get('/api/donations', (req, res) => {
    db.all('SELECT * FROM donations ORDER BY created_at DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      res.json({ success: true, donations: rows });
    });
  });

  app.post('/api/donations/:id/accept', (req, res) => {
    const { id } = req.params;
    db.run(`UPDATE donations SET status = 'accepted', progress = 2 WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      res.json({ success: true });
    });
  });

  app.post('/api/donations/:id/dispatch', (req, res) => {
    const { id } = req.params;
    const { volunteerName } = req.body; // In real app use volunteer_id
    
    db.get('SELECT * FROM donations WHERE id = ?', [id], (err, don) => {
      if (err || !don) return res.status(404).json({ error: 'Donation not found' });
      
      const taskId = 'TSK-' + Math.floor(100 + Math.random() * 900);
      
      db.serialize(() => {
        db.run(`UPDATE donations SET status = 'Volunteer Assigned', progress = 3, volunteer_name = ? WHERE id = ?`, [volunteerName, id]);
        db.run(`INSERT INTO tasks (id, donation_id, donor, food, pickup, drop_loc, urgency, distance_km, distance_remaining, payout, status, pickupTime, dropTime, eta, assignedAt, volunteer_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [taskId, id, don.donor, don.food + ' - ' + don.qty, don.address.split(',')[0], 'Hope Shelter', 'high', 2.5, 2.5, '50 pts', 'active', 'Ready now', 'Deliver soon', 10, Date.now(), volunteerName]
        );
        db.run(`INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)`,
          ['TASK_ASSIGNED', '🚴 Volunteer Dispatched', `Volunteer ${volunteerName} assigned to pickup donation ${id}.`]
        );
      });
      
      // Simulate SMS to volunteer
      try {
        if (twilioClient && process.env.TWILIO_ACCOUNT_SID !== 'AC_MOCK_ACCOUNT_SID') {
          // get volunteer phone number
          db.get('SELECT u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE u.full_name = ?', [volunteerName], async (err, vol) => {
            if (vol && vol.mobile_number) {
              await twilioClient.messages.create({
                body: `Food For Hungry: You have a new pickup assigned! Order: ${id}. Please check your dashboard.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: vol.mobile_number
              });
            }
          });
        }
      } catch(e) {}
      
      res.json({ success: true, taskId });
    });
  });

  app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY assignedAt DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      res.json({ success: true, tasks: rows });
    });
  });

  app.post('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, donationId } = req.body;
    
    db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id], (err) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      
      if (status === 'pickup' && donationId) {
         db.run(`UPDATE donations SET status = 'Picked up', progress = 4 WHERE id = ?`, [donationId]);
      } else if (status === 'completed') {
         db.run(`UPDATE tasks SET distance_remaining = 0, eta = 0 WHERE id = ?`, [id]);
         if (donationId) {
           db.run(`UPDATE donations SET status = 'delivered', progress = 5 WHERE id = ?`, [donationId]);
           // Increment stats (assuming 20 portions = 20 meals)
           db.run(`INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)`,
             ['DELIVERY_COMPLETED', '✅ Delivery Completed', `Task ${id} has been delivered successfully.`]
           );
         }
      }
      res.json({ success: true });
    });
  });

  app.get('/api/stats', (req, res) => {
    // For demo, calculate from DB or hardcode
    db.get('SELECT COUNT(*) as total_donations FROM donations WHERE status = "delivered"', (err, row) => {
      const deliveredCount = row ? row.total_donations : 0;
      // Rough mock numbers based on deliveries
      res.json({
        success: true,
        stats: {
          mealsToday: 154 + (deliveredCount * 20),
          familiesServed: 32 + (deliveredCount * 5),
          avgPickupMins: 14,
          activeZones: 3
        }
      });
    });
  });

};
