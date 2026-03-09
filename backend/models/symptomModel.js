import { pool } from '../config/db.js';

export async function createSymptomLog({ userId, date, symptomType, painLevel, notes }) {
  const [result] = await pool.query(
    'INSERT INTO symptoms (user_id, date, symptom_type, pain_level, notes) VALUES (?, ?, ?, ?, ?)',
    [userId, date, symptomType, painLevel, notes || '']
  );
  return { id: result.insertId, userId, date, symptomType, painLevel, notes };
}

export async function listSymptoms(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC',
    [userId]
  );
  return rows;
}