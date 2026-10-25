/**
 * Local development server
 * Serves the Vite app and proxies API requests to the api/ directory
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Import API routes
const usersRoute    = await import('./api/users.js');
const logsRoute     = await import('./api/logs.js');
const transcribeRoute = await import('./api/transcribe.js');
const extractRoute  = await import('./api/extract.js');
const reportRoute   = await import('./api/report.js');

// Proxy API routes - adapt Express req/res to Vercel format
const toHandler = (mod) => async (req, res) => {
  try {
    const mockReq = {
      method: req.method,
      query: req.query,
      body: req.body
    };

    const mockRes = {
      status(code) {
        res.status(code);
        return this;
      },
      setHeader(key, value) {
        res.setHeader(key, value);
        return this;
      },
      end(data) {
        res.end(data);
      },
      json(body) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      }
    };

    await mod.default(mockReq, mockRes);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

app.use('/api/users',    toHandler(usersRoute));
app.use('/api/logs',     toHandler(logsRoute));
app.use('/api/transcribe', toHandler(transcribeRoute));
app.use('/api/extract',  toHandler(extractRoute));
app.use('/api/report',   toHandler(reportRoute));

// Create Vite server
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

app.use(vite.middlewares);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
