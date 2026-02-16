// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null }
  name: { type: String, required: true },
  price: { type: Number, required: true },         // price per day
  image: { type: String, required: true },
  description: { type: String, default: '' },
  sizes: { type: [String], default: ['S','M','L'] },
  deposit: { type: Number, default: 0 },
  category: { type: String, default: 'Uncategorized' }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
