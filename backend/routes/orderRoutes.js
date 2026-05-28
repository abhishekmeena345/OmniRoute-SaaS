const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. PLACE NEW ORDER (Customer ke liye)
router.post('/place', async (req, res) => {
    try {
        // Naye fields: orderType aur deliveryAddress yahan add kiye
        const { userId, customerName, customerPhone, items, totalBill, orderType, deliveryAddress } = req.body;
        
        const newOrder = new Order({
            userId,
            customerName,
            customerPhone,
            items,
            totalBill,
            orderType: orderType || 'Pickup', // Agar kuch nahi aaya to default 'Pickup'
            deliveryAddress: deliveryAddress || ''
        });

        await newOrder.save();
        res.status(201).json({ message: "✅ Order successfully place ho gaya!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Order place nahi ho paya." });
    }
});

// 2. GET ALL ORDERS (Admin ke liye)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Naye orders upar dikhenge
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Orders nahi mile." });
    }
});

// 3. UPDATE ORDER STATUS (Admin accept/deliver karega)
router.put('/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'Accepted' ya 'Delivered'
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({ message: `✅ Order status updated to ${status}`, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Status update nahi hua." });
    }
});

// 4. GET LOGGED-IN USER ORDERS (Customer ke khud ke orders)
router.get('/user/:userId', async (req, res) => {
    try {
        const userOrders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: Orders nahi mil paye." });
    }
});

// 5. GET DASHBOARD STATS (Admin Analytics ke liye)
router.get('/dashboard-stats', async (req, res) => {
    try {
        // 1. Total Orders (Sirf Delivered wale)
        const totalOrders = await Order.countDocuments({ status: 'Delivered' });

        // 2. Total Earnings (Delivered orders ke totalBill ka sum)
        const earningsResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, totalEarning: { $sum: '$totalBill' } } }
        ]);
        const totalEarning = earningsResult.length > 0 ? earningsResult[0].totalEarning : 0;

        // 3. Top Selling Product (items array se)
        const topSellingResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $unwind: '$items' }, // Items array ko alag-alag documents me todna
            { $group: { 
                _id: '$items.name', // Yahan hum maan rahe hain product ka naam 'items.name' me hai
                totalQuantitySold: { $sum: '$items.quantity' } // Aur quantity 'items.quantity' me hai
            }},
            { $sort: { totalQuantitySold: -1 } }, // Sabse zyada bikne wala sabse upar
            { $limit: 1 }
        ]);

        const topSellingProduct = topSellingResult.length > 0 && topSellingResult[0]._id
            ? topSellingResult[0]._id 
            : 'No Sales Yet';

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalEarning,
                topSellingProduct
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "❌ Server Error: Dashboard stats nahi mil paye." });
    }
});

module.exports = router;