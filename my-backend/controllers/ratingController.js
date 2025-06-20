const Rating = require('../models/Rating');
const Product = require('../models/Product');

// إنشاء تقييم
exports.createRating = async (req, res) => {
  try {
    const { productId, rating, review, userId } = req.body;

    const newRating = new Rating({
      product: productId,
      rating,
      review,
      user: userId || null,
    });

    await newRating.save();
    res.status(201).json({ message: '✅ تم إضافة التقييم بنجاح', rating: newRating });
  } catch (error) {
    console.error('❌ خطأ في إضافة التقييم:', error);
    res.status(500).json({ error: 'فشل في إنشاء التقييم' });
  }
};

// جلب التقييمات الخاصة بمنتج
exports.getRatingsByProduct = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('❌ خطأ في جلب التقييمات:', error);
    res.status(500).json({ error: 'فشل في جلب التقييمات' });
  }
};

// حساب متوسط تقييم المنتج
exports.getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId });

    if (ratings.length === 0) {
      return res.status(200).json({ average: 0, count: 0 });
    }

    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = total / ratings.length;

    res.status(200).json({ average: average.toFixed(1), count: ratings.length });
  } catch (error) {
    console.error('❌ خطأ في حساب المتوسط:', error);
    res.status(500).json({ error: 'فشل في حساب المتوسط' });
  }
};
