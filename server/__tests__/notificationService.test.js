import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { NotificationService } from '../services/notification/NotificationService.js';
import { MockNotificationProvider } from '../services/notification/MockNotificationProvider.js';
import { EmailNotificationProvider } from '../services/notification/EmailNotificationProvider.js';
import { PushNotificationProvider } from '../services/notification/PushNotificationProvider.js';

describe('Modular Notification Service', () => {
  let mockProvider;
  let service;

  const sampleUser = {
    id: 'u-1',
    name: 'Taylor Swift',
    email: 'taylor@example.com',
    pushToken: 'push-token-123',
    reminderDaysBefore: 3
  };

  const sampleBill = {
    id: 'b-1',
    title: 'Streaming Subscription',
    amount: 14.99,
    currency: '$',
    dueDate: '2026-11-03T00:00:00.000Z',
    status: 'PENDING'
  };

  beforeEach(() => {
    mockProvider = new MockNotificationProvider('TestMock');
    service = new NotificationService([mockProvider]);
  });

  it('should register and dispatch reminders through provider', async () => {
    const res = await service.sendBillReminder(sampleBill, sampleUser, 3);
    assert.strictEqual(res.success, true);
    assert.strictEqual(mockProvider.getSent().length, 1);

    const sent = mockProvider.getSent()[0];
    assert.strictEqual(sent.bill.id, sampleBill.id);
    assert.strictEqual(sent.user.email, sampleUser.email);
    assert.strictEqual(sent.daysUntilDue, 3);
  });

  it('should handle delivery failure gracefully', async () => {
    mockProvider.setShouldFail(true, 'Network outage');
    const res = await service.sendBillReminder(sampleBill, sampleUser, 3);

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.results[0].success, false);
    assert.strictEqual(res.results[0].error, 'Network outage');
  });

  it('should work with EmailNotificationProvider and custom mailer', async () => {
    let deliveredMail = null;
    const emailProvider = new EmailNotificationProvider({
      mailer: async (mail) => {
        deliveredMail = mail;
        return { messageId: 'msg-123' };
      }
    });

    const emailService = new NotificationService([emailProvider]);
    const res = await emailService.sendBillReminder(sampleBill, sampleUser, 3);

    assert.strictEqual(res.success, true);
    assert.ok(deliveredMail);
    assert.strictEqual(deliveredMail.to, 'taylor@example.com');
    assert.ok(deliveredMail.subject.includes('Streaming Subscription'));
  });

  it('should work with PushNotificationProvider and custom push sender', async () => {
    let deliveredPush = null;
    const pushProvider = new PushNotificationProvider({
      pushSender: async (payload) => {
        deliveredPush = payload;
        return { ticketId: 'ticket-456' };
      }
    });

    const pushService = new NotificationService([pushProvider]);
    const res = await pushService.sendBillReminder(sampleBill, sampleUser, 3);

    assert.strictEqual(res.success, true);
    assert.ok(deliveredPush);
    assert.strictEqual(deliveredPush.to, 'push-token-123');
    assert.strictEqual(deliveredPush.data.billId, 'b-1');
  });

  it('should dynamically register and unregister providers', () => {
    const secondMock = new MockNotificationProvider('SecondMock');
    service.registerProvider(secondMock);
    assert.deepStrictEqual(service.getProviderNames(), ['TestMock', 'SecondMock']);

    service.unregisterProvider('TestMock');
    assert.deepStrictEqual(service.getProviderNames(), ['SecondMock']);
  });
});

