import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve static files from the React build directory (dist)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.log('info: dist directory not found. This is expected in dev mode if vite is running separately.');
}

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)){
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error('Failed to create data directory:', e);
    }
}

// --- API Endpoints ---

// Save Event Data
app.post('/api/save', (req, res) => {
    try {
        const data = req.body;
        if (!data || !data.details || !data.details.id) {
            return res.status(400).json({ success: false, message: 'Invalid data structure' });
        }
        
        console.log(`[API] Saving event: ${data.details.id}`);

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
        
        console.log(`[API] Fetching event: ${id}`);

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
            console.log(`[API] Event not found: ${safeId}`);
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Catch-All Route for SPA ---
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // If index.html is missing, we might be in dev mode or build failed
        res.status(404).send('App not built or not found. Please run npm run build.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});