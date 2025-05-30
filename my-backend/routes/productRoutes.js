const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/cloudinary'); // ✅ هذا هو ملف إعداد Cloudinary
const section = require('../models/section');

// إضافة منتج مع رفع صورة
router.post('/products', upload.single('image'), productController.createProduct);

// جلب كل المنتجات
router.get('/products', productController.getAllProducts);

// جلب منتج حسب الـ ID
router.get('/products/:id', productController.getProductById);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
