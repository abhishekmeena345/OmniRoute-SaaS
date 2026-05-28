const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. ADD PRODUCT (Naya Item Add Karna)
router.post('/add', async (req, res) => {
    try {
        // 👇 NAYA: originalPrice ko req.body se nikala
        const { name, category, price, originalPrice, stock, image } = req.body;
        
        // 👇 NAYA: originalPrice ko database mein save karne ke liye pass kiya
        const newProduct = new Product({ name, category, price, originalPrice, stock, image });
        await newProduct.save();
        
        res.status(201).json({ message: "✅ Product successfully add ho gaya!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Product add nahi hua." });
    }
});

// 2. GET ALL PRODUCTS (Saare Items Dekhna)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Naye items upar dikhenge
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Products nahi mile." });
    }
});

// 3. EDIT PRODUCT (Item ki details badalna)
router.put('/update/:id', async (req, res) => {
    try {
        // 👇 NAYA: originalPrice ko update ke liye bhi req.body se nikala
        const { name, category, price, originalPrice, stock, image } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, originalPrice, stock, image }, // 👈 originalPrice yahan add kiya
            { returnDocument: 'after' } // 👈 FIX: Deprecation warning hatane ke liye 'new: true' ki jagah ye likha
        );
        res.status(200).json({ message: "✅ Product successfully update ho gaya!", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Update nahi ho paya." });
    }
});

// 4. DELETE PRODUCT (Item ko hatana)
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "🗑️ Product successfully delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Delete nahi ho paya." });
    }
});

module.exports = router;