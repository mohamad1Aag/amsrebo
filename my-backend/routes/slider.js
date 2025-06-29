const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/cloudinary'); // ✅ صحح الاستيراد
const { uploadSlider, getSliders, deleteSlider } = require('../controllers/sliderController');
const protect = require('../middlewares/protect');
const adminProtect = require('../middlewares/adminProtect');

router.post('/upload', upload.single('image'), uploadSlider);
router.get('/', getSliders);
router.delete('/:id', deleteSlider);

module.exports = router;
