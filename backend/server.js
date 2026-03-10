import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resend } from 'resend';
import authRoutes from './routes/auth.js';
import periodRoutes from './routes/periods.js';
import symptomRoutes from './routes/symptoms.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import { initializeDatabase, pool } from './config/db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();
const frontendDistPath = path.resolve(__dirname, '../dist');

app.use(cors());
app.use(express.json());
app.get('/api/health/dependencies', async (_req, res) => {

  let db = false;
  let smtpConnected = false;

  // Check if Resend key exists
  const smtpConfigured = Boolean(process.env.RESEND_API_KEY);

  try {
    await pool.query('SELECT 1');
    db = true;
  } catch (error) {
    db = false;
    console.error("Database check failed:", error.message);
  }

  if (smtpConfigured) {
    try {

      await resend.emails.send({
        from: "CycleCare <onboarding@resend.dev>",
        to: process.env.SMTP_USER || "test@example.com",
        subject: "CycleCare Email Test",
        html: "<p>Email service working</p>",
      });

      smtpConnected = true;

    } catch (error) {
      console.error("Email service failed:", error.message);
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
        ? 'Email service ready.'
        : 'Email service failed.'
      : 'Email service not configured.',
  });

});
app.use('/api/auth', authRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Route aliases make the API accessible in environments that strip '/api'.
app.use('/auth', authRoutes);


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