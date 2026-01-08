// models/Order.js
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
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['upi', 'card', 'cod']
  },
  totalDays: {
    type: Number,
    required: true
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
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'delivered', 'returned', 'cancelled']
  },
  size: { type: String }, // Keep this for compatibility
  discountApplied: { type: Number, default: 0 } // Keep this for compatibility
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);