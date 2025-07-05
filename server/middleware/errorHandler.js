export const errorHandler = (err, req, res, next) => {
  // Default error structure
  const error = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  // Handle specific error types
  switch (true) {
    // JWT authentication errors
    case err.name === 'JsonWebTokenError':
      error.message = 'Invalid token';
      error.statusCode = 401;
      break;
      
    case err.name === 'TokenExpiredError':
      error.message = 'Token expired';
      error.statusCode = 401;
      break;
      
    // Mongoose validation errors
    case err.name === 'ValidationError':
      error.message = 'Validation Error';
      error.statusCode = 400;
      
      // Extract detailed validation messages
      if (err.errors) {
        error.errors = Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }));
      }
      break;
      
    // MongoDB duplicate key error (code 11000)
    case err.code === 11000:
      error.message = 'Resource already exists';
      error.statusCode = 409;
      
      // Extract duplicate field information
      if (err.keyValue) {
        error.field = Object.keys(err.keyValue)[0];
        error.value = Object.values(err.keyValue)[0];
      }
      break;
      
    // Mongoose CastError (invalid ObjectId format)
    case err.name === 'CastError':
      error.message = `Invalid ${err.path}: ${err.value}`;
      error.statusCode = 400;
      break;
      
    // Custom application errors
    case err.isOperational:
      // Already formatted by application
      break;
      
    // Unexpected errors (log with stack trace)
    default:
      // Log full error in development
      console.error('🚨 Unexpected Error:', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query
      });
      
      // Generic message in production
      if (process.env.NODE_ENV === 'production') {
        error.message = 'Internal Server Error';
      }
  }

  // Send response
  res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    
    // Development-only details
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
      type: err.name || 'UnknownError'
    }),
    
    // Additional context for specific errors
    ...(error.errors && { errors: error.errors }),
    ...(error.field && { field: error.field })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Utility to create consistent operational errors
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}