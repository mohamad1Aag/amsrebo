const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const upload = require('../middleware/upload');

// 🟢 إضافة قسم مع صورة
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const section = new Section({ name, description, image });
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔵 عرض الأقسام
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
