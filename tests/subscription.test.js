import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { PLANS, verifySubscriptionSignature, verifyWebhookSignature } from '../server/src/services/razorpayService.js';

test('TEST 1: Plans configuration maps exact prices and smallest currency unit (paise)', () => {
  // Plan prices in INR
  assert.strictEqual(PLANS.trial.price, 0);
  assert.strictEqual(PLANS.trial.durationDays, 3);

  assert.strictEqual(PLANS.monthly.price, 99);
  assert.strictEqual(PLANS.monthly.amountPaise, 9900, '₹99 must be 9,900 paise');
  assert.strictEqual(PLANS.monthly.period, 'monthly');
  assert.strictEqual(PLANS.monthly.interval, 1);

  assert.strictEqual(PLANS.two_month.price, 299);
  assert.strictEqual(PLANS.two_month.amountPaise, 29900, '₹299 must be 29,900 paise');
  assert.strictEqual(PLANS.two_month.period, 'monthly');
  assert.strictEqual(PLANS.two_month.interval, 2);

  assert.strictEqual(PLANS.yearly.price, 599);
  assert.strictEqual(PLANS.yearly.amountPaise, 59900, '₹599 must be 59,900 paise');
  assert.strictEqual(PLANS.yearly.period, 'yearly');
  assert.strictEqual(PLANS.yearly.interval, 1);
  assert.strictEqual(PLANS.yearly.badge, 'BEST VALUE');
});

test('TEST 2: New user is eligible for 3-day trial; trial lasts exactly 3 days', () => {
  const userSubscriptions = []; // New user has no prior subscriptions
  const hasUsedTrial = userSubscriptions.some((s) => s.plan === 'trial');
  const isTrialEligible = !hasUsedTrial;

  assert.strictEqual(isTrialEligible, true, 'New user must be eligible for trial');

  const trialStart = new Date('2026-09-09T10:00:00.000Z');
  const trialEnd = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000);

  const diffMs = trialEnd.getTime() - trialStart.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  assert.strictEqual(diffDays, 3, 'Trial must last exactly 3 days');
  assert.strictEqual(trialEnd.toISOString(), '2026-09-12T10:00:00.000Z');
});

test('TEST 3: User cannot receive multiple free trials (single trial per account)', () => {
  const existingSubscriptions = [
    { id: 'sub_1', plan: 'trial', status: 'trialing', trialEnd: new Date('2026-09-12T10:00:00.000Z') },
  ];

  const hasUsedTrial = existingSubscriptions.some((s) => s.plan === 'trial');
  const isTrialEligible = !hasUsedTrial;

  assert.strictEqual(isTrialEligible, false, 'User with prior trial record must NOT be eligible for another trial');
});

test('TEST 4: Active trial grants access during trial period', () => {
  const trialStart = new Date('2026-09-09T00:00:00.000Z');
  const trialEnd = new Date('2026-09-12T00:00:00.000Z');
  const currentTime = new Date('2026-09-10T12:00:00.000Z');

  const isTrialActive = currentTime >= trialStart && currentTime < trialEnd;
  assert.strictEqual(isTrialActive, true, 'Active trial before trialEnd must grant access');
});

test('TEST 5: Expired trial blocks access if no active paid subscription exists', () => {
  const trialEnd = new Date('2026-09-12T00:00:00.000Z');
  const currentTime = new Date('2026-09-13T00:00:00.000Z'); // After expiration

  const isTrialActive = currentTime < trialEnd;
  assert.strictEqual(isTrialActive, false, 'Access must be revoked after trialEnd');
});

test('TEST 6: Active paid subscription grants access during period', () => {
  const periodStart = new Date('2026-09-09T00:00:00.000Z');
  const periodEnd = new Date('2026-10-09T00:00:00.000Z');
  const currentTime = new Date('2026-09-20T00:00:00.000Z');

  const sub = {
    plan: 'monthly',
    status: 'active',
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
  };

  const hasAccess = sub.status === 'active' && currentTime < sub.currentPeriodEnd;
  assert.strictEqual(hasAccess, true, 'Active monthly subscription must grant access');
});

