const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// استقبال التقييم والتعليق
router.post("/", async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({ message: "orderId and rating are required" });
    }

    // تحديث التقييم إذا موجود، أو إنشاء جديد
    const feedback = await Feedback.findOneAndUpdate(
      { orderId },
      { rating, comment, createdAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Feedback saved", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
