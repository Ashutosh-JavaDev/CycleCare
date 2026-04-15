import { pool } from '../config/db.js';

export async function createPeriodLog({ userId, startDate, endDate, cycleLength }) {
  const { rows } = await pool.query(
    'INSERT INTO period_logs (user_id, start_date, end_date, cycle_length) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId, startDate, endDate, cycleLength || null]
  );
  return { id: rows[0].id, userId, startDate, endDate, cycleLength };
}

export async function listPeriodLogs(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM period_logs WHERE user_id = $1 ORDER BY start_date DESC',
    [userId]
  );
  return rows;
}
