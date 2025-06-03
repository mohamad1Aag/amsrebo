const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  facebookLogin
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/auth/google', googleLogin);
router.post('/auth/facebook', facebookLogin);

module.exports = router;
