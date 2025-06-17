const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  
  if (!token) return res.status(401).json({ message: 'Token not provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'ليس لديك صلاحية للوصول' });
    }

    req.user = admin; // تخزين بيانات الأدمن في req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protectAdmin };
