import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  incrementViewCount
} from '../controllers/postController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validatePost, validateUpdatePost, validateIdParam } from '../middleware/validation.js';
import upload from '../config/multer.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', validateIdParam, getPostById);
router.get('/slug/:slug', getPostBySlug);
router.patch('/:id/views', validateIdParam, incrementViewCount);

// Protected routes
router.post('/', authenticate, authorize(['admin', 'author']), validatePost, createPost, upload.single('featured_image'));
router.put('/:id', authenticate, authorize(['admin', 'author']), validateIdParam, validateUpdatePost, updatePost);
router.delete('/:id', authenticate, authorize(['admin', 'author']), validateIdParam, deletePost);

export default router;