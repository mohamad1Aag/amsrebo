const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  facebookLogin,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserPoints,
  forgotPasswordByUsername,
  getResetPasswordInfo,
  resetPassword,
  updateUserWallet,
  getUserById,
  updatecartUserPoints,
} = require('../controllers/userController');

const protect = require('../middlewares/protect');
const { protectAdmin } = require('../middlewares/authadminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/auth/google', googleLogin);
router.post('/auth/facebook', facebookLogin);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', getAllUsers);
router.delete('/:id', protectAdmin, deleteUser);
router.patch('/:id/points', protectAdmin, updateUserPoints);
router.patch('/pointcart/:id/points', protect, updatecartUserPoints);
// استعادة كلمة المرور
router.post('/forgot-password-by-username', forgotPasswordByUsername);

router.get("/reset-password-info/:token", getResetPasswordInfo);


router.patch('/:id/wallet', protect, updateUserWallet);
router.get('/:id', protect, getUserById);
module.exports = router;
