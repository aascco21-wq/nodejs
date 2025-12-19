const express = require('express');
const router = express.Router();
const MediaCollection = require('../models/MediaCollection');
const { uploadMultiple } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Helper to remove file from disk
const removeFile = (filePath) => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

// @route   POST /api/media-collections
// @desc    Create a new media collection with files and data
// @access  Public
router.post('/', (req, res) => {
    uploadMultiple(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { title, description, customData } = req.body;

            let files = [];
            if (req.files && req.files.length > 0) {
                files = req.files.map(file => {
                    return {
                        url: file.path,
                        filename: file.filename,
                        mimetype: file.mimetype,
                        originalName: file.originalname,
                        size: file.size
                    };
                });
            }

            // Parse customData if it comes as a stringified JSON
            let parsedData = customData;
            if (typeof customData === 'string') {
                try {
                    parsedData = JSON.parse(customData);
                } catch (e) {
                    // if not valid json, keep as string or whatever it is
                }
            }

            const newCollection = new MediaCollection({
                title,
                description,
                files,
                customData: parsedData || []
            });

            const savedCollection = await newCollection.save();
            res.status(201).json(savedCollection);

        } catch (error) {
            console.error('Error creating collection:', error);
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
});

// @route   GET /api/media-collections
// @desc    Get all media collections
// @access  Public
router.get('/', async (req, res) => {
    try {
        const collections = await MediaCollection.find().sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/media-collections/:id
// @desc    Get single media collection
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const collection = await MediaCollection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.json(collection);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/media-collections/:id
// @desc    Update media collection (add files, update data)
// @access  Public
router.put('/:id', (req, res) => {
    uploadMultiple(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            let collection = await MediaCollection.findById(req.params.id);
            if (!collection) {
                return res.status(404).json({ message: 'Collection not found' });
            }

            const { title, description, customData } = req.body;

            // Update fields if provided
            if (title) collection.title = title;
            if (description) collection.description = description;

            // Update customData if provided
            if (customData) {
                let parsedData = customData;
                if (typeof customData === 'string') {
                    try {
                        parsedData = JSON.parse(customData);
                    } catch (e) {
                        // ignore parse error logic
                    }
                }
                collection.customData = parsedData;
            }

            // Append new files if uploaded
            if (req.files && req.files.length > 0) {
                const newFiles = req.files.map(file => {
                    return {
                        url: file.path,
                        filename: file.filename,
                        mimetype: file.mimetype,
                        originalName: file.originalname,
                        size: file.size
                    };
                });
                collection.files.push(...newFiles);
            }

            await collection.save();
            res.json(collection);

        } catch (error) {
            console.error('Error updating collection:', error);
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
});

// @route   DELETE /api/media-collections/:id
// @desc    Delete media collection
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const collection = await MediaCollection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Delete associated files from disk
        collection.files.forEach(file => {
            // Extract relative path from URL (remove leading /)
            if (file.url && file.url.startsWith('/')) {
                removeFile(file.url.substring(1));
            }
        });

        await collection.deleteOne();
        res.json({ message: 'Collection removed' });

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/media-collections/:id/files/:fileId
// @desc    Delete a specific file from a media collection
// @access  Public
router.delete('/:id/files/:fileId', async (req, res) => {
    try {
        const collection = await MediaCollection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const fileIndex = collection.files.findIndex(f => f._id.toString() === req.params.fileId);
        if (fileIndex === -1) {
            return res.status(404).json({ message: 'File not found in collection' });
        }

        const file = collection.files[fileIndex];

        // Delete from disk
        if (file.url && file.url.startsWith('/')) {
            removeFile(file.url.substring(1));
        }

        // Remove from array atomically to avoid VersionError
        const updatedCollection = await MediaCollection.findByIdAndUpdate(
            req.params.id,
            { $pull: { files: { _id: req.params.fileId } } },
            { new: true }
        );

        if (!updatedCollection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.json({ message: 'File removed from collection', collection: updatedCollection });

    } catch (error) {
        console.error('Error deleting file from collection:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
