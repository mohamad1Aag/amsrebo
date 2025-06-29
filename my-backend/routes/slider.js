const express = require('express');
const router = express.Router();
const   {upload } = require('../middlewares/upload'); // multer middleware
const { uploadSlider, getSliders, deleteSlider } = require('../controllers/sliderController');

router.post('/upload', upload.single('image'), uploadSlider);
router.get('/', getSliders);
router.delete('/:id', deleteSlider);

module.exports = router;
