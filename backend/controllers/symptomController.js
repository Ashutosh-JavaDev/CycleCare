import { createSymptomLog, listSymptoms } from '../models/symptomModel.js';

export async function createSymptom(req, res) {
  const { date, symptomType, painLevel, notes } = req.body;

  if (!date || !symptomType) {
    return res.status(400).json({ message: 'Date and symptom type are required.' });
  }

  const log = await createSymptomLog({
    userId: req.user.id,
    date,
    symptomType,
    painLevel,
    notes,
  });

  return res.status(201).json(log);
}

export async function getSymptoms(req, res) {
  const rows = await listSymptoms(req.user.id);
  return res.json(rows);
}