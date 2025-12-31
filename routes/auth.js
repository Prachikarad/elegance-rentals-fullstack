// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET } = require('../middleware/auth'); // SECRET for sign
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register - returns 201 on success
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Enter both fields!' });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists!' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await new User({ username, password: hashed }).save();
    return res.status(201).json({ message: 'Registered successfully!' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Login - returns token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Enter both fields!' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found!' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '8h' });
    return res.json({ message: 'Login successful!', token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Protected endpoint to get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
