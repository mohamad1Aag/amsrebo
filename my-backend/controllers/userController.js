const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// تسجيل مستخدم عادي
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
    token: generateToken(user._id),
  });
};

// تسجيل دخول عبر Google
const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    // إذا موجود فقط تأكد من تخزين googleId
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    user = await User.create({ name, email, googleId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// تسجيل دخول عبر Facebook
const facebookLogin = async (req, res) => {
  const { email, name, facebookId } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    if (!user.facebookId) {
      user.facebookId = facebookId;
      await user.save();
    }
  } else {
    user = await User.create({ name, email, facebookId });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

const logoutUser = async (req, res) => {
  res.json({ message: 'User logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser, googleLogin, facebookLogin };
