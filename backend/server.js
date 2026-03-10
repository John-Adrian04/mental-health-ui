import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // Fixes "self-signed certificate" error
    }
});

// 3. Verify Connection on Startup
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to Railway MySQL Database!');
        connection.release();
    }
});

// 4. API Routes

// TEST ROUTE: Check if API is alive
app.get('/', (req, res) => {
    res.send('Mental Health API is online and healthy.');
});

// GET ROUTE: Fetch all entries to show in the UI
app.get('/api/history', (req, res) => {
    // Note: 'created_at' works even if the type is DATE or TIMESTAMP
    const sql = "SELECT * FROM entries ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Fetch Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST ROUTE: Save a new entry from the UI
app.post('/api/mood', (req, res) => {
    const { mood, note } = req.body;

    // Safety check: Don't save empty data
    if (!mood) {
        return res.status(400).json({ error: "Mood is required to save an entry." });
    }

    // IMPORTANT: If your column in Railway is named 'nood' instead of 'mood',
    // change 'mood' to 'nood' in the line below:
    const sql = "INSERT INTO entries (mood, note) VALUES (?, ?)";
    
    db.query(sql, [mood, note], (err, result) => {
        if (err) {
            console.error("❌ Insert Error:", err.message);
            // This sends the exact error back to your browser console (F12)
            return res.status(500).json({ error: err.message });
        }
        
        console.log("✅ Successfully saved to Railway. ID:", result.insertId);
        res.json({ 
            message: "Entry saved successfully!", 
            id: result.insertId 
        });
    });
});

// 5. Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});