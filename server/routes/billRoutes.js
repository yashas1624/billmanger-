import express from 'express';
import { defaultStore } from '../database/store.js';
import { BillStatus, VALID_STATUSES } from '../models/Bill.js';
import { toDateString } from '../utils/dateUtils.js';

export function createBillRouter(store = defaultStore) {
  const router = express.Router();

  /**
   * GET /api/bills/upcoming
   * Retrieves upcoming bills due within X days (default: 7)
   */
  router.get('/upcoming', async (req, res) => {
    try {
      const rawDays = req.query.days !== undefined ? req.query.days : 7;
      const days = Number(rawDays);

      if (!Number.isInteger(days) || days < 0) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "days" must be a non-negative integer'
        });
      }

      let referenceDate = new Date();
      if (req.query.referenceDate) {
        const parsed = new Date(req.query.referenceDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({
            success: false,
            error: 'Query parameter "referenceDate" must be a valid date or ISO string'
          });
        }
        referenceDate = parsed;
      }

      const upcomingBills = await store.getUpcomingBills(days, referenceDate);

      return res.json({
        success: true,
        count: upcomingBills.length,
        days,
        referenceDate: toDateString(referenceDate),
        bills: upcomingBills
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * PATCH /api/bills/:id/pay
   * Updates bill status to PAID. If recurring, resets reminderSent to false.
   */
  router.patch('/:id/pay', async (req, res) => {
    try {
      const { id } = req.params;
      const bill = await store.getBill(id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: `Bill with id "${id}" not found`
        });
      }

      const isRecurring = Boolean(
        bill.isRecurring ||
        (bill.frequency && bill.frequency.toLowerCase() !== 'one-time')
      );

      // Resets reminderSent if recurring
      const updates = {
        status: BillStatus.PAID,
        reminderSent: isRecurring ? false : bill.reminderSent,
        history: [
          {
            date: toDateString(new Date()),
            action: `Bill marked as PAID (${bill.currency || '$'}${bill.amount.toFixed(2)})`,
            ref: `TX-${Math.floor(10000 + Math.random() * 90000)}`
          },
          ...(bill.history || [])
        ]
      };

      const updatedBill = await store.updateBill(id, updates);

      return res.json({
        success: true,
        message: isRecurring
          ? 'Bill marked as PAID. Reminder state reset for next recurring cycle.'
          : 'Bill marked as PAID.',
        bill: updatedBill
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * PATCH /api/bills/:id/status
   * Updates status to any valid status. If changing to PAID, resets reminderSent if recurring.
   */
  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !VALID_STATUSES.includes(String(status).trim().toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: `Valid status required (${VALID_STATUSES.join(', ')})`
        });
      }

      const normalizedStatus = String(status).trim().toUpperCase();
      const bill = await store.getBill(id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: `Bill with id "${id}" not found`
        });
      }

      const isRecurring = Boolean(
        bill.isRecurring ||
        (bill.frequency && bill.frequency.toLowerCase() !== 'one-time')
      );

      const updates = {
        status: normalizedStatus,
        history: [
          {
            date: toDateString(new Date()),
            action: `Status manually updated to ${normalizedStatus}`,
            ref: 'API-Update'
          },
          ...(bill.history || [])
        ]
      };

      if (normalizedStatus === BillStatus.PAID && isRecurring) {
        updates.reminderSent = false;
      }

      const updatedBill = await store.updateBill(id, updates);

      return res.json({
        success: true,
        bill: updatedBill
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * GET /api/bills
   * Lists all bills with optional filtering by status, userId, category
   */
  router.get('/', async (req, res) => {
    try {
      const { status, userId, category } = req.query;

      const bills = await store.getAllBills(bill => {
        if (status && bill.status !== String(status).toUpperCase()) return false;
        if (userId && bill.userId !== userId) return false;
        if (category && bill.category.toLowerCase() !== String(category).toLowerCase()) return false;
        return true;
      });

      return res.json({
        success: true,
        count: bills.length,
        bills
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * GET /api/bills/:id
   * Get single bill by ID
   */
  router.get('/:id', async (req, res) => {
    try {
      const bill = await store.getBill(req.params.id);
      if (!bill) {
        return res.status(404).json({
          success: false,
          error: `Bill with id "${req.params.id}" not found`
        });
      }
      return res.json({ success: true, bill });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * POST /api/bills
   * Create a new bill
   */
  router.post('/', async (req, res) => {
    try {
      const created = await store.createBill(req.body);
      return res.status(201).json({
        success: true,
        bill: created
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: err.message,
          details: err.details
        });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * PUT /api/bills/:id
   * Updates an existing bill
   */
  router.put('/:id', async (req, res) => {
    try {
      const updated = await store.updateBill(req.params.id, req.body);
      return res.json({
        success: true,
        bill: updated
      });
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return res.status(404).json({ success: false, error: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: err.message, details: err.details });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * DELETE /api/bills/:id
   * Deletes a bill
   */
  router.delete('/:id', async (req, res) => {
    try {
      const success = await store.deleteBill(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          error: `Bill with id "${req.params.id}" not found`
        });
      }
      return res.json({
        success: true,
        message: `Bill "${req.params.id}" deleted successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

