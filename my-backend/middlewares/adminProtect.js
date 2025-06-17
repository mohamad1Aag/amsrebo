const adminProtect = (req, res, next) => {
    if (req.user && req.user.role === 'admin') { // أو 'الأدمن' حسب الحقل عندك
      next();
    } else {
      res.status(403).json({ message: 'ممنوع، فقط الأدمن يمكنه الوصول لهذه الصفحة' });
    }
  };
  
  module.exports = adminProtect;
  