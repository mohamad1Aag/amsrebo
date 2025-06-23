// models/PointHistory.js
const mongoose = require('mongoose');

const pointHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  pointsChanged: { type: Number, required: true }, // قيمة موجبة أو سالبة (هنا سالبة للخصم)
  type: { type: String, required: true }, // مثلا "خصم نقاط شراء" أو "شحن رصيد"
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const PointHistory = mongoose.models.pointHistory || mongoose.model('pointHistory', pointHistorySchema);

module.exports = PointHistory;
