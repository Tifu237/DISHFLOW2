const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Bind the updated modular routing configurations
app.use('/api/vendors', require('./routes/vendorRoutes'));
// Quick Login route for testing authentication connections
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt received for:", email);

  // For testing right now, let's auto-approve any login as an 'owner'
  return res.status(200).json({
    success: true,
    role: 'owner',
    email: email
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Open Marketplace Vendor Engine running on Port ${PORT}`);
});