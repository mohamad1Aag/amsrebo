const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  image: { type: String }, // رابط الصورة من Cloudinary
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
