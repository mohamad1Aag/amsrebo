const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const sectionRoutes = require('./routes/sectionRoutes'); //من اجل الاقسام

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء التطبيق
const app = express();

// إعدادات ميدل وير
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
connectDB(); // هذه الدالة يجب أن تستخدم mongoose.connect بداخلها

// الراوتات
app.use('/api/users', userRoutes);          // مسارات المستخدمين
app.use('/api/admin', adminAuthRoutes);     // مسارات الأدمن
app.use('/api/sections', sectionRoutes); // راوتر الأقسام
app.use('/uploads', express.static('uploads')); // 🟢 لعرض الصور من المتصفح


// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
