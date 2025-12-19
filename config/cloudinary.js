const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = isVideo ? 'aascco/videos' : 'aascco/images';
        return {
            folder: folder,
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: isVideo ? ['mp4', 'webm', 'mov', 'avi'] : ['jpeg', 'jpg', 'png', 'gif', 'webp'],
            public_id: Date.now() + '-' + Math.round(Math.random() * 1E9)
        };
    },
});

module.exports = {
    cloudinary,
    storage
};
