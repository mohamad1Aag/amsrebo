const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);
router.get('/all/orders', orderController.getallOrder);
router.get('/orders/:userId', orderController.getOrdersByUser);

module.exports = router;
