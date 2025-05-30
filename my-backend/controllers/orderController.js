const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    const { userId, products, deliveryLocation } = req.body; 
  
    if (!products || !products.length) {
      return res.status(400).json({ message: 'يجب إرسال المنتجات مع الطلب.' });
    }
  
    try {
      const order = new Order({
        userId,
        products,
        deliveryLocation,  // ← هنا تخزن الموقع مع الطلب
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
