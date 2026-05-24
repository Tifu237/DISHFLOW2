// backend/routes/VendorRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Points straight to your new MySQL bridge
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// ==========================================
// 🚀 1. OWNER REGISTRATION ENDPOINT (MySQL)
// ==========================================
router.post('/register-owner', async (req, res) => {
    const { email, password, restaurantName, country, city, location, currency } = req.body;

    if (!email || !password || !restaurantName) {
        return res.status(400).json({ success: false, message: 'Missing registration details.' });
    }

    try {
        // Check if the shop name already exists in the database
        const [existingUsers] = await db.query('SELECT * FROM vendors WHERE shop_name = ?', [restaurantName]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'A shop with this name is already registered.' });
        }

        // Insert the new shop into the 'vendors' table
        const [result] = await db.query(
            'INSERT INTO vendors (shop_name, town, currency) VALUES (?, ?, ?)',
            [restaurantName, `${city}, ${location}`, currency || 'CFA']
        );

        res.status(201).json({
            success: true,
            message: 'Owner and Shop successfully registered in the database!',
            vendorId: result.insertId
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ success: false, message: 'Database transaction failed.', error: error.message });
    }
});

// ==========================================
// 🚀 2. OWNER LOGIN ENDPOINT (MySQL)
// ==========================================
router.post('/login-owner', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find the vendor matching this shop name/email
        const [vendors] = await db.query('SELECT * FROM vendors WHERE shop_name = ?', [email]);

        if (vendors.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid owner credentials.' });
        }

        const shop = vendors[0];

        res.json({ 
            success: true, 
            ownerId: `owner-${shop.id}`, 
            restaurant: {
                id: shop.id,
                shopName: shop.shop_name,
                town: shop.town,
                currency: shop.currency
            } 
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: 'Database login transaction failed.' });
    }
});

// ==========================================
// 🚀 3. FETCH ALL VENDORS ENDPOINT (MySQL)
// ==========================================
router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vendors');
        res.json(rows);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🚀 4. MANAGE DISHES ENDPOINT (MySQL)
// ==========================================
router.post('/add-food-flexible', async (req, res) => {
    const { vendorId, name, basePrice, description, imageUrl, ingredients, isPermanent } = req.body;

    if (!vendorId || !name || !basePrice) {
        return res.status(400).json({ success: false, message: 'Missing food details.' });
    }

    try {
        // Check if the restaurant exists
        const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [vendorId]);
        if (vendors.length === 0) {
            return res.status(404).json({ success: false, message: 'Restaurant profile not found.' });
        }

        // Insert the new dish linked to the vendor ID
        await db.query(
            'INSERT INTO dishes (vendor_id, name, base_price) VALUES (?, ?, ?)',
            [vendorId, name, basePrice]
        );

        res.status(201).json({
            success: true,
            message: 'Dish successfully added to the database!'
        });
    } catch (error) {
        console.error("Add Food Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;