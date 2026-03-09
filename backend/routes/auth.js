import { Router } from 'express';
import { login, me, register, sendSignupOtp, verifySignupOtp } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendSignupOtp);
router.post('/request-otp', sendSignupOtp);
router.post('/sendOtp', sendSignupOtp);
router.post('/verify-otp', verifySignupOtp);
router.post('/verifyOtp', verifySignupOtp);
router.get('/me', authenticateToken, me);

export default router;