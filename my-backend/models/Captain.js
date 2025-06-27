const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' }, // ✅ صورة الملف الشخصي
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Captain', captainSchema);
