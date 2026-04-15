import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : false,
});

export async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        cycle_length INT DEFAULT 28,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        email VARCHAR(100) PRIMARY KEY,
        otp_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS period_logs (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        cycle_length INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS symptoms (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        symptom_type VARCHAR(100) NOT NULL,
        pain_level INT,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS foods (
        id SERIAL PRIMARY KEY,
        food_name VARCHAR(120) NOT NULL,
        description TEXT,
        benefits TEXT,
        category VARCHAR(80) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id SERIAL PRIMARY KEY,
        medicine_name VARCHAR(120) NOT NULL,
        usage_description TEXT,
        recommended_dosage VARCHAR(120),
        warning TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id SERIAL PRIMARY KEY,
        hospital_name VARCHAR(160) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        contact_number VARCHAR(30),
        emergency_number VARCHAR(30),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        anonymous BOOLEAN DEFAULT TRUE,
        upvotes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
}
