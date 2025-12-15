const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (simple comparison for now as requested)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            message: 'Login successful'
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
