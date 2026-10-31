import { EmailNotificationProvider } from './EmailNotificationProvider.js';
import { PushNotificationProvider } from './PushNotificationProvider.js';

export class NotificationService {
  constructor(providers = []) {
    this.providers = new Map();
    providers.forEach(p => this.registerProvider(p));

    // Default providers if none supplied
    if (this.providers.size === 0) {
      this.registerProvider(new EmailNotificationProvider());
      this.registerProvider(new PushNotificationProvider());
    }
  }

  /**
   * Registers a provider
   * @param {import('./INotificationProvider').INotificationProvider} provider 
   */
  registerProvider(provider) {
    if (!provider || typeof provider.getName !== 'function' || typeof provider.send !== 'function') {
      throw new Error('Provider must implement INotificationProvider interface');
    }
    this.providers.set(provider.getName(), provider);
  }

  /**
   * Removes a provider by name
   * @param {string} name 
   */
  unregisterProvider(name) {
    this.providers.delete(name);
  }

  /**
   * Lists active provider names
   * @returns {string[]}
   */
  getProviderNames() {
    return Array.from(this.providers.keys());
  }

  /**
   * Dispatches a bill reminder to all eligible providers for the user
   * @param {Object} bill 
   * @param {Object} user 
   * @param {number} daysUntilDue 
   * @returns {Promise<{ success: boolean, results: Array<Object>, billId: string, userId: string }>}
   */
  async sendBillReminder(bill, user, daysUntilDue) {
    const results = [];
    const eligibleProviders = Array.from(this.providers.values()).filter(p => {
      try {
        return p.canDeliver(user);
      } catch {
        return true;
      }
    });

    if (eligibleProviders.length === 0) {
      return {
        success: false,
        billId: bill.id,
        userId: user.id,
        error: 'No eligible notification providers configured for user credentials',
        results: []
      };
    }

    const subject = `Reminder: "${bill.title}" is due in ${daysUntilDue} day(s)`;
    const message = `Your bill "${bill.title}" for ${bill.currency || '$'}${Number(bill.amount).toFixed(2)} ` +
      `is scheduled for payment on ${new Date(bill.dueDate).toISOString().split('T')[0]}. ` +
      `Please ensure sufficient funds or mark it as paid.`;

    for (const provider of eligibleProviders) {
      try {
        const res = await provider.send({
          user,
          bill,
          daysUntilDue,
          subject,
          message
        });
        results.push(res);
      } catch (err) {
        results.push({
          provider: provider.getName(),
          success: false,
          error: err.message
        });
      }
    }

    // Success if at least one provider successfully delivered
    const anySuccess = results.some(r => r.success);

    return {
      success: anySuccess,
      billId: bill.id,
      userId: user.id,
      results
    };
  }
}

