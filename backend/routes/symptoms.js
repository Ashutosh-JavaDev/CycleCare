import { Router } from 'express';
import { createSymptom, getSymptoms } from '../controllers/symptomController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getSymptoms);
router.post('/', createSymptom);

export default router;