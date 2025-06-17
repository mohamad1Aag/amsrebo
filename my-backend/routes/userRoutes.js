const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  facebookLogin,
  getUserProfile,
 updateUserProfile ,
 getAllUsers,
 deleteUser, 
} = require('../controllers/userController');
const protect = require('../middlewares/protect');
const adminProtect = require('../middlewares/adminProtect');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/auth/google', googleLogin);
router.post('/auth/facebook', facebookLogin);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', getAllUsers); // بدون تحقق
router.delete('/:id', protect, adminProtect, deleteUser);
router.put('/users/:id/points', userController.updateUserPoints);
module.exports = router;