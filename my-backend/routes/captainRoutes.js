// routes/captainRoutes.js
const express = require('express');
const router = express.Router();
const Captain = require('../models/Captain');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const captain = new Captain({ name, phone, password: hashedPassword });
    await captain.save();
    res.status(201).json(captain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const captain = await Captain.findOne({ phone });
  if (!captain) return res.status(404).json({ message: 'الكابتن غير موجود' });

  const match = await bcrypt.compare(password, captain.password);
  if (!match) return res.status(400).json({ message: 'كلمة المرور خاطئة' });

  const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, captain });
});

module.exports = router;
