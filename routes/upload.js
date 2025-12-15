const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadVideo } = require('../middleware/upload');

// Upload single image
router.post('/image', (req, res) => {
    uploadSingle(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const folder = req.file.destination.includes('videos') ? 'videos' : 'images';
        const fileUrl = `/uploads/${folder}/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    });
});

// Upload multiple images
router.post('/images', (req, res) => {
    uploadMultiple(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const fileUrls = req.files.map(file => {
            const folder = file.destination.includes('videos') ? 'videos' : 'images';
            return {
                url: `/uploads/${folder}/${file.filename}`,
                filename: file.filename
            };
        });

        res.json({
            message: 'Files uploaded successfully',
            files: fileUrls
        });
    });
});

// Upload video
router.post('/video', (req, res) => {
    uploadVideo(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/videos/${req.file.filename}`;
        res.json({
            message: 'Video uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    });
});

module.exports = router;
