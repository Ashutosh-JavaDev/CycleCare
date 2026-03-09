import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import authRoutes from './routes/auth.js';
import periodRoutes from './routes/periods.js';
import symptomRoutes from './routes/symptoms.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import { initializeDatabase, pool } from './config/db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const frontendDistPath = path.resolve(__dirname, '../dist');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CycleCare API' });
});

app.get('/api/health/dependencies', async (_req, res) => {
  let db = false;
  let smtpConnected = false;
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

  try {
    await pool.query('SELECT 1');
    db = true;
  } catch {
    db = false;
  }

  if (smtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
      });
      await transporter.verify();
      smtpConnected = true;
    } catch {
      smtpConnected = false;
    }
  }

  res.json({
    api: true,
    db,
    smtpConfigured,
    smtpConnected,
    message: smtpConfigured
      ? smtpConnected
        ? 'SMTP ready.'
        : 'SMTP configured but connection/auth failed.'
      : 'SMTP not configured.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Route aliases make the API accessible in environments that strip '/api'.
app.use('/auth', authRoutes);

app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
    return next();
  }
  return res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const port = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`CycleCare API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  }
}

startServer();