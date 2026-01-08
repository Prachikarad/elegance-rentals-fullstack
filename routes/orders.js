// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/Item");
const { authMiddleware } = require("../middleware/auth");

// POST /api/orders/create - Create new order with checkout details
router.post("/create", authMiddleware, async (req, res) => {
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
      return res.status(400).json({ message: "All fields are required" });
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
      status: "pending"
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: order
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/my-orders - Get user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("itemId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// OLD ROUTE - Keep for backward compatibility
router.post('/rent', authMiddleware, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    if (!itemId) return res.status(400).json({ message: 'itemId required' });
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const prevOrders = await Order.find({ userId: req.userId }).limit(1);
    const isFirstOrder = prevOrders.length === 0;
    const discount = isFirstOrder ? 50 : 0;
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

// OLD ROUTE - Keep for backward compatibility
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('itemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;