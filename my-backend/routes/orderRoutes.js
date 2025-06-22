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

router.delete('/orders/:orderId', orderController.deleteOrder);
// تعيين اسم الكابتن للطلب
router.patch('/orders/:orderId/assign-captain-name', orderController.assignCaptainNameToOrder);

router.get('/captains', async (req, res) => {
    try {
      const captains = await Captain.find();
      res.json(captains);
    } catch (err) {
      res.status(500).json({ message: 'خطأ في جلب الكباتن' });
    }
  });
module.exports = router;
