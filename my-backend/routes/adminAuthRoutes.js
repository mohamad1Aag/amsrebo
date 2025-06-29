// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, updateAdminRole , getAllAdmins  } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middlewares/authadminMiddleware');

// مسارات غير محمية
router.post('/register', register);
router.post('/login', login);
router.patch('/update-role/:id', protectAdmin, updateAdminRole);
router.get('/all', protectAdmin, getAllAdmins);
// مثال على راوت محمي (مثلاً لجلب ملف الأدمن الشخصي)
router.get('/profile', protectAdmin, (req, res) => {
  res.json(req.admin); // تم جلب البيانات من داخل الميدل وير
});

module.exports = router;
