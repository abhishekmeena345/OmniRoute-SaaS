const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. SIGNUP API (Naya Account Banana)
router.post('/signup', async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        // Check karein number pehle se exist toh nahi karta
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Ye phone number pehle se registered hai." });
        }

        // Password ko secure (Hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya User Save karna
        const newUser = new User({
            name,
            phone,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "Account successfully ban gaya!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error!" });
    }
});

// 2. LOGIN API (Account mein Login karna)
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // User dhoondhna
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Account nahi mila. Pehle Signup karein." });
        }

        // Password match karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Galat Password!" });
        }

        // JWT Token Generate karna (Login yaad rakhne ke liye)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' } // 7 din tak login rahega
        );

        res.status(200).json({
            message: "Login Successful!",
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error!" });
    }
});

module.exports = router;