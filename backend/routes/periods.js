import { Router } from 'express';
import { createPeriod, getPeriods } from '../controllers/periodController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getPeriods);
router.post('/', createPeriod);

export default router;