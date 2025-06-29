const Slider = require('../models/Slider');
const { cloudinary } = require('../middlewares/cloudinary');

exports.uploadSlider = async (req, res) => {
    try {
      const { description_ar, description_en } = req.body;
      const imageUrl = req.file.path;
      const publicId = req.file.filename;
  
      const newSlider = await Slider.create({
        image: imageUrl,
        public_id: publicId,
        description: {
          ar: description_ar,
          en: description_en,
        },
      });
  
      res.status(201).json(newSlider);
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ msg: 'فشل رفع الصورة' });
    }
  };
  
exports.getSliders = async (req, res) => {
  const sliders = await Slider.find().sort({ createdAt: -1 });
  res.json(sliders);
};

exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ msg: 'العنصر غير موجود' });

    await cloudinary.uploader.destroy(slider.public_id);
    await slider.deleteOne();

    res.json({ msg: 'تم الحذف بنجاح' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ msg: 'فشل الحذف' });
  }
};
