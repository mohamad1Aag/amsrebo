const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // تأكد أن decoded يحتوي على الحقول المطلوبة
      req.user = decoded;  // يحتوي على id و role و email لو موجودة
      next();
    } catch (error) {
      return res.status(401).json({ message: 'توكن غير صالح' });
    }
  } else {
    return res.status(401).json({ message: 'غير مصرح' });
  }
};

module.exports = protect;
