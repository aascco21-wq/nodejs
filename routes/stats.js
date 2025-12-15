const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Project = require('../models/Project');

// Get Dashboard Stats
router.get('/', async (req, res) => {
    try {
        const totalServices = await Service.countDocuments();
        const deliveredProjects = await Project.countDocuments({ delivered: true });
        const totalProjects = await Project.countDocuments();

        res.json({
            totalServices,
            deliveredProjects,
            totalProjects,
            siteVisits: 12500 // Mock data for now
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
