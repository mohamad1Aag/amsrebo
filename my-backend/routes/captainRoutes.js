const express = require('express');
const router = express.Router();
const {upload } = require('../middlewares/cloudinary');
const authCaptain = require('../middlewares/authCaptain');
const captainController = require('../controllers/captainController');

// راوتات التسجيل والدخول
router.post('/register', captainController.registerCaptain);
router.post('/login', captainController.loginCaptain);

// راوت محمي لتحديث الموقع
router.put('/location', authCaptain, captainController.updateLocation);
router.put('/upload-profile/:id', upload.single('image'), captainController.uploadProfileImage);
// راوت لجلب بيانات الكابتن (بروفايل) مع التحقق من التوكن
router.get('/profile', authCaptain, captainController.getCaptainProfile);
router.get('/by-name/:name', captainController.getCaptainByName);
router.patch("/:captainId/status", captainController.updateCaptainStatus);

module.exports = router;
