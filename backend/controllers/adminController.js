import { pool } from '../config/db.js';

export async function getAdminOverview(_req, res) {
  const { rows: totalUsersRows } = await pool.query('SELECT COUNT(*) AS "totalUsers" FROM users');
  const { rows: activeUsersRows } = await pool.query(
    "SELECT COUNT(DISTINCT user_id) AS \"activeUsers\" FROM symptoms WHERE date >= CURRENT_DATE - INTERVAL '30 days'"
  );
  const { rows: symptomStats } = await pool.query(
    'SELECT symptom_type, COUNT(*) AS count FROM symptoms GROUP BY symptom_type ORDER BY count DESC LIMIT 5'
  );
  const { rows: avgRows } = await pool.query(
    'SELECT ROUND(AVG(cycle_length), 0) AS "avgCycleLength" FROM period_logs WHERE cycle_length IS NOT NULL'
  );

  return res.json({
    totalUsers: totalUsersRows[0].totalUsers,
    activeUsers: activeUsersRows[0].activeUsers,
    avgCycleLength: avgRows[0].avgCycleLength,
    symptomStats,
  });
}
