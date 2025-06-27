const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  point: {
    type: Number,
    min: [0, 'يجب أن تكون النقاط رقمًا موجبًا'],
    default: 0,    // نقطة البداية لكل مستخدم جديد
  }, 
  password: { type: String },  // مش لازم كلمة مرور لو Google أو Facebook
  googleId: { type: String },  // لتخزين ID من Google
  facebookId: { type: String } // لتخزين ID من Facebook
}, { timestamps: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = user;
