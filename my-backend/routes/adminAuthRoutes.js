// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, updateAdminRole , getAllAdmins , updateAdminProfile  } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middlewares/authadminMiddleware');

// مسارات غير محمية
router.post('/register', register);
router.post('/login', login);
router.patch('/update-role/:id', protectAdmin, updateAdminRole);
router.get('/all', protectAdmin, getAllAdmins);
router.put('/profile', protectAdmin, updateAdminProfile);  // تعديل بيانات الأدمن (باستثناء الدور)


module.exports = router;
