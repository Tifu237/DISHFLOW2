// backend/config/db.js
const mysql = require('mysql2');

// Configure the live connection to your MySQL Server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD', // <-- Change this to your actual MySQL root password!
    database: 'food_delivery_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise-based pool for clean async queries
const db = pool.promise();
module.exports = db;