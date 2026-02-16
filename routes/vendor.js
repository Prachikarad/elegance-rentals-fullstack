// routes/vendor.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Item = require('../models/Item');
const Order = require('../models/Order');
const vendorAuth = require('../middleware/vendorAuth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elegance-rentals-vendor',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// GET /api/vendor/stats - Dashboard stats
router.get('/stats', vendorAuth, async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.vendorId });
    const itemIds = items.map(i => i._id);
    const orders = await Order.find({ itemId: { $in: itemIds } });
    const totalEarnings = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      totalItems: items.length,
      totalOrders: orders.length,
      totalEarnings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vendor/items - Get vendor's outfits
router.get('/items', vendorAuth, async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.vendorId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vendor/items/add - Add new outfit
router.post('/items/add', vendorAuth, upload.single('image'), async (req, res) => {
  try {
    const body = req.body;
    const imagePath = req.file ? req.file.path : (body.image || '');
    const sizes = body.sizes ? body.sizes.split(',').map(s => s.trim()) : [];

    const item = new Item({
      name: body.name,
      price: Number(body.price) || 0,
      deposit: Number(body.deposit) || 0,
      image: imagePath,
      description: body.description || '',
      sizes,
      category: body.category || 'Uncategorized',
      vendorId: req.vendorId
    });

    await item.save();
    res.status(201).json({ message: 'Outfit added successfully!', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/vendor/items/:id - Update outfit
router.put('/items/:id', vendorAuth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!item) return res.status(404).json({ message: 'Outfit not found' });

    const body = req.body;
    const update = {
      name: body.name || item.name,
      price: Number(body.price) || item.price,
      deposit: Number(body.deposit) || item.deposit,
      category: body.category || item.category,
      description: body.description || item.description
    };

    if (body.sizes) update.sizes = body.sizes.split(',').map(s => s.trim());
    if (body.image) update.image = body.image;

    const updated = await Item.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: 'Outfit updated!', item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/vendor/items/:id - Delete outfit
router.delete('/items/:id', vendorAuth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!item) return res.status(404).json({ message: 'Outfit not found' });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Outfit deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vendor/orders - Get orders for vendor's outfits
router.get('/orders', vendorAuth, async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.vendorId });
    const itemIds = items.map(i => i._id);
    const orders = await Order.find({ itemId: { $in: itemIds } })
      .populate('itemId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;