import { pool } from '../config/db.js';

export async function getAdminOverview(_req, res) {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [[{ activeUsers }]] = await pool.query(
    'SELECT COUNT(DISTINCT user_id) AS activeUsers FROM symptoms WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
  );
  const [symptomStats] = await pool.query(
    'SELECT symptom_type, COUNT(*) AS count FROM symptoms GROUP BY symptom_type ORDER BY count DESC LIMIT 5'
  );
  const [[{ avgCycleLength }]] = await pool.query(
    'SELECT ROUND(AVG(cycle_length), 0) AS avgCycleLength FROM period_logs WHERE cycle_length IS NOT NULL'
  );

  return res.json({ totalUsers, activeUsers, avgCycleLength, symptomStats });
}