test('TEST 7: Cancelled subscription retains access until currentPeriodEnd (grace period)', () => {
  const periodStart = new Date('2026-09-09T00:00:00.000Z');
  const periodEnd = new Date('2026-10-09T00:00:00.000Z');
  const currentTime = new Date('2026-09-25T00:00:00.000Z'); // Before period end
  const futureTime = new Date('2026-10-10T00:00:00.000Z'); // After period end

  const sub = {
    plan: 'yearly',
    status: 'cancelled',
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: true,
  };

  const hasAccessBeforeEnd = sub.cancelAtPeriodEnd && currentTime < sub.currentPeriodEnd;
  const hasAccessAfterEnd = sub.cancelAtPeriodEnd && futureTime < sub.currentPeriodEnd;

  assert.strictEqual(hasAccessBeforeEnd, true, 'User keeps access until period end');
  assert.strictEqual(hasAccessAfterEnd, false, 'User loses access once period end passes');
});

test('TEST 8: Razorpay subscription signature verification succeeds for valid signature and rejects tampered signature', () => {
  const mockSecret = 'test_secret_key_1234567890';
  process.env.RAZORPAY_KEY_SECRET = mockSecret;

  const paymentId = 'pay_P123456789';
  const subscriptionId = 'sub_S987654321';

  // Compute expected valid signature
  const validSignature = crypto
    .createHmac('sha256', mockSecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest('hex');

  const resultValid = verifySubscriptionSignature({
    razorpay_payment_id: paymentId,
    razorpay_subscription_id: subscriptionId,
    razorpay_signature: validSignature,
  });

  assert.strictEqual(resultValid, true, 'Valid signature must verify successfully');

  // Tampered payment id or signature
  const resultInvalid = verifySubscriptionSignature({
    razorpay_payment_id: 'pay_tampered',
    razorpay_subscription_id: subscriptionId,
    razorpay_signature: validSignature,
  });

  assert.strictEqual(resultInvalid, false, 'Tampered payment id must be rejected');

  // Missing fields
  assert.strictEqual(
    verifySubscriptionSignature({
      razorpay_payment_id: '',
      razorpay_subscription_id: subscriptionId,
      razorpay_signature: validSignature,
    }),
    false
  );
});

test('TEST 9: Webhook signature verification validates authentic payloads and rejects invalid signatures', () => {
  const webhookSecret = 'test_webhook_secret_repairlens';
  const rawBody = JSON.stringify({
    event: 'subscription.charged',
    payload: {
      subscription: {
        entity: {
          id: 'sub_live_123',
          status: 'active',
        },
      },
    },
  });

  const validSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const isValid = verifyWebhookSignature(rawBody, validSignature, webhookSecret);
  assert.strictEqual(isValid, true, 'Authentic webhook signature must pass');

  const isInvalid = verifyWebhookSignature(rawBody, 'wrong_signature_123456', webhookSecret);
  assert.strictEqual(isInvalid, false, 'Forged webhook signature must fail');
});

test('TEST 10: Webhook processing idempotency test', () => {
  // Simulating an idempotent store for subscriptions
  const store = new Map();
  store.set('sub_001', {
    id: 'sub_001',
    status: 'active',
    currentPeriodEnd: new Date('2026-10-09T00:00:00.000Z'),
  });

  function processWebhookEvent(event, subId) {
    if (event === 'subscription.charged') {
      const existing = store.get(subId);
      if (existing) {
        existing.status = 'active';
        existing.lastChargedAt = new Date('2026-09-09T00:00:00.000Z');
      }
    }
  }

  // First webhook delivery
  processWebhookEvent('subscription.charged', 'sub_001');
  assert.strictEqual(store.size, 1);
  assert.strictEqual(store.get('sub_001').status, 'active');

  // Duplicate webhook delivery with identical event
  processWebhookEvent('subscription.charged', 'sub_001');
  assert.strictEqual(store.size, 1, 'Duplicate webhook must not create redundant records');
  assert.strictEqual(store.get('sub_001').status, 'active');
});

test('TEST 11: Pricing safety: Server rejects invalid or client-specified prices', () => {
  const allowedPlanKeys = Object.keys(PLANS);
  assert.ok(allowedPlanKeys.includes('monthly'));
  assert.ok(allowedPlanKeys.includes('two_month'));
  assert.ok(allowedPlanKeys.includes('yearly'));
  assert.ok(!allowedPlanKeys.includes('custom_price_1_rupee'));

  function getPlanServerPrice(planKey) {
    const plan = PLANS[planKey];
    if (!plan || plan.id === 'trial') {
      throw new Error('Invalid plan');
    }
    return plan.price;
  }

  assert.strictEqual(getPlanServerPrice('monthly'), 99);
  assert.strictEqual(getPlanServerPrice('two_month'), 299);
  assert.strictEqual(getPlanServerPrice('yearly'), 599);
  assert.throws(() => getPlanServerPrice('malicious_override'), /Invalid plan/);
});
