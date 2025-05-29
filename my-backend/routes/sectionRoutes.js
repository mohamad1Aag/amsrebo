const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const upload = require('../middlewares/upload');

// POST: إضافة قسم جديد مع صورة
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const newSection = new Section({
      name,
      description,
      image: imagePath
    });

    await newSection.save();

    res.status(201).json(newSection);
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة القسم' });
  }
});

// PUT أو PATCH لتعديل قسم معين حسب id
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const sectionId = req.params.id;
    const { name, description } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    // ابحث عن القسم وقم بالتعديل
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'القسم غير موجود' });
    }

    // تحديث الحقول إذا وصلت
    if (name) section.name = name;
    if (description) section.description = description;
    if (imagePath) section.image = imagePath;

    await section.save();

    res.status(200).json(section);
  } catch (err) {
    console.error('❌ خطأ أثناء التعديل:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل القسم' });
  }
});
// GET: جلب جميع الأقسام
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.status(200).json(sections);
  } catch (err) {
    console.error('❌ خطأ أثناء جلب الأقسام:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأقسام' });
  }
});

module.exports = router;
