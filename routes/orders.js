const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

    if (!itemId || !customerName || !mobile || !address || !pincode || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedOrderData = {
      userId: req.userId,
      itemId,
      customerName,
      mobile,
      address,
      pincode,
      paymentMethod,
      totalDays: totalDays || 1,
      totalRent: totalRent || 0,
      discount: discount || 0,
      totalAmount: Number(finalAmount) || 0,
      startDate: startDate || new Date(),
      endDate: endDate || new Date()
    };

    if (paymentMethod === 'cod') {
      const order = await Order.create({
        ...normalizedOrderData,
        status: 'pending',
        paymentStatus: 'pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (COD)',
        order
      });
    }

    if (!normalizedOrderData.totalAmount || normalizedOrderData.totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(normalizedOrderData.totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(req.userId),
        itemId: String(itemId),
        paymentMethod
      }
    });

    return res.status(201).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details missing' });
    }

    if (!orderData) {
      return res.status(400).json({ success: false, message: 'Order data missing' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.create({
      userId: req.userId,
      itemId: orderData.itemId,
      customerName: orderData.customerName,
      mobile: orderData.mobile,
      address: orderData.address,
      pincode: orderData.pincode,
      paymentMethod: orderData.paymentMethod,
      totalDays: orderData.totalDays || 1,
      totalRent: orderData.totalRent || 0,
      discount: orderData.discount || 0,
      totalAmount: Number(orderData.finalAmount) || 0,
      startDate: orderData.startDate || new Date(),
      endDate: orderData.endDate || new Date(),
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'confirmed'
    });

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('itemId')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
