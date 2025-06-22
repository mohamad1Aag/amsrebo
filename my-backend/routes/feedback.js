const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/api/feedback', async (req, res) => {
  const { orderId, userId, captainName, rating, comment } = req.body;

  if (!orderId || !userId || !captainName || !rating) {
    return res.status(400).json({ message: "البيانات غير مكتملة" });
  }

  try {
    const existing = await Feedback.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ message: "تم إرسال تقييم لهذا الطلب مسبقًا" });
    }

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

module.exports = router;
