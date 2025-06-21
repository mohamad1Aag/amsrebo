// middleware/authCaptain.js
const jwt = require('jsonwebtoken');

function authCaptain(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'غير مصرح' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'غير مصرح' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.captainId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'توكن غير صالح' });
  }
}

module.exports = authCaptain;
