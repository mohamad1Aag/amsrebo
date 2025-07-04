const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/user');
const Captain = require('../models/Captain');

// إنشاء طلب جديد
exports.createOrder = async (req, res) => {
  const { userId, products, deliveryLocation, notes } = req.body;

  if (!products || !products.length) {
    return res.status(400).json({ message: 'يجب إرسال المنتجات مع الطلب.' });
  }

  try {
    // تحقق من معلومات كل منتج
    for (let product of products) {
      if (!product.productId || !product.vendorId || !product.name || !product.price) {
        return res.status(400).json({ message: 'بعض معلومات المنتجات ناقصة.' });
      }
    }

    // احسب المجموع الكلي
    const total = products.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    // جلب بيانات المستخدم (مثلاً رقم الهاتف) من قاعدة البيانات
    const user = await User.findById(userId).select('phone name');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود.' });
    }

    // أضف رقم الهاتف واسم المستخدم مباشرة مع الطلب
    const order = new Order({
      userId,
      userName: user.name,       // إضافة اسم المستخدم
      userPhone: user.phone,     // إضافة رقم الهاتف
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


// جلب كل الطلبات الخاصة بمستخدم معيّن مع التحقق من صحة userId
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  // تحقق من أن userId هو ObjectId صحيح لتجنب خطأ Cast to ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'معرّف المستخدم غير صحيح.' });
  }

  try {
    const orders = await Order.find({ userId }).populate('products.productId');
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

// جلب كل الكباتن
exports.getAllCaptains = async (req, res) => {
  try {
    const captains = await Captain.find({ status: "available" }); // جلب فقط الكباتن المتاحين
    res.json(captains);
  } catch (err) {
    console.error('خطأ في جلب الكباتن:', err.message);
    res.status(500).json({ message: 'خطأ في جلب الكباتن' });
  }
};




// orderController.js


exports.getOrdersByCaptainName = async (req, res) => {
  try {
    const { captainName } = req.params;
    const orders = await Order.find({
      captainName,
      status: "مكتمل",
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب طلبات الكابتن", error });
  }
};



