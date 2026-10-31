import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BillStatus, validateAndFormatBill } from '../models/Bill.js';
import { validateAndFormatUser } from '../models/User.js';

describe('Schema Updates & Model Validation', () => {
  describe('Bill Schema', () => {
    it('should set reminderSent to false by default', () => {
      const bill = validateAndFormatBill({
        title: 'Internet Service',
        amount: 80,
        dueDate: '2026-11-05T00:00:00.000Z'
      });
      assert.strictEqual(bill.reminderSent, false);
    });

    it('should set status to PENDING by default', () => {
      const bill = validateAndFormatBill({
        title: 'Electricity Bill',
        amount: 120,
        dueDate: '2026-11-10T00:00:00.000Z'
      });
      assert.strictEqual(bill.status, BillStatus.PENDING);
    });

    it('should validate and normalize status Enum: PENDING, PAID, OVERDUE', () => {
      const pendingBill = validateAndFormatBill({
        title: 'Water Bill',
        amount: 45,
        dueDate: '2026-11-02',
        status: 'pending'
      });
      assert.strictEqual(pendingBill.status, BillStatus.PENDING);

      const paidBill = validateAndFormatBill({
        title: 'Water Bill',
        amount: 45,
        dueDate: '2026-11-02',
        status: 'PAID'
      });
      assert.strictEqual(paidBill.status, BillStatus.PAID);

      const overdueBill = validateAndFormatBill({
        title: 'Water Bill',
        amount: 45,
        dueDate: '2026-11-02',
        status: 'overdue'
      });
      assert.strictEqual(overdueBill.status, BillStatus.OVERDUE);
    });

    it('should reject invalid status', () => {
      assert.throws(() => {
        validateAndFormatBill({
          title: 'Trash Pickup',
          amount: 30,
          dueDate: '2026-11-01',
          status: 'INVALID_STATUS'
        });
      }, /status must be one of/);
    });

    it('should validate dueDate format and reject invalid dates', () => {
      assert.throws(() => {
        validateAndFormatBill({
          title: 'Gym',
          amount: 50,
          dueDate: 'not-a-date'
        });
      }, /dueDate must be a valid date/);

      assert.throws(() => {
        validateAndFormatBill({
          title: 'Gym',
          amount: 50
        });
      }, /dueDate is required/);
    });

    it('should reject non-positive amounts and empty titles', () => {
      assert.throws(() => {
        validateAndFormatBill({ title: '', amount: 50, dueDate: '2026-11-01' });
      }, /title is required/);

      assert.throws(() => {
        validateAndFormatBill({ title: 'Gym', amount: -10, dueDate: '2026-11-01' });
      }, /amount is required and must be a positive number/);
    });
  });

  describe('User Schema / Preferences', () => {
    it('should set reminderDaysBefore to 3 by default', () => {
      const user = validateAndFormatUser({
        name: 'Jordan Lee',
        email: 'jordan@example.com'
      });
      assert.strictEqual(user.reminderDaysBefore, 3);
      assert.strictEqual(user.pushToken, null);
    });

    it('should accept custom reminderDaysBefore and pushToken', () => {
      const user = validateAndFormatUser({
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        reminderDaysBefore: 5,
        pushToken: 'expo-token-987'
      });
      assert.strictEqual(user.reminderDaysBefore, 5);
      assert.strictEqual(user.pushToken, 'expo-token-987');
    });

    it('should reject invalid reminderDaysBefore (negative or non-integer)', () => {
      assert.throws(() => {
        validateAndFormatUser({
          name: 'Jordan',
          email: 'jordan@example.com',
          reminderDaysBefore: -1
        });
      }, /reminderDaysBefore must be a non-negative integer/);

      assert.throws(() => {
        validateAndFormatUser({
          name: 'Jordan',
          email: 'jordan@example.com',
          reminderDaysBefore: 'abc'
        });
      }, /reminderDaysBefore must be a non-negative integer/);
    });

    it('should require a valid email address', () => {
      assert.throws(() => {
        validateAndFormatUser({ name: 'Jordan', email: 'invalid-email' });
      }, /email is required and must be a valid email address/);
    });
  });
});
