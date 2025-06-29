const jwt = require('jsonwebtoken');
const Slider = require('../models/Slider');
const { cloudinary } = require('../middlewares/cloudinary');

const verifyAdmin = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('توكن مفقود أو غير صالح');
    err.status = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const err = new Error('توكن غير صالح أو منتهي');
    err.status = 401;
    throw err;
  }

  if (decoded.role !== 'admin') {
    const err = new Error('ممنوع، فقط الأدمن يمكنه الوصول لهذه الصفحة');
    err.status = 403;
    throw err;
  }
  return decoded;
};

exports.uploadSlider = async (req, res) => {
  try {
    verifyAdmin(req);  // تحقق من صلاحية الأدمن

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
    res.status(err.status || 500).json({ msg: err.message || 'فشل رفع الصورة' });
  }
};

exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (err) {
    console.error('Get sliders error:', err);
    res.status(500).json({ msg: 'فشل جلب الصور' });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    verifyAdmin(req); // تحقق من صلاحية الأدمن

    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ msg: 'العنصر غير موجود' });

    await cloudinary.uploader.destroy(slider.public_id);
    await slider.deleteOne();

    res.json({ msg: 'تم الحذف بنجاح' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(err.status || 500).json({ msg: err.message || 'فشل الحذف' });
  }
};
