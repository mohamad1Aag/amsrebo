const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // احذف إذا ما في مستخدمين
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
