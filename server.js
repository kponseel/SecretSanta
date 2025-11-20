const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Serve static files from the React build directory (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR);
}

// --- API Endpoints ---

// Save Event Data
app.post('/api/save', (req, res) => {
    try {
        const data = req.body;
        if (!data || !data.details || !data.details.id) {
            return res.status(400).json({ success: false, message: 'Invalid data structure' });
        }
        
        // Sanitize ID to prevent directory traversal
        const id = data.details.id.replace(/[^a-z0-9-]/gi, '');
        const filePath = path.join(DATA_DIR, `${id}.json`);
        
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true });
        });
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ success: false });
    }
});

// Get Event Data
app.get('/api/get', (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        
        const safeId = id.toString().replace(/[^a-z0-9-]/gi, '');
        const filePath = path.join(DATA_DIR, `${safeId}.json`);
        
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return res.status(500).json({ error: 'Read error' });
                try {
                    res.json(JSON.parse(data));
                } catch (parseErr) {
                    res.status(500).json({ error: 'Data corruption' });
                }
            });
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Catch-All Route ---
// For any request that doesn't match an API route or static file, serve index.html.
// This enables client-side routing in React.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});