const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Token not provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    req.user = admin; // ✅ حتى يشتغل adminProtect بدون تعديل إضافي
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protectAdmin };
