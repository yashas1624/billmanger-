export const WALLET_BALANCE = 4825.50;

export const USER = {
  name: 'Yashas S',
  mobile: '+91 98765 43210',
  upiId: 'yashas.s@paytm',
};

export const QUICK_ACTIONS = [
  { id: 'send', label: 'Send Money', icon: 'send', color: '#005bbb' },
  { id: 'recharge', label: 'Recharge & Bills', icon: 'recharge', color: '#00b86b' },
  { id: 'bank', label: 'Bank Transfer', icon: 'bank', color: '#6c5ce7' },
  { id: 'ticket', label: 'Book Travel', icon: 'ticket', color: '#ff9500' },
  { id: 'insurance', label: 'Insurance', icon: 'shield', color: '#ff3b30' },
  { id: 'invest', label: 'Investments', icon: 'invest', color: '#8e44ad' },
  { id: 'gold', label: 'Digital Gold', icon: 'gold', color: '#f1c40f' },
  { id: 'request', label: 'Request Money', icon: 'request', color: '#005bbb' },
];

export const BILLERS = [
  { id: 'mobile', label: 'Mobile', icon: 'mobile', items: ['Airtel', 'Jio', 'Vi', 'BSNL'] },
  { id: 'dth', label: 'DTH', icon: 'dth', items: ['Tata Play', 'Dish TV', 'Airtel Digital TV'] },
  { id: 'electricity', label: 'Electricity', icon: 'electricity', items: ['BSES', 'TPDDL', 'CESC', 'K-Electric'] },
  { id: 'water', label: 'Water', icon: 'water', items: ['Delhi Jal Board', 'BWSSB', 'MCAP'] },
  { id: 'gas', label: 'Gas', icon: 'gas', items: ['Indane', 'HP Gas', 'Bharat Gas'] },
  { id: 'broadband', label: 'Broadband', icon: 'wifi', items: ['Airtel Xstream', 'JioFiber', 'ACT'] },
  { id: 'landline', label: 'Landline', icon: 'landline', items: ['BSNL Landline', 'MTNL'] },
  { id: 'creditcard', label: 'Credit Card', icon: 'card', items: ['HDFC', 'ICICI', 'SBI', 'Axis'] },
  { id: 'fastag', label: 'FASTag Recharge', icon: 'fastag', items: ['Paytm FASTag'] },
];

export const TRANSACTIONS = [
  {
    id: 't1',
    date: 'Today, 10:15 AM',
    title: 'UPI Payment',
    subtitle: 'BigBasket Grocery',
    amount: -245.00,
    type: 'debit',
    status: 'Success',
    icon: 'debit',
    color: '#e22',
  },
  {
    id: 't2',
    date: 'Today, 08:42 AM',
    title: 'Money Added',
    subtitle: 'Wallet top-up via HDFC Bank',
    amount: 1000.00,
    type: 'credit',
    status: 'Success',
    icon: 'credit',
    color: '#00b86b',
  },
  {
    id: 't3',
    date: 'Yesterday, 06:30 PM',
    title: 'Mobile Recharge',
    subtitle: 'Airtel • +91 98765 43210',
    amount: -299.00,
    type: 'debit',
    status: 'Success',
    icon: 'debit',
    color: '#e22',
  },
  {
    id: 't4',
    date: 'Yesterday, 04:10 PM',
    title: 'Cashback',
    subtitle: 'UPI Payment cashback',
    amount: 25.00,
    type: 'credit',
    status: 'Success',
    icon: 'credit',
    color: '#00b86b',
  },
  {
    id: 't5',
    date: 'Oct 24, 09:00 AM',
    title: 'Electricity Bill',
    subtitle: 'BSES Rajdhani',
    amount: -1250.00,
    type: 'debit',
    status: 'Success',
    icon: 'debit',
    color: '#e22',
  },
  {
    id: 't6',
    date: 'Oct 23, 07:45 PM',
    title: 'Money Received',
    subtitle: 'Rahul Sharma via UPI',
    amount: 500.00,
    type: 'credit',
    status: 'Success',
    icon: 'credit',
    color: '#00b86b',
  },
  {
    id: 't7',
    date: 'Oct 22, 02:15 PM',
    title: 'DTH Recharge',
    subtitle: 'Tata Play',
    amount: -499.00,
    type: 'debit',
    status: 'Success',
    icon: 'debit',
    color: '#e22',
  },
];

export const OFFERS = [
  {
    id: 'o1',
    title: 'First UPI Payment',
    subtitle: 'Get ₹50 cashback on your first UPI transaction',
    image: 'https://via.placeholder.com/120x80/005bbb/ffffff?text=UPI',
    tag: 'Cashback',
  },
  {
    id: 'o2',
    title: 'Mobile Recharge Offer',
    subtitle: '₹25 cashback on prepaid recharge above ₹199',
    image: 'https://via.placeholder.com/120x80/00b86b/ffffff?text=RECHARGE',
    tag: 'Cashback',
  },
  {
    id: 'o3',
    title: 'Electricity Bill',
    subtitle: 'Pay electricity bill & get ₹40 back',
    image: 'https://via.placeholder.com/120x80/ff9500/ffffff?text=ELECTRICITY',
    tag: 'Bill Pay',
  },
  {
    id: 'o4',
    title: 'DTH Recharge',
    subtitle: 'Recharge DTH and get flat 10% off',
    image: 'https://via.placeholder.com/120x80/8e44ad/ffffff?text=DTH',
    tag: 'Discount',
  },
  {
    id: 'o5',
    title: 'Send Money',
    subtitle: 'Send money to any UPI ID, zero fees',
    image: 'https://via.placeholder.com/120x80/005bbb/ffffff?text=SEND',
    tag: 'Free',
  },
  {
    id: 'o6',
    title: 'Book a Movie Ticket',
    subtitle: '₹100 cashback on movie tickets above ₹250',
    image: 'https://via.placeholder.com/120x80/ff3b30/ffffff?text=MOVIE',
    tag: 'Cashback',
  },
];

export const CONTACTS = [
  { id: 'c1', name: 'Rahul Sharma', mobile: '+91 98765 00001', upiId: 'rahul@paytm' },
  { id: 'c2', name: 'Priya Mehta', mobile: '+91 98765 00002', upiId: 'priya@upi' },
  { id: 'c3', name: 'Amit Singh', mobile: '+91 98765 00003', upiId: 'amit.s@okicici' },
  { id: 'c4', name: 'Sneha Reddy', mobile: '+91 98765 00004', upiId: 'sneha@ybl' },
  { id: 'c5', name: 'Vikram Joshi', mobile: '+91 98765 00005', upiId: 'vikram@okaxis' },
  { id: 'c6', name: 'Ananya Das', mobile: '+91 98765 00006', upiId: 'ananya@upi' },
];
