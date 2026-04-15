import { pool } from '../config/db.js';

export async function createSymptomLog({ userId, date, symptomType, painLevel, notes }) {
  const { rows } = await pool.query(
    'INSERT INTO symptoms (user_id, date, symptom_type, pain_level, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [userId, date, symptomType, painLevel, notes || '']
  );
  return { id: rows[0].id, userId, date, symptomType, painLevel, notes };
}

export async function listSymptoms(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM symptoms WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return rows;
}
