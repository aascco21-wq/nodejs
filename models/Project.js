const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    },
    title: String,
    titleAr: String,
    description: String,
    descriptionAr: String,
    image: String,
    delivered: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
