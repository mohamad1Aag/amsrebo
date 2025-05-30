const Product = require('../models/Product');
const section = require('../models/Section');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, section } = req.body;

    const imageUrl = req.file ? req.file.path : null; // ✅ Cloudinary يعيد رابط الصورة بـ req.file.path

    const newProduct = new Product({
      name,
      price,
      description,
      section,
      image: imageUrl,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('section');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('section');
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json({ message: '✅ تم حذف المنتج بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;

    const updatedData = {
      name,
      price,
    };

    if (imageUrl) updatedData.image = imageUrl;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث المنتج' });
  }
};


