import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(morgan('dev')); // Professional Logging
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 50, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/', limiter); // Security Rate Limiting

const getAIResponse = (mood) => {
    const responses = {
        '😊 Radiant': "That's amazing! Keep that positive energy flowing!",
        '😐 Balanced': "Balance is beautiful. You're doing a great job.",
        '😢 Healing': "Healing is a journey. Be kind to yourself today.",
        '😠 Overwhelmed': "Take a deep breath. Focus on one small thing at a time."
    };
    return responses[mood] || "Thank you for sharing. I'm here for you.";
};

// --- CONNECT TO AIVEN CLOUD DATABASE ---
const db = mysql.createPool({
    // Uses the Aiven URI from Render environment variables
    uri: process.env.DATABASE_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
            message: "Saved to cloud!", 
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