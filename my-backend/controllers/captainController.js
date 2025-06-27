const Captain = require('../models/Captain');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// تسجيل كابتن جديد
exports.registerCaptain = async (req, res) => {
  const { name, phone, email, password } = req.body; // ✅ أضفنا email هنا

  // التحقق من الحقول المطلوبة
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول المطلوبة" });
  }

  try {
    // التحقق من وجود كابتن بنفس رقم الهاتف
    const existingCaptain = await Captain.findOne({ phone });
    if (existingCaptain) {
      return res.status(400).json({ message: "رقم الهاتف مسجل مسبقاً" });
    }

    // التحقق من وجود كابتن بنفس البريد الإلكتروني
    const existingEmail = await Captain.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء كابتن جديد
    const captain = new Captain({
      name,
      phone,
      email, // ✅ أضفنا البريد الإلكتروني هنا
      password: hashedPassword,
    });

    await captain.save();

    res.status(201).json({
      message: "تم التسجيل بنجاح",
      captainId: captain._id,
      name: captain.name,
    });
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
exports.uploadProfileImage = async (req, res) => {
  try {
    const captainId = req.params.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "لم يتم رفع أي صورة" });
    }

    const imageUrl = req.file.path;

    const captain = await Captain.findByIdAndUpdate(
      captainId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!captain) return res.status(404).json({ message: "الكابتن غير موجود" });

    return res.status(200).json({
      message: "تم رفع الصورة بنجاح",
      profileImage: imageUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getCaptainProfile = async (req, res) => {
  try {
    const captainId = req.captainId; // ✅ استخدم المعرف من التوكن

    const captain = await Captain.findById(captainId).select('-password');
    if (!captain) {
      return res.status(404).json({ message: 'الكابتن غير موجود' });
    }

    res.json(captain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
