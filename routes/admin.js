// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
// POST /api/admin/login  -> Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Not an admin account' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        username: admin.username,
        role: admin.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// multer storage -> save to public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random()*1e9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// POST /api/admin/items/add  (multipart/form-data) -> {name, price, deposit, category, description, sizes, image(file)}
router.post('/items/add', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const body = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : (body.image || '');
    const sizes = body.sizes ? body.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S','M','L'];
    const item = new Item({
      name: body.name,
      price: Number(body.price) || 0,
      deposit: Number(body.deposit) || 0,
      image: imagePath,
      description: body.description || '',
      sizes,
      category: body.category || 'Uncategorized'
    });
    await item.save();
    res.status(201).json({ message: 'Item added', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/items -> list all items
router.get('/items', adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/items/:id -> update
router.put('/items/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const body = req.body;
    if (body.name) item.name = body.name;
    if (body.price) item.price = Number(body.price);
    if (body.deposit) item.deposit = Number(body.deposit);
    if (body.description) item.description = body.description;
    if (body.category) item.category = body.category;
    if (body.sizes) item.sizes = body.sizes.split(',').map(s => s.trim());
    if (req.file) item.image = '/uploads/' + req.file.filename;
    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/items/:id
router.delete('/items/:id', adminAuth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders -> list all orders (admin)
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('itemId').populate('userId', 'username');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;