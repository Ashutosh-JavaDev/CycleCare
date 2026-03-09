import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, age, cycleLength }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, age, cycle_length) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, age, cycleLength || 28]
  );

  return {
    id: result.insertId,
    name,
    email,
    age,
    cycle_length: cycleLength || 28,
  };
}

export async function upsertEmailVerification({ email, otpHash, expiresAt }) {
  await pool.query(
    `INSERT INTO email_verifications (email, otp_hash, expires_at, verified)
     VALUES (?, ?, ?, FALSE)
     ON DUPLICATE KEY UPDATE otp_hash = VALUES(otp_hash), expires_at = VALUES(expires_at), verified = FALSE`,
    [email, otpHash, expiresAt]
  );
}

export async function findEmailVerification(email) {
  const [rows] = await pool.query('SELECT * FROM email_verifications WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function markEmailVerified(email) {
  await pool.query('UPDATE email_verifications SET verified = TRUE WHERE email = ?', [email]);
}

export async function clearEmailVerification(email) {
  await pool.query('DELETE FROM email_verifications WHERE email = ?', [email]);
}