// routes/vendorAuth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');
const JWT_SECRET = process.env.JWT_SECRET || 'UNIFIED_SECRET_KEY';

// POST /api/vendor-auth/register
router.post('/register', async (req, res) => {
  try {
    const { shopName, email, password, phone, address } = req.body;

    if (!shopName || !email || !password) {
      return res.status(400).json({ message: 'Shop name, email and password are required' });
    }

    // Check if vendor already exists
    const existing = await Vendor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor
    const vendor = new Vendor({
      shopName,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || ''
    });

    await vendor.save();

    // Generate token
    const token = jwt.sign(
      { id: vendor._id, isVendor: true, shopName: vendor.shopName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      vendor: {
        id: vendor._id,
        shopName: vendor.shopName,
        email: vendor.email
      }
    });
  } catch (err) {
    console.error('VENDOR REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vendor-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find vendor
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: vendor._id, isVendor: true, shopName: vendor.shopName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      vendor: {
        id: vendor._id,
        shopName: vendor.shopName,
        email: vendor.email
      }
    });
  } catch (err) {
    console.error('VENDOR LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;