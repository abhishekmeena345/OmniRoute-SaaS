const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware (Taaki frontend backend se baat kar sake)
app.use(cors());
app.use(express.json());
// Auth Routes Import aur Use karna
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Product Routes Import aur Use karna
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Order Routes Import aur Use karna
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('Goyal Supermart API is running smoothly...');
});

// Server Start Karna
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});