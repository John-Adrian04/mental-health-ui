import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'; // Professional Logger
import { rateLimit } from 'express-rate-limit'; // Security Rate Limiter

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// --- EXTRA CREDIT: PROFESSIONAL LOGGING ---
// This will log every request automatically (e.g., "GET /api/history 200")
app.use(morgan('dev')); 

app.use(cors());
app.use(express.json());

// --- EXTRA CREDIT: RATE LIMITING ---
// Limits each IP to 50 requests per 15 minutes to prevent abuse
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 50, 
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/', limiter); // Apply security only to API routes

// Mock AI Engine
const getAIResponse = (mood) => {
    const responses = {
        '😊 Radiant': "That's amazing! Keep that positive energy flowing!",
        '😐 Balanced': "Balance is beautiful. You're doing a great job.",
        '😢 Healing': "Healing is a journey. Be kind to yourself today.",
        '😠 Overwhelmed': "Take a deep breath. Focus on one small thing at a time."
    };
    return responses[mood] || "Thank you for sharing. I'm here for you.";
};

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'mental-health-db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

app.get('/api/history', (req, res) => {
    const sql = "SELECT * FROM entries ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/mood', (req, res) => {
    const { mood, note } = req.body;
    if (!mood) return res.status(400).json({ error: "Mood is required" });

    const aiMessage = getAIResponse(mood);
    const sql = "INSERT INTO entries (mood, note) VALUES (?, ?)";

    db.query(sql, [mood, note], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            message: "Saved locally!", 
            aiResponse: aiMessage 
        });
    });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API running" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});