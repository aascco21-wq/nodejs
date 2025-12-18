const mongoose = require('mongoose');

const MediaCollectionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    files: [{
        url: String,
        filename: String,
        mimetype: String,
        originalName: String,
        size: Number
    }],
    customData: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('MediaCollection', MediaCollectionSchema);
