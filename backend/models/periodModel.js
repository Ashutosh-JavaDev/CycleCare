import { pool } from '../config/db.js';

export async function createPeriodLog({ userId, startDate, endDate, cycleLength }) {
  const [result] = await pool.query(
    'INSERT INTO period_logs (user_id, start_date, end_date, cycle_length) VALUES (?, ?, ?, ?)',
    [userId, startDate, endDate, cycleLength || null]
  );
  return { id: result.insertId, userId, startDate, endDate, cycleLength };
}

export async function listPeriodLogs(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date DESC',
    [userId]
  );
  return rows;
}