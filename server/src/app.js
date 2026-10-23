import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security: configure CORS for dev frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (
        config.corsOrigin.includes(origin) ||
        config.corsOrigin.includes('*') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Standard parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root welcome
app.get('/', (req, res) => {
  res.json({
    academy: 'Spellbound Wizarding Academy API',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'Operational'
  });
});

// Mount modular API routes
app.use('/api', apiRoutes);

// Fallback 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized safe error handler
app.use(errorHandler);

export default app;
