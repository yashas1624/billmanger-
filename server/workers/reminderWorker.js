import { defaultStore } from '../database/store.js';
import { BillStatus } from '../models/Bill.js';
import { NotificationService } from '../services/notification/NotificationService.js';
import { toDateString, addDays, diffInDays } from '../utils/dateUtils.js';

/**
 * Runs the reminder dispatch check:
 * Queries all bills where status == 'PENDING', reminderSent == false,
 * and dueDate matches currentDate + user.reminderDaysBefore.
 * Sets reminderSent = true for each successfully processed bill.
 * 
 * @param {Object} options
 * @param {Date|string} [options.currentDate=new Date()]
 * @param {import('../database/store').Store} [options.store=defaultStore]
 * @param {NotificationService} [options.notificationService]
 * @returns {Promise<Object>} Summary of processed reminders
 */
export async function checkAndSendReminders({
  currentDate = new Date(),
  store = defaultStore,
  notificationService = new NotificationService()
} = {}) {
  const current = new Date(currentDate);
  const pendingBills = await store.getPendingBillsWithoutReminder();
  const matchedBills = [];
  const successfulDispatches = [];
  const failedDispatches = [];

  for (const bill of pendingBills) {
    // Retrieve associated user to obtain reminderDaysBefore
    let user = null;
    if (bill.userId) {
      user = await store.getUser(bill.userId);
    }

    // Default fallback preferences if user not found
    if (!user) {
      user = {
        id: bill.userId || 'default-user',
        name: 'Valued Customer',
        email: 'customer@example.com',
        pushToken: null,
        reminderDaysBefore: 3
      };
    }

    const reminderDaysBefore = Number.isInteger(user.reminderDaysBefore) ? user.reminderDaysBefore : 3;
    const targetReminderDate = addDays(current, reminderDaysBefore);

    // Check if bill.dueDate matches currentDate + user.reminderDaysBefore
    if (toDateString(bill.dueDate) === toDateString(targetReminderDate)) {
      matchedBills.push({ bill, user, reminderDaysBefore });
      const daysUntilDue = diffInDays(current, bill.dueDate);

      try {
        const dispatchResult = await notificationService.sendBillReminder(bill, user, daysUntilDue);

        if (dispatchResult.success) {
          // Set reminderSent = true to avoid duplicate alerts
          await store.updateBill(bill.id, {
            reminderSent: true,
            history: [
              {
                date: toDateString(current),
                action: `Reminder dispatched (${daysUntilDue} day(s) before due date)`,
                ref: 'Automated-Scheduler'
              },
              ...(bill.history || [])
            ]
          });

          successfulDispatches.push({
            billId: bill.id,
            title: bill.title,
            amount: bill.amount,
            dueDate: bill.dueDate,
            recipient: user.email || user.pushToken,
            providers: dispatchResult.results.filter(r => r.success).map(r => r.provider)
          });
        } else {
          failedDispatches.push({
            billId: bill.id,
            error: dispatchResult.error || 'All notification providers failed'
          });
        }
      } catch (err) {
        failedDispatches.push({
          billId: bill.id,
          error: err.message
        });
      }
    }
  }

  return {
    scannedPendingCount: pendingBills.length,
    matchedCount: matchedBills.length,
    sentCount: successfulDispatches.length,
    failedCount: failedDispatches.length,
    dispatched: successfulDispatches,
    failed: failedDispatches
  };
}

/**
 * Runs the auxiliary check:
 * Queries all bills where dueDate < currentDate and status == 'PENDING',
 * and updates their status to 'OVERDUE'.
 * 
 * @param {Object} options
 * @param {Date|string} [options.currentDate=new Date()]
 * @param {import('../database/store').Store} [options.store=defaultStore]
 * @returns {Promise<Object>} Summary of overdue updates
 */
export async function checkAndUpdateOverdue({
  currentDate = new Date(),
  store = defaultStore
} = {}) {
  const current = new Date(currentDate);
  const overduePendingBills = await store.getOverduePendingBills(current);
  const updatedOverdue = [];

  for (const bill of overduePendingBills) {
    const updated = await store.updateBill(bill.id, {
      status: BillStatus.OVERDUE,
      history: [
        {
          date: toDateString(current),
          action: 'Status changed to OVERDUE by daily audit',
          ref: 'Automated-Scheduler'
        },
        ...(bill.history || [])
      ]
    });

    updatedOverdue.push({
      billId: updated.id,
      title: updated.title,
      dueDate: updated.dueDate,
      previousStatus: bill.status,
      newStatus: updated.status
    });
  }

  return {
    overdueFoundCount: overduePendingBills.length,
    overdueUpdatedCount: updatedOverdue.length,
    updated: updatedOverdue
  };
}

/**
 * Orchestrates the full daily background worker run
 * 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export async function runDailyWorker(options = {}) {
  const currentDate = options.currentDate ? new Date(options.currentDate) : new Date();
  const startTime = Date.now();

  const reminderResults = await checkAndSendReminders({
    currentDate,
    store: options.store,
    notificationService: options.notificationService
  });

  const overdueResults = await checkAndUpdateOverdue({
    currentDate,
    store: options.store
  });

  return {
    timestamp: new Date().toISOString(),
    evaluatedDate: toDateString(currentDate),
    durationMs: Date.now() - startTime,
    reminders: reminderResults,
    overdue: overdueResults
  };
}
