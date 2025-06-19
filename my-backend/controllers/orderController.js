const Order = require('../models/Order');

// إنشاء طلب جديد
exports.createOrder = async (req, res) => {
  const { userId, products, deliveryLocation, notes } = req.body;

  // تحقق من وجود منتجات
  if (!products || !products.length) {
    return res.status(400).json({ message: 'يجب إرسال المنتجات مع الطلب.' });
  }

  try {
    // تحقق من وجود الحقول المطلوبة في كل منتج
    for (let product of products) {
      if (
        !product.productId ||
        !product.vendorId ||
        !product.name ||
        !product.price
      ) {
        return res.status(400).json({ message: 'بعض معلومات المنتجات ناقصة.' });
      }
    }

    // حساب السعر الكلي
    const total = products.reduce((sum, item) => {
      return sum + item.price * (item.quantity || 1);
    }, 0);

    // إنشاء الطلب
    const order = new Order({
      userId,
      products,
      deliveryLocation,
      notes,
      total,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('خطأ أثناء إنشاء الطلب:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطلب.' });
  }
};

// جلب كل الطلبات الخاصة بمستخدم معيّن
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error('خطأ أثناء جلب الطلبات:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات.' });
  }
};

// جلب كل الطلبات (للمشرف أو البائع)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId userId');
    res.json(orders);
  } catch (err) {
    console.error('خطأ أثناء جلب جميع الطلبات:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات.' });
  }
};
