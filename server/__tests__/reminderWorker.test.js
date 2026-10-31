import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Store } from '../database/store.js';
import { BillStatus } from '../models/Bill.js';
import { NotificationService } from '../services/notification/NotificationService.js';
import { MockNotificationProvider } from '../services/notification/MockNotificationProvider.js';
import {
  checkAndSendReminders,
  checkAndUpdateOverdue,
  runDailyWorker
} from '../workers/reminderWorker.js';
import { addDays, toDateString } from '../utils/dateUtils.js';

describe('Background Worker & Scheduler', () => {
  let store;
  let mockProvider;
  let notificationService;
  const baseDate = new Date('2026-11-01T10:00:00.000Z');

  beforeEach(() => {
    store = new Store();
    mockProvider = new MockNotificationProvider();
    notificationService = new NotificationService([mockProvider]);

    // Setup User with default reminderDaysBefore = 3
    store.seed(
      [
        {
          id: 'user-standard',
          name: 'Alex Standard',
          email: 'alex@example.com',
          pushToken: 'push-alex',
          reminderDaysBefore: 3
        },
        {
          id: 'user-custom',
          name: 'Sam Custom',
          email: 'sam@example.com',
          pushToken: null,
          reminderDaysBefore: 5
        }
      ],
      [
        // Bill 1: Due in 3 days, user-standard (matches 3 days) -> Should dispatch
        {
          id: 'bill-match-3days',
          title: 'Electricity Bill',
          amount: 95.00,
          dueDate: addDays(baseDate, 3).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: false,
          userId: 'user-standard',
          isRecurring: true
        },
        // Bill 2: Due in 5 days, user-custom (matches 5 days) -> Should dispatch
        {
          id: 'bill-match-5days',
          title: 'Apartment Rent',
          amount: 1200.00,
          dueDate: addDays(baseDate, 5).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: false,
          userId: 'user-custom',
          isRecurring: true
        },
        // Bill 3: Due in 3 days, but reminderSent is ALREADY true -> Should NOT dispatch
        {
          id: 'bill-already-reminded',
          title: 'Internet Service',
          amount: 60.00,
          dueDate: addDays(baseDate, 3).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: true,
          userId: 'user-standard',
          isRecurring: true
        },
        // Bill 4: Due in 3 days, but status is PAID -> Should NOT dispatch
        {
          id: 'bill-paid',
          title: 'Water Utility',
          amount: 35.00,
          dueDate: addDays(baseDate, 3).toISOString(),
          status: BillStatus.PAID,
          reminderSent: false,
          userId: 'user-standard',
          isRecurring: false
        },
        // Bill 5: Due in 7 days -> Not yet time for reminder (3 or 5 days) -> Should NOT dispatch
        {
          id: 'bill-far-future',
          title: 'Gym Membership',
          amount: 50.00,
          dueDate: addDays(baseDate, 7).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: false,
          userId: 'user-standard',
          isRecurring: true
        },
        // Bill 6: Due 2 days ago, status PENDING -> Should be updated to OVERDUE by auxiliary check
        {
          id: 'bill-past-due',
          title: 'Credit Card Minimum',
          amount: 150.00,
          dueDate: addDays(baseDate, -2).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: false,
          userId: 'user-standard',
          isRecurring: false
        }
      ]
    );
  });

  it('should query matching pending bills and dispatch notifications via modular service', async () => {
    const res = await checkAndSendReminders({
      currentDate: baseDate,
      store,
      notificationService
    });

    assert.strictEqual(res.matchedCount, 2);
    assert.strictEqual(res.sentCount, 2);
    assert.strictEqual(mockProvider.getSent().length, 2);

    const sentBillIds = mockProvider.getSent().map(s => s.bill.id);
    assert.ok(sentBillIds.includes('bill-match-3days'));
    assert.ok(sentBillIds.includes('bill-match-5days'));
  });

  it('should set reminderSent = true to avoid duplicate alerts', async () => {
    await checkAndSendReminders({
      currentDate: baseDate,
      store,
      notificationService
    });

    const bill1 = await store.getBill('bill-match-3days');
    const bill2 = await store.getBill('bill-match-5days');
    assert.strictEqual(bill1.reminderSent, true);
    assert.strictEqual(bill2.reminderSent, true);

    // Run again on same date: should NOT send again!
    mockProvider.clear();
    const secondRun = await checkAndSendReminders({
      currentDate: baseDate,
      store,
      notificationService
    });

    assert.strictEqual(secondRun.matchedCount, 0);
    assert.strictEqual(secondRun.sentCount, 0);
    assert.strictEqual(mockProvider.getSent().length, 0);
  });

  it('should run auxiliary check to update past-due PENDING bills to OVERDUE', async () => {
    const overdueRes = await checkAndUpdateOverdue({
      currentDate: baseDate,
      store
    });

    assert.strictEqual(overdueRes.overdueFoundCount, 1);
    assert.strictEqual(overdueRes.overdueUpdatedCount, 1);
    assert.strictEqual(overdueRes.updated[0].billId, 'bill-past-due');

    const updatedBill = await store.getBill('bill-past-due');
    assert.strictEqual(updatedBill.status, BillStatus.OVERDUE);
  });

  it('should not update bills whose status is already PAID or due today/future', async () => {
    await checkAndUpdateOverdue({
      currentDate: baseDate,
      store
    });

    const paidBill = await store.getBill('bill-paid');
    assert.strictEqual(paidBill.status, BillStatus.PAID);

    const futureBill = await store.getBill('bill-match-3days');
    assert.strictEqual(futureBill.status, BillStatus.PENDING);
  });

  it('should execute full daily worker and return structured report', async () => {
    const report = await runDailyWorker({
      currentDate: baseDate,
      store,
      notificationService
    });

    assert.strictEqual(report.evaluatedDate, toDateString(baseDate));
    assert.strictEqual(report.reminders.sentCount, 2);
    assert.strictEqual(report.overdue.overdueUpdatedCount, 1);

    // Verify database state after worker execution
    const bill3Days = await store.getBill('bill-match-3days');
    assert.strictEqual(bill3Days.reminderSent, true);

    const overdueBill = await store.getBill('bill-past-due');
    assert.strictEqual(overdueBill.status, BillStatus.OVERDUE);
  });
});
