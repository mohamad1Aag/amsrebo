const mongoose = require('mongoose');

      const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: String,
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
        image: { type: String },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // ✅  
        
      },
 { timestamps: true });