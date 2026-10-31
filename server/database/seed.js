import { defaultStore } from './store.js';
import { BillStatus } from '../models/Bill.js';
import { addDays } from '../utils/dateUtils.js';

export const SEED_USERS = [
  {
    id: 'user-default',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    pushToken: 'ExponentPushToken[mock_token_user_1]',
    reminderDaysBefore: 3
  },
  {
    id: 'user-2',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    pushToken: null,
    reminderDaysBefore: 5
  }
];

export function getSeedBills(referenceDate = new Date()) {
  return [
    {
      id: 'bill-fiber',
      title: 'Metronet High-Speed Fiber',
      vendor: 'Metronet Broadband',
      category: 'Utilities',
      amount: 75.00,
      currency: '$',
      dueDate: addDays(referenceDate, 3).toISOString(), // Exactly matches user-default reminder (3 days)
      reminderSent: false,
      status: BillStatus.PENDING,
      isRecurring: true,
      frequency: 'Monthly',
      userId: 'user-default',
      notes: 'Fiber 1Gbps plan'
    },
    {
      id: 'bill-rent',
      title: 'Downtown Apartment Rent',
      vendor: 'Beacon Property Management',
      category: 'Housing',
      amount: 1450.00,
      currency: '$',
      dueDate: addDays(referenceDate, 5).toISOString(), // Matches user-2 reminder (5 days)
      reminderSent: false,
      status: BillStatus.PENDING,
      isRecurring: true,
      frequency: 'Monthly',
      userId: 'user-2',
      notes: 'Due by 1st to avoid 5% late penalty'
    },
    {
      id: 'bill-power-overdue',
      title: 'City Power & Electric',
      vendor: 'Pacific Gas & Electric',
      category: 'Utilities',
      amount: 114.20,
      currency: '$',
      dueDate: addDays(referenceDate, -2).toISOString(), // 2 days in past -> overdue
      reminderSent: false,
      status: BillStatus.PENDING, // Will be updated to OVERDUE by auxiliary check
      isRecurring: true,
      frequency: 'Monthly',
      userId: 'user-default',
      notes: 'Late summer AC usage'
    },
    {
      id: 'bill-netflix-paid',
      title: 'Netflix Premium 4K',
      vendor: 'Netflix Inc.',
      category: 'Subscriptions',
      amount: 22.99,
      currency: '$',
      dueDate: addDays(referenceDate, 10).toISOString(),
      reminderSent: true,
      status: BillStatus.PAID,
      isRecurring: true,
      frequency: 'Monthly',
      userId: 'user-default',
      notes: 'Family subscription'
    },
    {
      id: 'bill-gym',
      title: 'Equinox Fitness Club',
      vendor: 'Equinox Group',
      category: 'Health',
      amount: 180.00,
      currency: '$',
      dueDate: addDays(referenceDate, 7).toISOString(),
      reminderSent: false,
      status: BillStatus.PENDING,
      isRecurring: false,
      frequency: 'One-time',
      userId: 'user-default',
      notes: 'Annual registration'
    }
  ];
}

export function initializeDatabase(store = defaultStore, referenceDate = new Date()) {
  store.seed(SEED_USERS, getSeedBills(referenceDate));
  return store;
}

