const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// إنشاء طلب جديد
router.post('/orders', orderController.createOrder);

// جلب جميع الطلبات (للمشرف أو البائع)
router.get('/all/orders', orderController.getAllOrders);

// جلب الكباتن (ضع هذا أولاً!)
router.get('/captains', orderController.getAllCaptains);

// جلب الطلبات الخاصة بمستخدم معيّن (هذا بعده)
router.get('/orders/:userId', orderController.getOrdersByUser);

router.patch('/orders/:orderId/status', orderController.updateOrderStatus);

router.delete('/orders/:orderId', orderController.deleteOrder);

// تعيين اسم الكابتن للطلب
router.patch('/orders/:orderId/assign-captain-name', orderController.assignCaptainNameToOrder);

module.exports = router;
