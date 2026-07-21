module.exports = function(app, pool, twilioClient, transporter, io) {
  
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
  async function generateVolunteerId() {
    const res = await pool.query('SELECT COUNT(*) as count FROM volunteers');
    const count = parseInt(res.rows[0].count) + 1;
    const idStr = String(count).padStart(5, '0');
    return `VOL-TN-2026-${idStr}`;
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
      const ngosRes = await pool.query('SELECT * FROM ngos');
      const ngos = ngosRes.rows;
      
      let nearestNgo = ngos[0];
      let minDistance = Infinity;

      if (ngos.length > 0) {
        ngos.forEach(ngo => {
          const dist = getDistanceFromLatLonInKm(lat, lng, ngo.lat, ngo.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestNgo = ngo;
          }
        });
      } else {
         nearestNgo = { id: 1, name: 'Helping Hands NGO Tambaram', email: 'admin@ffh.com' };
      }

      // Insert into Users
      const userRes = await pool.query(
        `INSERT INTO users (full_name, email, mobile_number, role) VALUES ($1, $2, $3, 'volunteer') RETURNING id`,
        [fullName, email, phone]
      );
      
      const userId = userRes.rows[0].id;

      // Insert into Volunteers
      await pool.query(
        `INSERT INTO volunteers 
         (user_id, volunteer_id, address, district, taluk, skills, languages, preferred_service, lat, lng, assigned_ngo_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending Verification')`,
        [userId, volunteerId, address, district, taluk, JSON.stringify(skills), JSON.stringify(languages), preferredService, lat, lng, nearestNgo.id]
      );

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
      try {
        await pool.query(`INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3)`,
          ['NEW_VOLUNTEER', '🔔 New Volunteer Registered', `${fullName} from ${district} assigned to ${nearestNgo.name}. Pending Approval.`]
        );
        if (io) io.emit('new_notification', { type: 'NEW_VOLUNTEER' });
      } catch(e) {}

      // STEP 6: Send SMS to Volunteer
      try {
        if (twilioClient && process.env.TWILIO_ACCOUNT_SID !== 'AC_MOCK_ACCOUNT_SID') {
          // Send directly using Messages API (not Verify API)
          await twilioClient.messages.create({
            body: `Food For Hungry\nYour volunteer application received.\nID: ${volunteerId}\nNearest NGO: ${nearestNgo.name}\nTrack status inside the app.`,
            from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
            to: phone.startsWith('+91') ? phone : '+91' + phone
          });
        }
      } catch(e) { 
        console.error("Twilio SMS failed (likely trial restriction)", e.message); 
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });

  // STEP 7 & 8: Approve Workflow
  app.post('/api/volunteers/approve', async (req, res) => {
    try {
      const { volunteerId } = req.body;
      const vRes = await pool.query('SELECT v.*, u.email, u.full_name, u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE v.volunteer_id = $1', [volunteerId]);
      
      if (vRes.rows.length === 0) return res.status(404).json({ error: 'Volunteer not found' });
      const row = vRes.rows[0];

      await pool.query('UPDATE volunteers SET status = $1 WHERE volunteer_id = $2', ['Approved', volunteerId]);
      
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
      try {
        await pool.query(`INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3)`,
          ['VOLUNTEER_APPROVED', '✅ Volunteer Approved', `${row.full_name} (${row.volunteer_id}) has been approved.`]
        );
        if (io) io.emit('new_notification', { type: 'VOLUNTEER_APPROVED' });
      } catch(e) {}
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  // STEP 9: NGO Dashboard
  app.get('/api/ngos/dashboard', async (req, res) => {
    try {
      const ngoId = req.query.ngoId || 1;
      const vRes = await pool.query('SELECT v.*, u.full_name, u.email, u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE v.assigned_ngo_id = $1 ORDER BY v.created_at DESC', [ngoId]);
      const volunteers = vRes.rows;
      
      const pending = volunteers.filter(v => v.status === 'Pending Verification');
      const approved = volunteers.filter(v => v.status === 'Approved');
      const rejected = volunteers.filter(v => v.status === 'Rejected');

      res.json({
        success: true,
        stats: { pending: pending.length, approved: approved.length, rejected: rejected.length },
        volunteers: volunteers
      });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  // STEP 10: Notification Center
  app.get('/api/notifications', async (req, res) => {
    try {
      const notRes = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
      res.json({ success: true, notifications: notRes.rows });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  // -- MAP ENDPOINTS (NGOs, Volunteers, SOS Requests) --
  app.get('/api/ngos', async (req, res) => {
    try {
      const ngoRes = await pool.query('SELECT * FROM ngos');
      res.json({ success: true, ngos: ngoRes.rows });
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get('/api/volunteers', async (req, res) => {
    try {
      // Return verified active volunteers
      const volRes = await pool.query(`
        SELECT v.id, v.volunteer_id, v.lat, v.lng, v.status, u.full_name as name 
        FROM volunteers v 
        JOIN users u ON v.user_id = u.id 
        WHERE v.status IN ('Approved', 'Available', 'Delivering')
      `);
      res.json({ success: true, volunteers: volRes.rows });
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get('/api/sos-requests', async (req, res) => {
    try {
      const sosRes = await pool.query('SELECT * FROM sos_requests ORDER BY created_at DESC');
      res.json({ success: true, requests: sosRes.rows });
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post('/api/sos-requests', async (req, res) => {
    try {
      const { name, loc, people_count, urgent, lat, lng } = req.body;
      const sosRes = await pool.query(`
        INSERT INTO sos_requests (name, loc, people_count, urgent, lat, lng)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `, [name || 'Anonymous', loc, people_count || 10, urgent === true, lat, lng]);
      
      if (io) {
        io.emit('new_notification', { type: 'NEW_SOS' });
        io.emit('sos_requests_updated');
      }
      res.json({ success: true, request: sosRes.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  // -- NEW: DONATIONS & WORKFLOW --

  app.post('/api/donations', async (req, res) => {
    try {
      const d = req.body;
      const randomId = 'DON-' + Math.floor(1000 + Math.random() * 9000);
      await pool.query(`INSERT INTO donations (id, donor, food, qty, category, prepTime, bestBefore, storage, address, contact, window, packaging, ngo_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [randomId, d.donor || 'Self', d.foodTitle, d.qty + ' ' + (d.unit || 'Portions'), d.category, d.prepTime, d.bestBefore, d.storage, d.address, d.contact, d.window, d.packaging, 1]
      );
      
      res.json({ success: true, id: randomId });
      
      try {
        await pool.query(`INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3)`,
          ['NEW_DONATION', '📦 New Food Donation', `A new surplus donation of ${d.foodTitle} (${d.qty}) has been listed in ${d.address}.`]
        );
        if (io) io.emit('new_notification', { type: 'NEW_DONATION' });
        if (io) io.emit('donations_updated');
      } catch(e) {}
    } catch (err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get('/api/donations', async (req, res) => {
    try {
      const donRes = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
      res.json({ success: true, donations: donRes.rows });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post('/api/donations/:id/accept', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query(`UPDATE donations SET status = 'accepted', progress = 2 WHERE id = $1`, [id]);
      if (io) io.emit('donations_updated');
      res.json({ success: true });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post('/api/donations/:id/dispatch', async (req, res) => {
    try {
      const { id } = req.params;
      const { volunteerName } = req.body; 
      
      const donRes = await pool.query('SELECT * FROM donations WHERE id = $1', [id]);
      if (donRes.rows.length === 0) return res.status(404).json({ error: 'Donation not found' });
      const don = donRes.rows[0];
      
      const taskId = 'TSK-' + Math.floor(100 + Math.random() * 900);
      
      await pool.query(`UPDATE donations SET status = 'Volunteer Assigned', progress = 3, volunteer_name = $1 WHERE id = $2`, [volunteerName, id]);
      
      await pool.query(`INSERT INTO tasks (id, donation_id, donor, food, pickup, drop_loc, urgency, distance_km, distance_remaining, payout, status, pickupTime, dropTime, eta, assignedAt, volunteer_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, $15)`,
        [taskId, id, don.donor, don.food + ' - ' + don.qty, don.address.split(',')[0], 'Hope Shelter', 'high', 2.5, 2.5, '50 pts', 'active', 'Ready now', 'Deliver soon', 10, volunteerName]
      );
      
      await pool.query(`INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3)`,
        ['TASK_ASSIGNED', '🚴 Volunteer Dispatched', `Volunteer ${volunteerName} assigned to pickup donation ${id}.`]
      );
      
      if (io) {
        io.emit('new_notification', { type: 'TASK_ASSIGNED' });
        io.emit('tasks_updated');
        io.emit('donations_updated');
      }
      
      // Simulate SMS to volunteer
      try {
        if (twilioClient && process.env.TWILIO_ACCOUNT_SID !== 'AC_MOCK_ACCOUNT_SID') {
          const volRes = await pool.query('SELECT u.mobile_number FROM volunteers v JOIN users u ON v.user_id = u.id WHERE u.full_name = $1', [volunteerName]);
          if (volRes.rows.length > 0 && volRes.rows[0].mobile_number) {
            await twilioClient.messages.create({
              body: `Food For Hungry: You have a new pickup assigned! Order: ${id}. Please check your dashboard.`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: volRes.rows[0].mobile_number
            });
          }
        }
      } catch(e) {}
      
      res.json({ success: true, taskId });
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get('/api/tasks', async (req, res) => {
    try {
      const taskRes = await pool.query('SELECT * FROM tasks ORDER BY assignedAt DESC');
      res.json({ success: true, tasks: taskRes.rows });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post('/api/tasks/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, donationId } = req.body;
      
      await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [status, id]);
      
      if (status === 'pickup' && donationId) {
         await pool.query(`UPDATE donations SET status = 'Picked up', progress = 4 WHERE id = $1`, [donationId]);
      } else if (status === 'completed') {
         await pool.query(`UPDATE tasks SET distance_remaining = 0, eta = 0 WHERE id = $1`, [id]);
         if (donationId) {
           await pool.query(`UPDATE donations SET status = 'delivered', progress = 5 WHERE id = $1`, [donationId]);
           // Increment stats (assuming 20 portions = 20 meals)
           await pool.query(`INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3)`,
             ['DELIVERY_COMPLETED', '✅ Delivery Completed', `Task ${id} has been delivered successfully.`]
           );
           if (io) io.emit('new_notification', { type: 'DELIVERY_COMPLETED' });
         }
      }
      if (io) io.emit('tasks_updated');
      if (io && donationId) io.emit('donations_updated');
      res.json({ success: true });
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const countRes = await pool.query("SELECT COUNT(*) as total_donations FROM donations WHERE status = 'delivered'");
      const deliveredCount = parseInt(countRes.rows[0].total_donations) || 0;
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
    } catch(err) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

};
