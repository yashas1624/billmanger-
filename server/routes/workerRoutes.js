import express from 'express';
import { runDailyWorker } from '../workers/reminderWorker.js';
import { defaultStore } from '../database/store.js';
import { defaultScheduler } from '../workers/scheduler.js';

export function createWorkerRouter({
  store = defaultStore,
  scheduler = defaultScheduler,
  notificationService = null
} = {}) {
  const router = express.Router();

  /**
   * POST /api/worker/run-reminders
   * Manually executes the reminder dispatch and overdue checks
   */
  router.post('/run-reminders', async (req, res) => {
    try {
      const { targetDate } = req.body || {};
      let evaluationDate = new Date();

      if (targetDate) {
        const parsed = new Date(targetDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({
            success: false,
            error: 'targetDate must be a valid date or ISO string'
          });
        }
        evaluationDate = parsed;
      }

      const result = await runDailyWorker({
        currentDate: evaluationDate,
        store,
        notificationService
      });

      return res.json({
        success: true,
        message: 'Daily reminder worker executed successfully',
        result
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * GET /api/worker/status
   */
  router.get('/status', (req, res) => {
    return res.json({
      success: true,
      scheduler: scheduler.getStatus()
    });
  });

  /**
   * POST /api/worker/scheduler/start
   */
  router.post('/scheduler/start', (req, res) => {
    try {
      scheduler.start();
      return res.json({
        success: true,
        message: 'Scheduler started',
        scheduler: scheduler.getStatus()
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  /**
   * POST /api/worker/scheduler/stop
   */
  router.post('/scheduler/stop', (req, res) => {
    scheduler.stop();
    return res.json({
      success: true,
      message: 'Scheduler stopped',
      scheduler: scheduler.getStatus()
    });
  });

  return router;
}
