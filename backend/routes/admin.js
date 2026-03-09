import { Router } from 'express';
import { getAdminOverview } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/overview', authenticateToken, requireAdmin, getAdminOverview);

export default router;