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

        res.json({
            message: 'File uploaded successfully',
            url: req.file.path,
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
            return {
                url: file.path,
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

        res.json({
            message: 'Video uploaded successfully',
            url: req.file.path,
            filename: req.file.filename
        });
    });
});

module.exports = router;
