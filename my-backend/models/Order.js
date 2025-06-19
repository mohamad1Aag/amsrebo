const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ربط الطلب بالمستخدم الذي قام به
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // ربط المنتج بجدول المنتجات
        required: true,
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', // إذا كان المنتج تابع لبائع
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      type: {
        type: String,
        enum: ['مفرق', 'جملة'], // تحديد النوع
        default: 'مفرق',
      },
    },
  ],

  total: {
    type: Number,
    required: true, // يمكن حسابه عند إنشاء الطلب
  },

  deliveryLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  notes: {
    type: String, // ملاحظات اختيارية من المستخدم (مثل "الرجاء الاتصال قبل التوصيل")
  },

  status: {
    type: String,
    enum: ['جديد', 'قيد التنفيذ', 'قيد التوصيل', 'مكتمل', 'مرفوض'],
    default: 'جديد',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
