const express = require('express');
const router = express.Router();
const { createUser, findUserByMobile } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

router.post('/register', async (req, res) => {
  try {
    const { mobile, email, password } = req.body;
    if (!mobile || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await findUserByMobile(mobile);
    if (existingUser) return res.status(400).json({ error: 'Mobile already registered' });

    const passwordHash = await hashPassword(password);
    await createUser(mobile, email, passwordHash);

    res.json({ message: 'Registration successful. Wait for admin approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await findUserByMobile(mobile);
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.Status !== 'Approved') return res.status(403).json({ error: 'User not approved yet' });

    const match = await comparePassword(password, user.PasswordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user.UserID, mobile: user.MobileNumber });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
