/**
 * Abstract Base Class / Interface for Notification Providers
 */
export class INotificationProvider {
  /**
   * @returns {string} The unique name of this provider
   */
  getName() {
    throw new Error('getName() must be implemented by provider');
  }

  /**
   * Whether this provider can deliver to the given user
   * @param {Object} _user 
   * @returns {boolean}
   */
  canDeliver(_user) {
    return true;
  }

  /**
   * Dispatches a bill reminder
   * @param {Object} _params
   * @returns {Promise<{ provider: string, success: boolean, details?: any, error?: string }>}
   */
  async send(_params) {
    throw new Error('send() must be implemented by provider');
  }
}
