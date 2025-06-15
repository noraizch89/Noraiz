const express = require('express');
const router = express.Router();
const { approveUser } = require('../models/userModel');

// Note: You should protect this route with admin authentication in production

router.get('/pending-users', async (req, res) => {
  const pool = require('../config/db').poolPromise;
  const sql = require('../config/db').sql;
  try {
    const poolCon = await pool;
    const result = await poolCon.request()
      .query(`SELECT UserID, MobileNumber, Email FROM Users WHERE Status = 'Pending'`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/approve/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await approveUser(userId);
    res.json({ message: `User ${userId} approved.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
