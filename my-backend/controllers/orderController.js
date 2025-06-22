const Order = require('../models/Order');
const User = require('../models/User');
const Captain = require('../models/Captain');// إنشاء طلب جديد
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
    const orders = await Order.find()
      .populate('userId')
      .populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error('خطأ أثناء جلب جميع الطلبات:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات.' });
  }
};

// تحديث حالة الطلب
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // أضف الحالة الجديدة هنا
  const validStatuses = ['جديد', 'قيد التنفيذ', 'بانتظار التوصيل', 'قيد التوصيل', 'مكتمل', 'مرفوض'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'حالة الطلب غير صحيحة.' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود.' });

    res.json(order);
  } catch (err) {
    console.error('خطأ أثناء تحديث حالة الطلب:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة الطلب.' });
  }
};


// حذف طلب
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود.' });
    }
    res.json({ message: 'تم حذف الطلب بنجاح.' });
  } catch (err) {
    console.error('خطأ أثناء حذف الطلب:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب.' });
  }
};


// تعيين اسم الكابتن فقط للطلب
exports.assignCaptainNameToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { captainName } = req.body;

  if (!captainName) {
    return res.status(400).json({ message: 'يرجى إرسال اسم الكابتن.' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { captainName },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'الطلب غير موجود.' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('خطأ أثناء تعيين اسم الكابتن:', error.message);
    res.status(500).json({ message: 'حدث خطأ أثناء التحديث.' });
  }
};
exports.getAllCaptains = async (req, res) => {
  try {
    const captains = await Captain.find();
    res.json(captains);
  } catch (err) {
    console.error('خطأ في جلب الكباتن:', err.message);
    res.status(500).json({ message: 'خطأ في جلب الكباتن' });
  }
};
