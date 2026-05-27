// backend/routes/VendorRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Points straight to your local JSON database bridge

// ==========================================
// 🚀 1. FETCH ALL VENDORS ENDPOINT (JSON)
// ==========================================
router.get('/all', async (req, res) => {
    try {
        const vendors = db.getVendors();
        res.json(vendors);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 2. OWNER REGISTRATION ENDPOINT (JSON)
// ==========================================
router.post('/register-owner', async (req, res) => {
    const { email, password, restaurantName, country, city, location, currency } = req.body;

    if (!email || !password || !restaurantName) {
        return res.status(400).json({ success: false, message: 'Missing registration details.' });
    }

    try {
        const vendors = db.getVendors();
        
        // Check if the shop name already exists
        const existing = vendors.find(v => v.name.toLowerCase() === restaurantName.toLowerCase());
        if (existing) {
            return res.status(400).json({ success: false, message: 'A shop with this name is already registered.' });
        }

        const newId = vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1;
        const newVendor = {
            id: newId,
            ownerId: `owner-${newId}`,
            email: email,
            password: password,
            name: restaurantName,
            shop_name: restaurantName,
            town: `${city}, ${location}`,
            city: city,
            location: location,
            country: country,
            currency: currency || 'CFA',
            menu: []
        };

        vendors.push(newVendor);
        db.saveVendors(vendors);

        res.status(201).json({
            success: true,
            message: 'Owner and Shop successfully registered in the database!',
            vendorId: newId,
            ownerId: `owner-${newId}`,
            restaurant: newVendor
        });

    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
    }
});

// ==========================================
// 🚀 3. OWNER LOGIN ENDPOINT (JSON)
// ==========================================
router.post('/login-owner', async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendors = db.getVendors();
        // Match on email or shop name
        const vendor = vendors.find(v => 
            (v.email && v.email.toLowerCase() === email.toLowerCase()) || 
            v.name.toLowerCase() === email.toLowerCase()
        );

        if (!vendor || vendor.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid owner credentials.' });
        }

        res.json({ 
            success: true, 
            ownerId: vendor.ownerId, 
            restaurant: vendor
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
});

// ==========================================
// 🚀 4. MANAGE DISHES ENDPOINT (JSON)
// ==========================================
router.post('/add-food-flexible', async (req, res) => {
    const { vendorId, name, basePrice, description, imageUrl, ingredients, isPermanent } = req.body;

    if (!vendorId || !name || !basePrice) {
        return res.status(400).json({ success: false, message: 'Missing food details.' });
    }

    try {
        const vendors = db.getVendors();
        const vendor = vendors.find(v => Number(v.id) === Number(vendorId));
        
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Restaurant profile not found.' });
        }

        const newDish = {
            id: Date.now(),
            name: name,
            basePrice: Number(basePrice),
            description: description || '',
            imageUrl: imageUrl || '',
            isPermanent: isPermanent !== undefined ? !!isPermanent : true,
            ingredients: ingredients || []
        };

        vendor.menu.push(newDish);
        db.saveVendors(vendors);

        res.status(201).json({
            success: true,
            message: 'Dish successfully added to the database!'
        });
    } catch (error) {
        console.error("Add Food Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 5. WIPE DAILY SPECIALS ENDPOINT (JSON)
// ==========================================
router.post('/clear-daily-menu', async (req, res) => {
    const { vendorId } = req.body;

    if (!vendorId) {
        return res.status(400).json({ success: false, message: 'Missing vendor details.' });
    }

    try {
        const vendors = db.getVendors();
        const vendor = vendors.find(v => Number(v.id) === Number(vendorId));

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Restaurant profile not found.' });
        }

        // Keep only permanent items
        vendor.menu = vendor.menu.filter(item => item.isPermanent === true);
        db.saveVendors(vendors);

        res.json({
            success: true,
            message: 'Daily menu cleared. Only permanent items remain!'
        });
    } catch (error) {
        console.error("Clear Menu Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 6. PLACE CUSTOMER ORDER ENDPOINT (JSON)
// ==========================================
router.post('/place-order', async (req, res) => {
    const { vendorId, itemName, finalPrice, modifications, deliveryAddress } = req.body;

    if (!vendorId || !itemName) {
        return res.status(400).json({ success: false, message: 'Missing order details.' });
    }

    try {
        const orders = db.getOrders();
        const newOrderId = `order-${Date.now()}`;
        
        const newOrder = {
            orderId: newOrderId,
            vendorId: Number(vendorId),
            itemName: itemName,
            finalPrice: Number(finalPrice),
            modifications: modifications || '',
            deliveryAddress: deliveryAddress || '',
            status: 'Placed'
        };

        orders.push(newOrder);
        db.saveOrders(orders);

        res.status(201).json({
            success: true,
            message: '🎉 Order placed safely! Keep track of status live on screen.',
            order: newOrder
        });
    } catch (error) {
        console.error("Place Order Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 7. LIVE ORDERS PIPELINE STREAM ENDPOINT
// ==========================================
router.get('/orders-stream', async (req, res) => {
    try {
        const orders = db.getOrders();
        res.json(orders);
    } catch (error) {
        console.error("Orders Stream Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 8. UPDATE ORDER STATUS ENDPOINT (JSON)
// ==========================================
router.post('/update-order-status', async (req, res) => {
    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
        return res.status(400).json({ success: false, message: 'Missing update details.' });
    }

    try {
        const orders = db.getOrders();
        const order = orders.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        order.status = newStatus;
        db.saveOrders(orders);

        res.json({
            success: true,
            message: 'Order status updated successfully!',
            order: order
        });
    } catch (error) {
        console.error("Update Order Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;