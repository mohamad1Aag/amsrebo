const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
// تسجيل الدخول
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'البريد غير موجود' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

    // ✅ تضمين الدور داخل التوكن
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'تم تسجيل الدخول بنجاح', token });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};

// تسجيل أدمن جديد
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'البريد مسجل مسبقًا' });

    // ✅ لا حاجة لتحديد role لأنه تلقائيًا "admin"
    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'تم إنشاء الأدمن بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};

// تحديث دور أدمن (من miniadmin إلى admin)
exports.updateAdminRole = async (req, res) => {
  try {
    // فقط الأدمن الكامل يستطيع تعديل الدور
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل الدور' });
    }

    const adminId = req.params.id;
    const { role } = req.body;

    if (!['admin', 'miniadmin'].includes(role)) {
      return res.status(400).json({ message: 'الدور غير صالح' });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { role },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'الأدمن غير موجود' });
    }

    res.status(200).json({ message: 'تم تحديث الدور بنجاح', updatedAdmin });

  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: err.message });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};
