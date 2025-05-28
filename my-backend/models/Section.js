const mongoose =require('mongoose');

const sectionSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String ,
    description: String,


});
module.exports = mongoose.model('section',sectionSchema);