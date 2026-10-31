import { INotificationProvider } from './INotificationProvider.js';

export class EmailNotificationProvider extends INotificationProvider {
  /**
   * @param {Object} [options]
   * @param {Function} [options.mailer] Custom mailer function for testing/production
   */
  constructor(options = {}) {
    super();
    this.mailer = options.mailer || null;
    this.name = options.name || 'Email';
  }

  getName() {
    return this.name;
  }

  canDeliver(user) {
    return Boolean(user && user.email && typeof user.email === 'string' && user.email.includes('@'));
  }

  async send({ user, bill, daysUntilDue, subject, message }) {
    if (!this.canDeliver(user)) {
      return {
        provider: this.name,
        success: false,
        error: `User ${user?.id || 'unknown'} has no valid email address`
      };
    }

    const emailSubject = subject || `Upcoming Bill Reminder: ${bill.title} due in ${daysUntilDue} day(s)`;
    const emailBody = message || `Hello ${user.name || 'there'},\n\n` +
      `This is a reminder that your bill "${bill.title}" of ${bill.currency || '$'}${Number(bill.amount).toFixed(2)} ` +
      `is due on ${new Date(bill.dueDate).toLocaleDateString()}.\n\n` +
      `Status: ${bill.status}\n` +
      `Thank you for using Bill Manager.`;

    try {
      if (typeof this.mailer === 'function') {
        const result = await this.mailer({
          to: user.email,
          subject: emailSubject,
          text: emailBody,
          billId: bill.id
        });
        return {
          provider: this.name,
          success: true,
          recipient: user.email,
          details: result
        };
      }

      // Default safe delivery logger
      console.log(`[EmailNotificationProvider] Sent email to ${user.email}: "${emailSubject}"`);
      return {
        provider: this.name,
        success: true,
        recipient: user.email,
        details: { subject: emailSubject, simulated: true }
      };
    } catch (err) {
      return {
        provider: this.name,
        success: false,
        recipient: user.email,
        error: err.message
      };
    }
  }
}

