import { validateAndFormatBill, BillStatus } from '../models/Bill.js';
import { validateAndFormatUser } from '../models/User.js';
import { toDateString, addDays, isPastDate } from '../utils/dateUtils.js';

export class Store {
  constructor() {
    this.users = new Map();
    this.bills = new Map();
  }

  clear() {
    this.users.clear();
    this.bills.clear();
  }

  // ===================== USER METHODS =====================

  async getUser(id) {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const norm = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email === norm) return u;
    }
    return null;
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async createUser(userData) {
    const formatted = validateAndFormatUser(userData);
    const existing = await this.getUserByEmail(formatted.email);
    if (existing) {
      const err = new Error(`User with email "${formatted.email}" already exists`);
      err.name = 'DuplicateError';
      throw err;
    }
    this.users.set(formatted.id, formatted);
    return formatted;
  }

  async updateUser(id, updates = {}) {
    const user = this.users.get(id);
    if (!user) {
      const err = new Error(`User with id "${id}" not found`);
      err.name = 'NotFoundError';
      throw err;
    }

    const merged = { ...user, ...updates, id: user.id };
    const validated = validateAndFormatUser(merged);
    this.users.set(id, validated);
    return validated;
  }

  // ===================== BILL METHODS =====================

  async getBill(id) {
    return this.bills.get(id) || null;
  }

  async getAllBills(filterFn = null) {
    const all = Array.from(this.bills.values());
    if (typeof filterFn === 'function') {
      return all.filter(filterFn);
    }
    return all;
  }

  /**
   * Queries pending bills that haven't received reminders yet
   */
  async getPendingBillsWithoutReminder() {
    return Array.from(this.bills.values()).filter(b => 
      b.status === BillStatus.PENDING && b.reminderSent === false
    );
  }

  /**
   * Queries pending bills whose dueDate has passed relative to referenceDate
   * @param {Date|string} referenceDate 
   */
  async getOverduePendingBills(referenceDate = new Date()) {
    return Array.from(this.bills.values()).filter(b =>
      b.status === BillStatus.PENDING && isPastDate(b.dueDate, referenceDate)
    );
  }

  /**
   * Retrieves upcoming bills due within X days from referenceDate
   * @param {number} days 
   * @param {Date|string} referenceDate 
   */
  async getUpcomingBills(days = 7, referenceDate = new Date()) {
    const startStr = toDateString(referenceDate);
    const endStr = toDateString(addDays(referenceDate, days));

    return Array.from(this.bills.values())
      .filter(b => {
        const dueStr = toDateString(b.dueDate);
        // Exclude PAID bills
        return b.status !== BillStatus.PAID && dueStr >= startStr && dueStr <= endStr;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  async createBill(billData) {
    const formatted = validateAndFormatBill(billData);
    this.bills.set(formatted.id, formatted);
    return formatted;
  }

  async updateBill(id, updates = {}) {
    const bill = this.bills.get(id);
    if (!bill) {
      const err = new Error(`Bill with id "${id}" not found`);
      err.name = 'NotFoundError';
      throw err;
    }

    const merged = {
      ...bill,
      ...updates,
      id: bill.id,
      updatedAt: new Date().toISOString()
    };
    const validated = validateAndFormatBill(merged);
    this.bills.set(id, validated);
    return validated;
  }

  async deleteBill(id) {
    return this.bills.delete(id);
  }

  // ===================== SEED METHOD =====================

  seed(users = [], bills = []) {
    this.clear();
    for (const u of users) {
      const formatted = validateAndFormatUser(u);
      this.users.set(formatted.id, formatted);
    }
    for (const b of bills) {
      const formatted = validateAndFormatBill(b);
      this.bills.set(formatted.id, formatted);
    }
  }
}

// Global default singleton store
export const defaultStore = new Store();
