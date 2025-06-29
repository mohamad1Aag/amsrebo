const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadSlider, getSliders, deleteSlider } = require('../controllers/sliderController');
const adminProtect = require('../middlewares/adminProtect');
const protect = require('../middlewares/protect');

router.post('/upload', protect, adminProtect, upload.single('image'), uploadSlider);
router.get('/', getSliders);
router.delete('/:id',  adminProtect, deleteSlider);

module.exports = router;
