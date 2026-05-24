const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Bind the updated modular routing configurations
app.use('/api/vendors', require('./routes/vendorRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Open Marketplace Vendor Engine running on Port ${PORT}`);
});