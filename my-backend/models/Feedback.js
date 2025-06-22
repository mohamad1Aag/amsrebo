const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
