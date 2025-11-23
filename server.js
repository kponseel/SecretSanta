
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = '1.1.0';

// Middleware to parse JSON bodies
app.use(express.json({ limit: '4mb' })); // Vercel limit is ~4.5mb

// --- PERSISTENCE HELPERS ---

// 1. Vercel KV (Redis) - The "Real" Cloud Storage
// Requires KV_REST_API_URL and KV_REST_API_TOKEN env vars
const useKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

async function saveToKV(id, data) {
    if (!useKV) return false;
    try {
        const response = await fetch(`${process.env.KV_REST_API_URL}/set/sso_${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result.result === 'OK';
    } catch (e) {
        console.error("KV Save Error", e);
        return false;
    }
}

async function getFromKV(id) {
    if (!useKV) return null;
    try {
        const response = await fetch(`${process.env.KV_REST_API_URL}/get/sso_${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            },
        });
        const result = await response.json();
        // Redis GET returns the stringified object usually, or the object if parsed by the SDK
        if (result.result) {
            return typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
        }
        return null;
    } catch (e) {
        console.error("KV Get Error", e);
        return null;
    }
}

// 2. File System (Fallback)
// On Vercel, use /tmp. We ensure the variable is set correctly.
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');

// Ensure directory exists immediately if local, or defer if serverless (filesystem might be read-only until execution)
if (!process.env.VERCEL && !fs.existsSync(DATA_DIR)){
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error('Failed to create data directory:', e);
    }
}

// --- API Endpoints ---

// Health & Version Check
app.get(['/health', '/api/health', '/api/version'], (req, res) => {
    res.json({ 
        status: 'OK', 
        version: APP_VERSION,
        storage: useKV ? 'redis' : (process.env.VERCEL ? 'ephemeral-tmp' : 'disk')
    });
});

// Save Event Data
app.post('/api/save', async (req, res) => {
    try {
        const data = req.body;
        
        if (!data || !data.details || !data.details.id) {
            return res.status(400).json({ success: false, message: 'Invalid data structure' });
        }
        
        const id = data.details.id.replace(/[^a-z0-9-]/gi, '');
        // console.log(`[API] Saving event ID: ${id}`);

        // Try Cloud Storage First
        if (useKV) {
            await saveToKV(id, data);
            return res.json({ success: true, mode: 'server' });
        }

        // Fallback to File System (Ephemeral on Vercel)
        const filePath = path.join(DATA_DIR, `${id}.json`);
        
        // Ensure /tmp exists on Vercel before writing (redundant but safe)
        if (process.env.VERCEL && !fs.existsSync(DATA_DIR)) {
             try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(e) {}
        }

        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                console.error('Error saving file:', err);
                // Important: Return 500 so the frontend falls back to localStorage
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, mode: process.env.VERCEL ? 'local' : 'server' });
        });

    } catch (e) {
        console.error('Server error during save:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// Get Event Data
app.get('/api/get', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        
        const safeId = id.toString().replace(/[^a-z0-9-]/gi, '');
        
        // Try Cloud Storage First
        if (useKV) {
            const data = await getFromKV(safeId);
            if (data) return res.json(data);
        }

        // Fallback to File System
        const filePath = path.join(DATA_DIR, `${safeId}.json`);
        
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).json({ error: 'Read error' });
                }
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
        console.error('[API] Server error during get:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Static Files (Only for local dev) ---
if (!process.env.VERCEL) {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
}

// --- Start Server (Only if run directly) ---
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        if(useKV) console.log("Connected to Vercel KV");
    });
}

// Export for Vercel Serverless
export default app;
