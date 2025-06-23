const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// إعداد nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// تسجيل مستخدم
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء التسجيل" });
  }
};

// تسجيل دخول
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Google login
const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  let user = await User.findOne({ email });
  if (user && !user.googleId) {
    user.googleId = googleId;
    await user.save();
  } else if (!user) {
    user = await User.create({ name, email, googleId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Facebook login
const facebookLogin = async (req, res) => {
  const { email, name, facebookId } = req.body;

  let user = await User.findOne({ email });
  if (user && !user.facebookId) {
    user.facebookId = facebookId;
    await user.save();
  } else if (!user) {
    user = await User.create({ name, email, facebookId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// استعادة كلمة المرور
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'لا يوجد مستخدم بهذا البريد' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `https://your-frontend-url.com/reset-password/${token}`;

  try {
    await transporter.sendMail({
      to: email,
      subject: "إعادة تعيين كلمة المرور",
      html: `<p>انقر على الرابط التالي لإعادة تعيين كلمة المرور:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: 'تم إرسال الرابط إلى بريدك الإلكتروني' });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ message: "فشل إرسال البريد الإلكتروني" });
  }
};

// إرجاع الإيميل من التوكن
const getResetPasswordInfo = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    res.json({ email: user.email });
  } catch (error) {
    res.status(400).json({ message: 'الرابط غير صالح أو منتهي الصلاحية' });
  }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'تم إعادة تعيين كلمة المرور بنجاح' });
  } catch (err) {
    res.status(400).json({ message: 'الرابط غير صالح أو منتهي الصلاحية' });
  }
};

// بيانات المستخدم
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
  }
};

// تعديل البيانات
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  }
};

// حذف مستخدم
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    await user.deleteOne();
    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم" });
  }
};

// عرض جميع المستخدمين
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين" });
  }
};

// تحديث نقاط المستخدم
const updateUserPoints = async (req, res) => {
  const userId = req.params.id;
  const newPoint = req.body.point;

  if (typeof newPoint !== 'number' || newPoint < 0) {
    return res.status(400).json({ message: 'النقاط غير صالحة' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    user.point = newPoint;
    await user.save();

    res.status(200).json({ message: 'تم تحديث النقاط بنجاح', user });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  facebookLogin,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserPoints,
  forgotPassword,
  getResetPasswordInfo,
  resetPassword,
};
