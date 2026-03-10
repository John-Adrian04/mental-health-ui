const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Allow your GitHub Pages site to access this API
app.use(cors());
app.use(express.json());

// 2. Database connection using Environment Variables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 3. Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database!');
        connection.release();
    }
});

// 4. Sample Route (to check if the API is alive)
app.get('/', (req, res) => {
    res.send('Mental Health UI Backend is running on Render!');
});

// 5. Example API Route (Replace with your actual table names)
app.get('/api/test', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Database is responding!", data: results });
    });
});

// 6. Port configuration for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});
