const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/images', 'uploads/videos'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isVideo = file.mimetype.startsWith('video/');
        const uploadPath = isVideo ? 'uploads/videos' : 'uploads/images';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|webm|mov|avi/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (mimetype.startsWith('image/')) {
        const isValidImage = allowedImageTypes.test(extname.slice(1)) &&
            allowedImageTypes.test(mimetype.split('/')[1]);
        if (isValidImage) {
            return cb(null, true);
        }
    } else if (mimetype.startsWith('video/')) {
        const isValidVideo = allowedVideoTypes.test(extname.slice(1)) &&
            allowedVideoTypes.test(mimetype.split('/')[1]);
        if (isValidVideo) {
            return cb(null, true);
        }
    }

    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and videos (MP4, WEBM, MOV, AVI) are allowed.'));
};

// Multer upload configurations
const uploadSingle = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB for images
    },
    fileFilter: fileFilter
}).single('file');

const uploadMultiple = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB per file
    },
    fileFilter: fileFilter
}).array('files', 10); // Max 10 files

const uploadVideo = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB for videos
    },
    fileFilter: fileFilter
}).single('file');

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadVideo
};
