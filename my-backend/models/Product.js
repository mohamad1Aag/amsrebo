const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true },
  },
  priceRetail: { type: Number, required: true }, // سعر المفرق
  priceWholesale: { type: Number, required: true }, // سعر الجملة
  description: {
    ar: { type: String },
    en: { type: String },
  },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  image: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
