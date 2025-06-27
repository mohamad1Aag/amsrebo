const express = require('express');
const router = express.Router();
const upload = require('../middlewares/cloudinary');
const authCaptain = require('../middlewares/authCaptain');
const captainController = require('../controllers/captainController');

// راوتات التسجيل والدخول
router.post('/register', captainController.registerCaptain);
router.post('/login', captainController.loginCaptain);

// راوت محمي لتحديث الموقع
router.put('/location', authCaptain, captainController.updateLocation);
router.put('/upload-profile/:id', upload.single('image'), captainController.uploadProfileImage);

module.exports = router;
