// routes/orders.js - User order routes
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// POST /api/orders/create - Create new order (user checkout)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
      itemId,
      customerName,
      mobile,
      address,
      pincode,
      paymentMethod,
      totalDays,
      totalRent,
      discount,
      finalAmount,
      startDate,
      endDate
    } = req.body;

    // Validation
    if (!itemId || !customerName || !mobile || !address || !pincode || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      itemId: itemId,
      customerName,
      mobile,
      address,
      pincode,
      paymentMethod,
      totalDays: totalDays || 1,
      totalRent: totalRent || 0,
      discount: discount || 0,
      totalAmount: finalAmount || 0,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: order
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/my-orders - Get user's orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('itemId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;