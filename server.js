
/**
 * Les Samaritains (LSM) - Express Server
 * Simple static file server for the LSM website
 */

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const COUNTER_FILE = path.join(__dirname, 'counter-data.json');

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware
app.use(express.json());

// Counter endpoint
app.post('/counter', (req, res) => {
    try {
        const tz = new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' });
        const today = new Date(tz).toISOString().split('T')[0];

        let data = { total: 0, days: {} };

        if (fs.existsSync(COUNTER_FILE)) {
            const content = fs.readFileSync(COUNTER_FILE, 'utf8');
            const parsed = JSON.parse(content);
            if (parsed && parsed.total !== undefined) {
                data = parsed;
            }
        }

        data.total = (data.total || 0) + 1;
        data.days[today] = (data.days[today] || 0) + 1;

        fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            counters: {
                total: data.total,
                today: data.days[today]
            }
        });
    } catch (error) {
        console.error('Counter error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/counter', (req, res) => {
    try {
        let data = { total: 0, days: {} };
        if (fs.existsSync(COUNTER_FILE)) {
            data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
        }

        const tz = new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' });
        const today = new Date(tz).toISOString().split('T')[0];

        res.json({
            success: true,
            counters: {
                total: data.total || 0,
                today: data.days[today] || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve static files from current directory
app.use(express.static(__dirname, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// Fallback to index.html for SPA-like behavior (Express 5 compatible)
app.use((req, res, next) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        next();
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
    console.log(`LSM Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});