// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middlewares/authadminMiddleware');

// مسارات غير محمية
router.post('/register', register);
router.post('/login', login);

// مثال على راوت محمي (مثلاً لجلب ملف الأدمن الشخصي)
router.get('/profile', protectAdmin, (req, res) => {
  res.json(req.admin); // تم جلب البيانات من داخل الميدل وير
});

module.exports = router;
