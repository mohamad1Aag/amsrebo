const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
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
        enum: ['مفرق', 'جملة'],
        default: 'مفرق',
      },
    },
  ],

  total: {
    type: Number,
    required: true,
  },

  deliveryLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  notes: {
    type: String,
  },

  status: {
    type: String,
    enum: ['جديد', 'قيد التنفيذ', 'قيد التوصيل', 'مكتمل', 'مرفوض'],
    default: 'جديد',
  },

  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',  // ربط الطلب بالكابتن (اختياري)
    default: null,
  },

  captainName: {
    type: String,
    default: '', // اسم الكابتن كحقل نصي، فارغ بشكل افتراضي
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);