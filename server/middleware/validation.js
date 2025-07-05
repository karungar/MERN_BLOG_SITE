import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Enhanced validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors for better frontend consumption
    const formattedErrors = errors.array().map(err => ({
      param: err.param,
      message: err.msg,
      location: err.location,
      value: err.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// MongoDB ObjectId validation helper
const isValidObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

// Common validation rules
const usernameRules = body('username')
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be between 3 and 30 characters')
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage('Username can only contain letters, numbers, and underscores');

const emailRules = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email')
  .isLength({ max: 100 })
  .withMessage('Email must be less than 100 characters');

const passwordRules = body('password')
  .isLength({ min: 6, max: 100 })
  .withMessage('Password must be between 6 and 100 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

// User validation rules
export const validateRegister = [
  usernameRules,
  emailRules,
  passwordRules,
  handleValidationErrors
];

export const validateLogin = [
  emailRules,
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Post validation rules
export const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('category')
    .custom(isValidObjectId)
    .withMessage('Invalid category ID format'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array (max 10 items)'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  handleValidationErrors
];

export const validateUpdatePost = [
  param('id')
    .custom(isValidObjectId)
    .withMessage('Invalid post ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('category')
    .optional()
    .custom(isValidObjectId)
    .withMessage('Invalid category ID format'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array (max 10 items)'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  handleValidationErrors
];

// Category validation rules
export const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name is required and must be less than 100 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Slug must be between 1 and 100 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  handleValidationErrors
];

// Comment validation rules
export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content is required and must be less than 1000 characters'),
  body('post')
    .custom(isValidObjectId)
    .withMessage('Invalid post ID format'),
  body('parent')
    .optional()
    .custom(isValidObjectId)
    .withMessage('Invalid parent comment ID format'),
  handleValidationErrors
];

// Query validation rules
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'popular'])
    .withMessage('Sort must be newest, oldest, or popular'),
  handleValidationErrors
];

// ID parameter validation
export const validateIdParam = [
  param('id')
    .custom(isValidObjectId)
    .withMessage('Invalid ID format'),
  handleValidationErrors
];