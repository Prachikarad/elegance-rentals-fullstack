// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  size: { type: String },
  totalAmount: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
