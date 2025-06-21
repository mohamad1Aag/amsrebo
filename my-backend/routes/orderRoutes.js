const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// إنشاء طلب جديد
router.post('/orders', orderController.createOrder);

// جلب جميع الطلبات (للمشرف أو البائع)
router.get('/all/orders', orderController.getAllOrders);

// جلب الطلبات الخاصة بمستخدم معيّن
router.get('/orders/:userId', orderController.getOrdersByUser);

router.patch('/orders/:orderId/status', orderController.updateOrderStatus);


module.exports = router;
