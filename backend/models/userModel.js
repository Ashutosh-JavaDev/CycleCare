import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, age, cycleLength }) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password_hash, age, cycle_length) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [name, email, passwordHash, age, cycleLength || 28]
  );

  return {
    id: rows[0].id,
    name,
    email,
    age,
    cycle_length: cycleLength || 28,
  };
}

export async function upsertEmailVerification({ email, otpHash, expiresAt }) {
  await pool.query(
    `INSERT INTO email_verifications (email, otp_hash, expires_at, verified)
     VALUES ($1, $2, $3, FALSE)
     ON CONFLICT (email) DO UPDATE SET otp_hash = EXCLUDED.otp_hash, expires_at = EXCLUDED.expires_at, verified = FALSE`,
    [email, otpHash, expiresAt]
  );
}

export async function findEmailVerification(email) {
  const { rows } = await pool.query('SELECT * FROM email_verifications WHERE email = $1', [email]);
  return rows[0] || null;
}

export async function markEmailVerified(email) {
  await pool.query('UPDATE email_verifications SET verified = TRUE WHERE email = $1', [email]);
}

export async function clearEmailVerification(email) {
  await pool.query('DELETE FROM email_verifications WHERE email = $1', [email]);
}
