const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'ليس مصرح لك، فشل التحقق من التوكن' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'ليس مصرح لك، لا يوجد توكن' });
  }
};

module.exports = protect;
