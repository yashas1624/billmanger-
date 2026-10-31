import express from 'express';
import cors from 'cors';
import { createBillRouter } from './routes/billRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';
import { createWorkerRouter } from './routes/workerRoutes.js';
import { defaultStore } from './database/store.js';
import { defaultScheduler } from './workers/scheduler.js';

export function createApp({
  store = defaultStore,
  scheduler = defaultScheduler,
  notificationService = null
} = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'bill-manager-api',
      timestamp: new Date().toISOString()
    });
  });

  // API Routes
  app.use('/api/bills', createBillRouter(store));
  app.use('/api/users', createUserRouter(store));
  app.use('/api/worker', createWorkerRouter({ store, scheduler, notificationService }));

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.path}`
    });
  });

  // Global Error Handler
  app.use((err, req, res, _next) => {
    console.error('[ServerError]', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  });

  return app;
}
