const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ تم الاتصال بقاعدة البيانات MongoDB");
  } catch (error) {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
