import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import commentRoutes from './routes/comments.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import database connection function
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Swagger Configuration
// ======================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Blog API',
      version: '1.0.0',
      description: 'Documentation for MERN Blog Application API',
      contact: {
        name: 'API Support',
        url: 'https://yourdomain.com/support',
        email: 'support@yourdomain.com'
      }
    },
    servers: [
      { 
        url: `http://localhost:${PORT}`, 
        description: 'Development server' 
      },
      { 
        url: 'https://your-production-url.com', 
        description: 'Production server' 
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            role: { 
              type: 'string', 
              enum: ['user', 'admin'],
              default: 'user'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string', nullable: true },
            category: { type: 'string' },
            tags: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: [
    './routes/*.js', 
    './middleware/errorHandler.js',
    './models/*.js'
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Initialize database connection
connectDB();

// MongoDB connection events
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// Swagger UI Endpoint
// ======================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// API Documentation
// ======================
/**
 * @swagger
 * /:
 *   get:
 *     summary: API status check
 *     description: Returns API status information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: string
 *                     users:
 *                       type: string
 *       304:
 *         description: API status (cached response)
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server health check
 *     description: Returns server health status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 database:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MERN Blog API is running!',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
      users: '/api/users'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;