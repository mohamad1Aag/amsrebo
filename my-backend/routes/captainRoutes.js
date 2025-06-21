const express = require('express');
const router = express.Router();
const authCaptain = require('../middlewares/authCaptain');
const captainController = require('../controllers/captainController');

// راوتات التسجيل والدخول
router.post('/register', captainController.registerCaptain);
router.post('/login', captainController.loginCaptain);

// راوت محمي لتحديث الموقع
router.put('/location', authCaptain, captainController.updateLocation);

module.exports = router;
