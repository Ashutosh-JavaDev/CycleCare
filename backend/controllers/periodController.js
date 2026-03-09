import { createPeriodLog, listPeriodLogs } from '../models/periodModel.js';

export async function createPeriod(req, res) {
  const { startDate, endDate, cycleLength } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required.' });
  }

  const log = await createPeriodLog({
    userId: req.user.id,
    startDate,
    endDate,
    cycleLength,
  });

  return res.status(201).json(log);
}

export async function getPeriods(req, res) {
  const rows = await listPeriodLogs(req.user.id);
  return res.json(rows);
}