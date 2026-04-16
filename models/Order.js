const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },

  customerName: {
    type: String,
    required: true,
    trim: true
  },

  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
  },

  address: {
    type: String,
    required: true
  },

  pincode: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"]
  },

  paymentMethod: {
    type: String,
    required: true,
    enum: ['upi', 'card', 'cod']
  },

  // 🔥 NEW (Payment Tracking)
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },

  razorpayOrderId: {
    type: String
  },

  razorpayPaymentId: {
    type: String
  },

  // Rental Details
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },

  totalRent: {
    type: Number,
    required: true
  },

  discount: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  // Order Lifecycle
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'delivered', 'returned', 'cancelled']
  },

  size: {
    type: String
  },

  // For compatibility / future use
  discountApplied: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);