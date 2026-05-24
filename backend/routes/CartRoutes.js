const express = require('express');
const router = express.Router();
const { activeServerCart } = require('../config/db');

router.post('/', (req, res) => {
  const { name, vendorName, finalPrice, choicesSummary } = req.body;
  activeServerCart.push({ cartId: Date.now(), name, vendorName, totalPrice: finalPrice, summary: choicesSummary });
  res.json({ success: true, cart: activeServerCart });
});

module.exports = router;