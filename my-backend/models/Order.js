const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  userName: {
    type: String,
    default: '',  // يمكن تعديلها لاحقًا عند الإنشاء
  },

  userPhone: {
    type: String,
    default: '',  // رقم الهاتف كحقل نصي
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
    ref: 'Captain',
    default: null,
  },

  captainName: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
