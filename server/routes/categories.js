import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateCategory, validateIdParam } from '../middleware/validation.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', validateIdParam, categoryController.getCategory);
router.post('/', authenticate, authorize('admin'), validateCategory, categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), validateIdParam, validateCategory, categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), validateIdParam, categoryController.deleteCategory);

export default router;