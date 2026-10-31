import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { createApp } from '../app.js';
import { Store } from '../database/store.js';
import { BillStatus } from '../models/Bill.js';
import { addDays, toDateString } from '../utils/dateUtils.js';

describe('API Routes', () => {
  let app;
  let store;
  const baseDate = new Date('2026-11-01T12:00:00.000Z');

  beforeEach(() => {
    store = new Store();
    app = createApp({ store });

    store.seed(
      [
        {
          id: 'user-1',
          name: 'Morgan Freeman',
          email: 'morgan@example.com',
          pushToken: 'push-111',
          reminderDaysBefore: 3
        }
      ],
      [
        {
          id: 'bill-recurring',
          title: 'Cloud Storage Pro',
          amount: 9.99,
          dueDate: addDays(baseDate, 2).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: true, // Reminder was sent earlier
          isRecurring: true,
          frequency: 'Monthly',
          userId: 'user-1'
        },
        {
          id: 'bill-onetime',
          title: 'Plumber Repair',
          amount: 250.00,
          dueDate: addDays(baseDate, 4).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: true, // Reminder was sent
          isRecurring: false,
          frequency: 'One-time',
          userId: 'user-1'
        },
        {
          id: 'bill-far',
          title: 'Annual Property Insurance',
          amount: 800.00,
          dueDate: addDays(baseDate, 20).toISOString(),
          status: BillStatus.PENDING,
          reminderSent: false,
          isRecurring: true,
          frequency: 'Yearly',
          userId: 'user-1'
        },
        {
          id: 'bill-paid-already',
          title: 'Water Utility',
          amount: 45.00,
          dueDate: addDays(baseDate, 3).toISOString(),
          status: BillStatus.PAID,
          reminderSent: false,
          isRecurring: false,
          userId: 'user-1'
        }
      ]
    );
  });

  describe('PATCH /api/bills/:id/pay', () => {
    it('should update status to PAID and reset reminderSent if recurring', async () => {
      const res = await request(app)
        .patch('/api/bills/bill-recurring/pay')
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.bill.status, BillStatus.PAID);
      // Requirement: resets reminderSent if recurring
      assert.strictEqual(res.body.bill.reminderSent, false);

      // Verify in store
      const inStore = await store.getBill('bill-recurring');
      assert.strictEqual(inStore.status, BillStatus.PAID);
      assert.strictEqual(inStore.reminderSent, false);
    });

    it('should update status to PAID without resetting reminderSent if not recurring', async () => {
      const res = await request(app)
        .patch('/api/bills/bill-onetime/pay')
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.bill.status, BillStatus.PAID);
      // For non-recurring bill, reminderSent is NOT reset to false
      assert.strictEqual(res.body.bill.reminderSent, true);
    });

    it('should return 404 if bill does not exist', async () => {
      const res = await request(app)
        .patch('/api/bills/non-existent-id/pay')
        .expect(404);

      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.includes('not found'));
    });
  });

  describe('GET /api/bills/upcoming', () => {
    it('should retrieve bills due within X days and exclude paid bills', async () => {
      const res = await request(app)
        .get(`/api/bills/upcoming?days=5&referenceDate=${baseDate.toISOString()}`)
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.days, 5);
      // bill-recurring (due in 2 days) and bill-onetime (due in 4 days) are within 5 days
      // bill-far is due in 20 days (excluded)
      // bill-paid-already is status PAID (excluded)
      assert.strictEqual(res.body.count, 2);
      const ids = res.body.bills.map(b => b.id);
      assert.deepStrictEqual(ids.sort(), ['bill-onetime', 'bill-recurring'].sort());
    });

    it('should respect custom day horizons', async () => {
      const res1 = await request(app)
        .get(`/api/bills/upcoming?days=2&referenceDate=${baseDate.toISOString()}`)
        .expect(200);
      assert.strictEqual(res1.body.count, 1);
      assert.strictEqual(res1.body.bills[0].id, 'bill-recurring');

      const res2 = await request(app)
        .get(`/api/bills/upcoming?days=30&referenceDate=${baseDate.toISOString()}`)
        .expect(200);
      assert.strictEqual(res2.body.count, 3);
    });

    it('should return 400 for invalid days parameter', async () => {
      const res = await request(app)
        .get('/api/bills/upcoming?days=invalid')
        .expect(400);

      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.includes('must be a non-negative integer'));
    });
  });

  describe('User Preferences & Worker Triggers', () => {
    it('should update user reminderDaysBefore, email, and pushToken', async () => {
      const res = await request(app)
        .patch('/api/users/user-1/preferences')
        .send({
          reminderDaysBefore: 7,
          email: 'new-email@example.com',
          pushToken: 'push-new-token'
        })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.reminderDaysBefore, 7);
      assert.strictEqual(res.body.user.email, 'new-email@example.com');
      assert.strictEqual(res.body.user.pushToken, 'push-new-token');
    });

    it('should reject invalid reminderDaysBefore in user preferences', async () => {
      const res = await request(app)
        .patch('/api/users/user-1/preferences')
        .send({ reminderDaysBefore: -4 })
        .expect(400);

      assert.strictEqual(res.body.success, false);
    });

    it('should trigger manual worker run via POST /api/worker/run-reminders', async () => {
      const res = await request(app)
        .post('/api/worker/run-reminders')
        .send({ targetDate: baseDate.toISOString() })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.result);
      assert.strictEqual(res.body.result.evaluatedDate, toDateString(baseDate));
    });
  });

  describe('Bill CRUD Endpoints', () => {
    it('should create, read, and delete a new bill', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/bills')
        .send({
          title: 'Health Insurance',
          amount: 220,
          dueDate: addDays(baseDate, 15).toISOString(),
          category: 'Insurance',
          userId: 'user-1'
        })
        .expect(201);

      assert.strictEqual(createRes.body.bill.title, 'Health Insurance');
      assert.strictEqual(createRes.body.bill.status, BillStatus.PENDING);
      assert.strictEqual(createRes.body.bill.reminderSent, false);

      const billId = createRes.body.bill.id;

      // Read
      const getRes = await request(app)
        .get(`/api/bills/${billId}`)
        .expect(200);
      assert.strictEqual(getRes.body.bill.id, billId);

      // Delete
      await request(app)
        .delete(`/api/bills/${billId}`)
        .expect(200);

      await request(app)
        .get(`/api/bills/${billId}`)
        .expect(404);
    });
  });
});
