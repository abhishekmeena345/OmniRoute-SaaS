const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalBill: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending -> Accepted -> Delivered
    
    // NAYE FIELDS: Pickup/Delivery aur Address ke liye
    orderType: { 
        type: String, 
        enum: ['Pickup', 'Delivery'], 
        default: 'Pickup' 
    },
    deliveryAddress: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);