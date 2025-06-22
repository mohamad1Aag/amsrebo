const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback
router.post('/', async (req, res) => {
  const { orderId, userId, captainName, rating, comment } = req.body;

  if (!orderId || !userId || !captainName || !rating) {
    return res.status(400).json({ message: "البيانات غير مكتملة" });
  }

  try {
    // تحقق إذا تم إرسال تقييم لهذا الطلب مسبقًا
    const existing = await Feedback.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ message: "تم إرسال تقييم لهذا الطلب مسبقًا" });
    }

    // إنشاء تقييم جديد
    const newFeedback = new Feedback({
      orderId,
      userId,
      captainName,
      rating,
      comment
    });

    await newFeedback.save();

    res.status(201).json({ message: "تم حفظ التقييم بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// GET /api/feedback  -- جلب كل التقييمات (للأدمن)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// GET /api/feedback/user/:userId  -- جلب كل التقييمات لمستخدم معين
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const feedbacks = await Feedback.find({ userId });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// GET /api/feedback/:orderId  -- جلب تقييم طلب معين
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const feedback = await Feedback.findOne({ orderId });
    if (!feedback) {
      return res.status(404).json({ message: "لا يوجد تقييم لهذا الطلب" });
    }
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

module.exports = router;
