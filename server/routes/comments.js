import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';
import { validateComment, validateIdParam } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticate, validateComment, commentController.createComment);
router.get('/post/:postId', commentController.getComments);
router.get('/:id', validateIdParam, commentController.getComment);
router.put('/:id', authenticate, validateIdParam, commentController.updateComment);
router.delete('/:id', authenticate, validateIdParam, commentController.deleteComment);

export default router;