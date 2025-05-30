const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.addToCart);
router.get('/cart/:userId', cartController.getCart);

module.exports = router;
