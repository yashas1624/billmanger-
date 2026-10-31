import { INotificationProvider } from './INotificationProvider.js';

export class PushNotificationProvider extends INotificationProvider {
  /**
   * @param {Object} [options]
   * @param {Function} [options.pushSender] Custom push notification dispatcher
   */
  constructor(options = {}) {
    super();
    this.pushSender = options.pushSender || null;
    this.name = options.name || 'PushNotification';
  }

  getName() {
    return this.name;
  }

  canDeliver(user) {
    return Boolean(user && user.pushToken && typeof user.pushToken === 'string' && user.pushToken.trim());
  }

  async send({ user, bill, daysUntilDue, subject, message }) {
    if (!this.canDeliver(user)) {
      return {
        provider: this.name,
        success: false,
        error: `User ${user?.id || 'unknown'} has no registered push token`
      };
    }

    const title = subject || `Bill Due Soon: ${bill.title}`;
    const body = message || `${bill.title} of ${bill.currency || '$'}${Number(bill.amount).toFixed(2)} is due in ${daysUntilDue} day(s).`;
    const payload = {
      to: user.pushToken,
      title,
      body,
      data: {
        billId: bill.id,
        amount: bill.amount,
        dueDate: bill.dueDate
      }
    };

    try {
      if (typeof this.pushSender === 'function') {
        const result = await this.pushSender(payload);
        return {
          provider: this.name,
          success: true,
          recipient: user.pushToken,
          details: result
        };
      }

      console.log(`[PushNotificationProvider] Sent push notification to ${user.pushToken}: "${title}" - ${body}`);
      return {
        provider: this.name,
        success: true,
        recipient: user.pushToken,
        details: { title, body, simulated: true }
      };
    } catch (err) {
      return {
        provider: this.name,
        success: false,
        recipient: user.pushToken,
        error: err.message
      };
    }
  }
}
