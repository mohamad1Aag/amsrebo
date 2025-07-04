const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// إنشاء طلب جديد
router.post('/orders', orderController.createOrder);

// جلب جميع الطلبات (للمشرف أو البائع)
router.get('/all/orders', orderController.getAllOrders);

// جلب الكباتن (يكون قبل أي مسار آخر يحتوي على params)
router.get('/captains', orderController.getAllCaptains);

// جلب الطلبات الخاصة بمستخدم معين باستخدام مسار واضح
router.get('/orders/user/:userId', orderController.getOrdersByUser);

router.patch('/orders/:orderId/status', orderController.updateOrderStatus);

router.delete('/orders/:orderId', orderController.deleteOrder);

// تعيين اسم الكابتن للطلب
router.patch('/orders/:orderId/assign-captain-name', orderController.assignCaptainNameToOrder);
router.get('/orders/captain/:captainName', orderController.getOrdersByCaptainName);
module.exports = router;
