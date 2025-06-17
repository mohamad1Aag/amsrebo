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
  // لو كنت تستخدم JWT مع cookies
  res.clearCookie("token");

  // رجّع رسالة بسيطة
  res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // افترض إنك تستخدم Middleware للتحقق من التوكن وتحط بيانات المستخدم في req.user
    const user = await User.findById(userId).select('-password'); // استبعد كلمة السر من البيانات

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // بيانات المستخدم من التوكن
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // تحديث الحقول حسب المدخلات (مثلاً: name و email و password)
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
      token: generateToken(user._id), // تحديث التوكن بعد التعديل
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // نستثني كلمات المرور
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
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم" });
  }
};

// تحديث نقاط المستخدم
const updateUserPoints = async (req, res) => {
  const userId = req.params.id;
  const newPoints = req.body.points; // تأكد أن المفتاح هنا هو نفسه الذي ترسله من الفرونت

  if (typeof newPoints !== 'number' || newPoints < 0) {
    return res.status(400).json({ message: 'النقاط غير صالحة' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    user.points = newPoints; // تأكد أن اسم الحقل في النموذج هو "points"
    await user.save();

    res.status(200).json({ message: 'تم تحديث النقاط بنجاح', user });
  } catch (err) {
    console.error(err); // للمساعدة في تتبع الخطأ أثناء التطوير
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};





module.exports ={updateUserPoints, registerUser, loginUser, logoutUser, googleLogin, facebookLogin ,getUserProfile,updateUserProfile, getAllUsers,deleteUser};
