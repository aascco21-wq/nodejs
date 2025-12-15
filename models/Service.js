const mongoose = require('mongoose');


const ServiceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    },
    icon: String, // Store icon name as string
    title: String,
    titleAr: String,
    desc: String,
    descAr: String,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
