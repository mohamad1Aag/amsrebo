const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: String, // من الأفضل يكون ObjectId من جدول المستخدمين
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
