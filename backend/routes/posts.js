import { Router } from 'express';
import { addPost, addPostComment, getPosts } from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getPosts);
router.post('/', authenticateToken, addPost);
router.post('/:id/comments', authenticateToken, addPostComment);

export default router;