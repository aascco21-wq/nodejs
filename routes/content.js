const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

// Get Site Content
router.get('/', async (req, res) => {
    try {
        const content = await SiteContent.getSingleton();
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Site Content
router.put('/', async (req, res) => {
    try {
        const content = await SiteContent.getSingleton();
        // Use .set() for proper partial updates on Mongoose document
        content.set(req.body);
        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
