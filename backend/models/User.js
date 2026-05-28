const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // Login ke liye mobile number
    password: { type: String, required: true },
    role: { type: String, default: 'customer' } // Default customer hoga, aapke dost ka 'admin' hoga
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);