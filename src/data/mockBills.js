export const INITIAL_BILLS = [
  {
    id: 'bill-1',
    title: 'Metronet High-Speed Fiber',
    vendor: 'Metronet Broadband',
    category: 'Utilities',
    amount: 75.00,
    currency: '$',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    status: 'due_soon', // 'paid', 'due_soon', 'overdue', 'pending'
    frequency: 'Monthly',
    isSplit: true,
    splitMembers: [
      { id: 'u1', name: 'You', amount: 37.50, isPaid: true },
      { id: 'u2', name: 'Alex Chen', amount: 37.50, isPaid: false, avatar: 'AC' }
    ],
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    receiptName: 'metronet_oct_statement.pdf',
    notes: 'Fiber 1Gbps plan. Auto-debit disabled to check invoice.',
    reminderDaysBefore: 3,
    history: [
      { date: '2026-09-28', action: 'Paid $75.00 via Apple Pay', ref: 'TX-89123' },
      { date: '2026-08-28', action: 'Paid $75.00 via Apple Pay', ref: 'TX-76491' }
    ]
  },
  {
    id: 'bill-2',
    title: 'Downtown Apartment Rent',
    vendor: 'Beacon Property Management',
    category: 'Housing',
    amount: 1450.00,
    currency: '$',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    status: 'due_soon',
    frequency: 'Monthly',
    isSplit: true,
    splitMembers: [
      { id: 'u1', name: 'You', amount: 725.00, isPaid: false },
      { id: 'u2', name: 'Maya Lin', amount: 725.00, isPaid: true, avatar: 'ML' }
    ],
    receiptUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=80',
    receiptName: 'lease_unit_4b_oct.pdf',
    notes: 'Due by 1st to avoid 5% late penalty.',
    reminderDaysBefore: 5,
    history: [
      { date: '2026-09-01', action: 'Paid $1,450.00 via Bank Wire', ref: 'TX-55102' }
    ]
  },
  {
    id: 'bill-3',
    title: 'City Power & Electric',
    vendor: 'Pacific Gas & Electric',
    category: 'Utilities',
    amount: 114.20,
    currency: '$',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day overdue
    status: 'overdue',
    frequency: 'Monthly',
    isSplit: false,
    splitMembers: [],
    receiptUrl: null,
    receiptName: null,
    notes: 'Higher AC usage in late summer.',
    reminderDaysBefore: 3,
    history: [
      { date: '2026-09-27', action: 'Paid $98.40 via Debit Card', ref: 'TX-44129' }
    ]
  },
  {
    id: 'bill-4',
    title: 'Netflix Premium 4K + Family',
    vendor: 'Netflix Inc.',
    category: 'Subscriptions',
    amount: 22.99,
    currency: '$',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    status: 'due_soon',
    frequency: 'Monthly',
    isSplit: true,
    splitMembers: [
      { id: 'u1', name: 'You', amount: 11.50, isPaid: false },
      { id: 'u3', name: 'Liam Patel', amount: 11.49, isPaid: false, avatar: 'LP' }
    ],
    receiptUrl: null,
    receiptName: null,
    notes: 'Family profile sharing.',
    reminderDaysBefore: 2,
    history: [
      { date: '2026-09-23', action: 'Auto-charged $22.99', ref: 'TX-33100' }
    ]
  },
  {
    id: 'bill-5',
    title: 'Equinox Fitness Club',
    vendor: 'Equinox Group',
    category: 'Health',
    amount: 180.00,
    currency: '$',
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days from now
    status: 'pending',
    frequency: 'Monthly',
    isSplit: false,
    splitMembers: [],
    receiptUrl: null,
    receiptName: null,
    notes: 'Zombie alert: 0 visits logged in past 20 days.',
    reminderDaysBefore: 4,
    history: [
      { date: '2026-09-10', action: 'Auto-charged $180.00', ref: 'TX-21940' }
    ]
  },
  {
    id: 'bill-6',
    title: 'AWS Cloud Infrastructure',
    vendor: 'Amazon Web Services',
    category: 'Subscriptions',
    amount: 64.30,
    currency: '$',
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'paid',
    frequency: 'Monthly',
    isSplit: false,
    splitMembers: [],
    receiptUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    receiptName: 'aws_invoice_oct26.pdf',
    notes: 'Side project RDS + S3 hosting.',
    reminderDaysBefore: 2,
    history: [
      { date: '2026-10-24', action: 'Paid $64.30 via Credit Card', ref: 'TX-90432' }
    ]
  },
  {
    id: 'bill-7',
    title: 'Guardian Health & Dental',
    vendor: 'Guardian Life Insurance',
    category: 'Insurance',
    amount: 210.00,
    currency: '$',
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'paid',
    frequency: 'Monthly',
    isSplit: false,
    splitMembers: [],
    receiptUrl: null,
    receiptName: null,
    notes: 'Direct debit cleared on 22nd.',
    reminderDaysBefore: 3,
    history: [
      { date: '2026-10-22', action: 'Auto-debit cleared $210.00', ref: 'TX-88301' }
    ]
  },
  {
    id: 'bill-8',
    title: 'Spotify Family Subscription',
    vendor: 'Spotify AB',
    category: 'Subscriptions',
    amount: 19.99,
    currency: '$',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'paid',
    frequency: 'Monthly',
    isSplit: false,
    splitMembers: [],
    receiptUrl: null,
    receiptName: null,
    notes: 'Auto-renewed.',
    reminderDaysBefore: 1,
    history: [
      { date: '2026-10-18', action: 'Paid $19.99 via PayPal', ref: 'TX-10928' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'Housing', label: 'Housing & Rent', color: '#3b82f6', icon: 'Home' },
  { id: 'Utilities', label: 'Utilities & Wi-Fi', color: '#f59e0b', icon: 'Zap' },
  { id: 'Subscriptions', label: 'Streaming & SaaS', color: '#8b5cf6', icon: 'Tv' },
  { id: 'Insurance', label: 'Insurance & Auto', color: '#06b6d4', icon: 'Shield' },
  { id: 'Health', label: 'Fitness & Health', color: '#10b981', icon: 'Activity' },
  { id: 'Credit', label: 'Credit Card & Debt', color: '#ef4444', icon: 'CreditCard' },
  { id: 'Other', label: 'Other Expenses', color: '#64748b', icon: 'Tag' },
];
