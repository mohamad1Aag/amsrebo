const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ar: { type: String },
    en: { type: String }
  },
  image: String
});

module.exports = mongoose.model('Section', sectionSchema);
