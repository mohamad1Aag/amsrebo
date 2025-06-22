const Captain = require('../models/Captain');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// تسجيل كابتن جديد
exports.registerCaptain = async (req, res) => {
    const { name, phone, password } = req.body;
  
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول المطلوبة" });
    }
  
    try {
      // التحقق من وجود كابتن بنفس رقم الهاتف
      const existingCaptain = await Captain.findOne({ phone });
      if (existingCaptain) {
        return res.status(400).json({ message: "رقم الهاتف مسجل مسبقاً" });
      }
  
      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // إنشاء كابتن جديد
      const captain = new Captain({ name, phone, password: hashedPassword });
      await captain.save();
  
      res.status(201).json({ message: "تم التسجيل بنجاح", captainId: captain._id, name: captain.name });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// تسجيل دخول الكابتن
exports.loginCaptain = async (req, res) => {
    const { phone, password } = req.body;
  
    try {
      const captain = await Captain.findOne({ phone });
      if (!captain) return res.status(404).json({ message: 'الكابتن غير موجود' });
  
      const match = await bcrypt.compare(password, captain.password);
      if (!match) return res.status(400).json({ message: 'كلمة المرور خاطئة' });
  
      // إنشاء توكن JWT مع تضمين اسم الكابتن
      const token = jwt.sign(
        { id: captain._id, name: captain.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.json({ token, name: captain.name, phone: captain.phone });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// تحديث موقع الكابتن الحالي
exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const captain = await Captain.findByIdAndUpdate(
      req.captainId,
      { currentLocation: { lat, lng } },
      { new: true }
    );

    if (!captain) return res.status(404).json({ message: 'الكابتن غير موجود' });

    res.json(captain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
