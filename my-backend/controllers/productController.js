const Product = require('../models/Product');
const Section = require('../models/Section');

exports.createProduct = async (req, res) => {
  try {
    console.log('--- req.body ---');
    console.log(req.body);

    console.log('--- req.file ---');
    console.log(req.file);

    // فك name و description لو جاؤا كنص JSON
    let { name, priceRetail, priceWholesale, description, section, adminId } = req.body;

    if (typeof name === 'string') {
      name = JSON.parse(name);
    }
    if (description && typeof description === 'string') {
      description = JSON.parse(description);
    }

    const imageUrl = req.file ? req.file.path : null;

    console.log('imageUrl:', imageUrl);

    const newProduct = new Product({
      name,
      priceRetail,
      priceWholesale,
      description,
      section,
      image: imageUrl,
      adminId,
    });

    console.log('Saving new product...');
    const savedProduct = await newProduct.save();

    console.log('Product saved:', savedProduct);

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(400).json({ message: err.message, error: err });
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
    let { name, priceRetail, priceWholesale, description } = req.body;

    if (typeof name === 'string') {
      name = JSON.parse(name);
    }
    if (description && typeof description === 'string') {
      description = JSON.parse(description);
    }

    const imageUrl = req.file ? req.file.path : undefined;

    const updatedData = {
      name,
      priceRetail,
      priceWholesale,
      description,
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

// جلب المنتجات حسب القسم
exports.getProductsBySection = async (req, res) => {
  try {
    const products = await Product.find({ section: req.params.sectionId });
    res.status(200).json(products);
  } catch (error) {
    console.error('❌ خطأ أثناء جلب المنتجات:', error);
    res.status(500).json({ error: 'فشل في جلب المنتجات' });
  }
};
