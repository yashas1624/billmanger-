import { INotificationProvider } from './INotificationProvider.js';

export class MockNotificationProvider extends INotificationProvider {
  constructor(name = 'MockNotificationProvider') {
    super();
    this.name = name;
    this.sentNotifications = [];
    this.shouldFail = false;
    this.failureError = 'Simulated delivery failure';
  }

  getName() {
    return this.name;
  }

  setShouldFail(shouldFail, error = 'Simulated delivery failure') {
    this.shouldFail = shouldFail;
    this.failureError = error;
  }

  clear() {
    this.sentNotifications = [];
  }

  getSent() {
    return [...this.sentNotifications];
  }

  async send({ user, bill, daysUntilDue, subject, message }) {
    if (this.shouldFail) {
      const result = {
        provider: this.name,
        success: false,
        error: this.failureError
      };
      return result;
    }

    const record = {
      provider: this.name,
      success: true,
      user,
      bill,
      daysUntilDue,
      subject,
      message,
      timestamp: new Date().toISOString()
    };
    this.sentNotifications.push(record);
    return record;
  }
}
