const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, hash this!
    role: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
