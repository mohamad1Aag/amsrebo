const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PointHistory = require('../models/PointHistory');

// إعداد الإرسال عبر nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// تسجيل مستخدم عادي
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء التسجيل" });
  }
};

// تسجيل دخول عادي
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
    phone: user.phone,
    token: generateToken(user._id),
  });
};

// تسجيل دخول عبر Google
const googleLogin = async (req, res) => {
  const { email, name, googleId, phone } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    user = await User.create({ name, email, phone, googleId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

// تسجيل دخول عبر Facebook
const facebookLogin = async (req, res) => {
  const { email, name, facebookId, phone } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    if (!user.facebookId) {
      user.facebookId = facebookId;
      await user.save();
    }
  } else {
    user = await User.create({ name, email, phone, facebookId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error("حدث خطأ أثناء جلب المستخدمين:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    await user.deleteOne();
    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم" });
  }
};

const updateUserPoints = async (req, res) => {
  const userId = req.params.id;
  const finalPoints = req.body.points; // النقاط النهائية

  if (typeof finalPoints !== 'number' || finalPoints < 0) {
    return res.status(400).json({ message: 'النقاط غير صالحة' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const oldPoints = user.point || 0;
    const pointsDifference = finalPoints - oldPoints;

    user.point = finalPoints;
    await user.save();

    // فقط إذا كانت هناك فرق نقاط نسجلها
    if (pointsDifference !== 0) {
      await PointHistory.create({
        userId,
        pointsChanged: pointsDifference,
        type: pointsDifference > 0 ? 'شحن نقاط' : 'خصم نقاط',
        description: pointsDifference > 0 ? 'تم شحن النقاط' : 'تم خصم النقاط',
      });
    }

    res.status(200).json({ message: 'تم تحديث النقاط بنجاح', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};




const forgotPasswordByUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ name: username });
    if (!user) return res.status(404).json({ message: 'اسم المستخدم غير موجود' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `https://your-frontend-url.com/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "إعادة تعيين كلمة المرور",
      html: `<p>انقر على الرابط التالي لإعادة تعيين كلمة المرور:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ message: "فشل إرسال البريد الإلكتروني" });
  }
};

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

const updateUserWallet = async (req, res) => {
  const userId = req.params.id;
  const { amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.wallet + amount < 0) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet += amount;
    await user.save();

    res.json({ message: 'Wallet updated successfully', wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatecartUserPoints = async (req, res) => {
  const userId = req.params.id;
  const newPoint = req.body.point;

  if (typeof newPoint !== 'number' || newPoint < 0) {
    return res.status(400).json({ message: 'النقاط غير صالحة' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const pointsDifference = newPoint - user.point;

    user.point = newPoint;
    await user.save();

    if (pointsDifference < 0) {
      await PointHistory.create({
        userId,
        pointsChanged: pointsDifference,
        type: 'خصم نقاط شراء',
        description: 'تم خصم النقاط بعد تأكيد طلب الشراء',
      });
    }

    res.status(200).json({ message: 'تم تحديث النقاط بنجاح', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

const getUserPointHistory = async (req, res) => {
  const userId = req.params.id;
  try {
    const history = await PointHistory.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

const addPointsToUser = async (req, res) => {
  try {
    const { userId, points, description } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    user.point = (user.point || 0) + points;
    await user.save();

    const history = new PointHistory({
      userId,
      pointsChanged: points,
      type: points > 0 ? 'شحن نقاط' : 'خصم نقاط',
      description: description || (points > 0 ? 'تم شحن النقاط' : 'تم خصم النقاط')
    });
    await history.save();

    res.status(200).json({ success: true, message: 'تم تحديث النقاط وتسجيل العملية في السجل' });
  } catch (error) {
    console.error('خطأ في شحن النقاط:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر' });
  }
};

module.exports = {
  updateUserPoints,
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  facebookLogin,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  forgotPasswordByUsername,
  getResetPasswordInfo,
  updateUserWallet,
  getUserById,
  updatecartUserPoints,
  getUserPointHistory,
  addPointsToUser
};
