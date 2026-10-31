import { createApp } from './app.js';
import { defaultStore } from './database/store.js';
import { initializeDatabase } from './database/seed.js';
import { defaultScheduler } from './workers/scheduler.js';

const PORT = process.env.PORT || 5000;

// Initialize seed data
initializeDatabase(defaultStore);

// Initialize app
const app = createApp({
  store: defaultStore,
  scheduler: defaultScheduler
});

// Start background cron scheduler (daily 9:00 AM)
defaultScheduler.start();

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Bill Manager Backend running on port ${PORT}`);
  console.log(` API Base: http://localhost:${PORT}/api`);
  console.log(` Daily Reminder Worker: ${defaultScheduler.cronExpression}`);
  console.log(`===============================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  defaultScheduler.stop();
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  defaultScheduler.stop();
  server.close(() => process.exit(0));
});

export { app, server, defaultScheduler };
