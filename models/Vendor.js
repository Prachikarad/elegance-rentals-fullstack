// models/Vendor.js
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, default: 'vendor' }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);