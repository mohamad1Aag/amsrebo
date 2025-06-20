const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const upload = require('../middlewares/cloudinary'); // ✅ Cloudinary middleware

// POST: إضافة قسم جديد
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const { name_ar, name_en, description_ar, description_en } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const newSection = new Section({
      name: { ar: name_ar, en: name_en },
      description: { ar: description_ar, en: description_en },
      image: imagePath
    });

    await newSection.save();
    res.status(201).json(newSection);
  } catch (err) {
    console.error('❌ خطأ أثناء الإضافة:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة القسم' });
  }
});


// PUT: تعديل قسم حسب id
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name_ar, name_en, description_ar, description_en } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ error: 'القسم غير موجود' });

    if (name_ar) section.name.ar = name_ar;
    if (name_en) section.name.en = name_en;
    if (description_ar) section.description.ar = description_ar;
    if (description_en) section.description.en = description_en;
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
