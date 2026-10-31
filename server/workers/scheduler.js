import cron from 'node-cron';
import { runDailyWorker } from './reminderWorker.js';
import { defaultStore } from '../database/store.js';

export class BillScheduler {
  /**
   * @param {Object} [options]
   * @param {string} [options.cronExpression='0 9 * * *'] Default: Daily at 9:00 AM
   * @param {import('../database/store').Store} [options.store=defaultStore]
   * @param {import('../services/notification').NotificationService} [options.notificationService]
   * @param {boolean} [options.autoStart=false]
   */
  constructor({
    cronExpression = '0 9 * * *',
    store = defaultStore,
    notificationService = null,
    autoStart = false
  } = {}) {
    this.cronExpression = cronExpression;
    this.store = store;
    this.notificationService = notificationService;
    this.task = null;
    this.isRunning = false;
    this.lastRunAt = null;
    this.lastRunResult = null;

    if (autoStart) {
      this.start();
    }
  }

  start() {
    if (this.isRunning) {
      return this;
    }

    if (!cron.validate(this.cronExpression)) {
      throw new Error(`Invalid cron expression: "${this.cronExpression}"`);
    }

    this.task = cron.schedule(this.cronExpression, async () => {
      console.log(`[BillScheduler] Starting scheduled daily check at ${new Date().toISOString()}...`);
      try {
        const result = await this.triggerNow();
        console.log(`[BillScheduler] Completed check. Reminders: ${result.reminders.sentCount}, Overdue updated: ${result.overdue.overdueUpdatedCount}`);
      } catch (err) {
        console.error('[BillScheduler] Error during scheduled run:', err);
      }
    });

    this.isRunning = true;
    console.log(`[BillScheduler] Scheduler started with schedule: "${this.cronExpression}"`);
    return this;
  }

  stop() {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
    this.isRunning = false;
    console.log('[BillScheduler] Scheduler stopped.');
    return this;
  }

  async triggerNow(targetDate = new Date()) {
    this.lastRunAt = new Date().toISOString();
    const result = await runDailyWorker({
      currentDate: targetDate,
      store: this.store,
      notificationService: this.notificationService
    });
    this.lastRunResult = result;
    return result;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cronExpression: this.cronExpression,
      lastRunAt: this.lastRunAt,
      lastRunResult: this.lastRunResult
    };
  }
}

// Global default scheduler instance
export const defaultScheduler = new BillScheduler();

