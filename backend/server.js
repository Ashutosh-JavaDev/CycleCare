import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import authRoutes from './routes/auth.js';
import periodRoutes from './routes/periods.js';
import symptomRoutes from './routes/symptoms.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import { initializeDatabase, pool } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health/dependencies', async (_req, res) => {
  let db = false;
  const smtpConfigured = Boolean(process.env.RESEND_API_KEY);

  try {
    await pool.query('SELECT 1');
    db = true;
  } catch (error) {
    console.error("Database check failed:", error.message);
  }

  res.json({
    api: true,
    db,
    smtpConfigured,
    smtpConnected: smtpConfigured,
    message: smtpConfigured ? 'Email service ready.' : 'Email service not configured.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

app.use('/auth', authRoutes);

// Serve built frontend in production
const frontendDistPath = path.resolve(__dirname, '../dist');
if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const port = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, 'localhost', () => {
      console.log(`CycleCare API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  }
}

startServer();
