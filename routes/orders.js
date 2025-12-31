// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

// POST /api/orders/rent
// Body: { itemId, size }
// Requires Bearer token -> authMiddleware populates req.userId
router.post('/rent', authMiddleware, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    if (!itemId) return res.status(400).json({ message: 'itemId required' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if user has previous orders
    const prevOrders = await Order.find({ userId: req.userId }).limit(1);
    // first-order discount rule:
    // if no previous orders -> discount 50 (or 50 rupees) or percentage as you like
    const isFirstOrder = prevOrders.length === 0;
    const discount = isFirstOrder ? 50 : 0; // example: ₹50 off first order

    // compute total (simple: price + deposit - discount)
    const total = item.price + (item.deposit || 0) - discount;

    const order = new Order({
      userId: req.userId,
      itemId: item._id,
      size: size || null,
      totalAmount: total,
      discountApplied: discount
    });

    await order.save();
    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Optional: GET /api/orders/my -> list user's orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('itemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
