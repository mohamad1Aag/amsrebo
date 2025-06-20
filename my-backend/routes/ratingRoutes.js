const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// إضافة تقييم
router.post('/ratings', ratingController.createRating);

// جلب تقييمات منتج
router.get('/ratings/:productId', ratingController.getRatingsByProduct);

// جلب متوسط تقييم منتج
router.get('/ratings/:productId/average', ratingController.getAverageRating);

module.exports = router;
