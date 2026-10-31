import express from 'express';
import { defaultStore } from '../database/store.js';

export function createUserRouter(store = defaultStore) {
  const router = express.Router();

  /**
   * GET /api/users
   */
  router.get('/', async (req, res) => {
    try {
      const users = await store.getAllUsers();
      return res.json({ success: true, count: users.length, users });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * GET /api/users/:id
   */
  router.get('/:id', async (req, res) => {
    try {
      const user = await store.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: `User with id "${req.params.id}" not found`
        });
      }
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * POST /api/users
   */
  router.post('/', async (req, res) => {
    try {
      const user = await store.createUser(req.body);
      return res.status(201).json({ success: true, user });
    } catch (err) {
      if (err.name === 'ValidationError' || err.name === 'DuplicateError') {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * PATCH /api/users/:id/preferences
   * Updates user notification preferences (reminderDaysBefore, email, pushToken)
   */
  router.patch('/:id/preferences', async (req, res) => {
    try {
      const { id } = req.params;
      const { reminderDaysBefore, email, pushToken } = req.body;

      const updates = {};
      if (reminderDaysBefore !== undefined) {
        const days = Number(reminderDaysBefore);
        if (!Number.isInteger(days) || days < 0) {
          return res.status(400).json({
            success: false,
            error: 'reminderDaysBefore must be a non-negative integer'
          });
        }
        updates.reminderDaysBefore = days;
      }

      if (email !== undefined) {
        if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
          return res.status(400).json({
            success: false,
            error: 'email must be a valid email address'
          });
        }
        updates.email = email.trim().toLowerCase();
      }

      if (pushToken !== undefined) {
        updates.pushToken = pushToken ? String(pushToken).trim() : null;
      }

      const updatedUser = await store.updateUser(id, updates);
      return res.json({
        success: true,
        message: 'Preferences updated successfully',
        user: updatedUser
      });
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return res.status(404).json({ success: false, error: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

