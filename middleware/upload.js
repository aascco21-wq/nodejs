const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Multer upload configurations
const uploadSingle = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB for images
    }
}).single('file');

const uploadMultiple = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB per file
    }
}).array('files', 10); // Max 10 files

const uploadVideo = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB for videos
    }
}).single('file');

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadVideo
};
