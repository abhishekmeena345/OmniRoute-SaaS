const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // 👈 NAYA: Yeh line add karna zaroori hai
  stock: { type: Number, required: true },
  image: { type: String },
  // ... baaki fields
});

module.exports = mongoose.model('Product', productSchema);