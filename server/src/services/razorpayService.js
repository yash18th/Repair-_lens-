import Razorpay from 'razorpay';
import crypto from 'crypto';

export const PLANS = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    amountPaise: 0,
    currency: 'INR',
    durationDays: 3,
    period: null,
    interval: null,
    totalCount: 0,
    description: '3 Days Full Access',
    badge: null,
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 99,
    amountPaise: 9900, // 99 INR in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    totalCount: 12,
    description: '₹99 every 1 month',
    badge: null,
  },
  two_month: {
    id: 'two_month',
    name: '2 Months',
    price: 299,
    amountPaise: 29900, // 299 INR in paise
    currency: 'INR',
    period: 'monthly',
    interval: 2,
    totalCount: 6,
    description: '₹299 every 2 months',
    badge: null,
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    price: 599,
    amountPaise: 59900, // 599 INR in paise
    currency: 'INR',
    period: 'yearly',
    interval: 1,
    totalCount: 5,
    description: '₹599 every 1 year',
    badge: 'BEST VALUE',
  },
};

let cachedPlanIds = {};

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Retrieves an existing Razorpay plan ID or creates one dynamically if needed.
 */
export async function getOrCreateRazorpayPlan(planKey) {
  const planConfig = PLANS[planKey];
  if (!planConfig || planConfig.id === 'trial') {
    throw new Error(`Invalid recurring plan: ${planKey}`);
  }

  // 1. Check environment variable override
  const envPlanId = process.env[`RAZORPAY_PLAN_${planKey.toUpperCase()}`];
  if (envPlanId) {
    return envPlanId;
  }

  // 2. Check in-memory cache
  if (cachedPlanIds[planKey]) {
    return cachedPlanIds[planKey];
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    throw new Error('Razorpay credentials not configured on server.');
  }

  // 3. Create plan via Razorpay API
  const planPayload = {
    period: planConfig.period,
    interval: planConfig.interval,
    item: {
      name: `RepairLens ${planConfig.name} Plan`,
      amount: planConfig.amountPaise,
      currency: planConfig.currency,
      description: planConfig.description,
    },
    notes: {
      planKey,
      platform: 'RepairLens',
    },
  };

  const createdPlan = await razorpay.plans.create(planPayload);
  cachedPlanIds[planKey] = createdPlan.id;
  return createdPlan.id;
}

/**
 * Creates a Razorpay subscription for an authenticated user.
 */
export async function createRazorpaySubscription({ planKey, user }) {
  const planConfig = PLANS[planKey];
  if (!planConfig || planConfig.id === 'trial') {
    throw new Error(`Cannot create Razorpay subscription for plan: ${planKey}`);
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    // If Razorpay keys are not yet configured in server environment, provide a test session
    const mockSubId = `sub_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return {
      subscriptionId: mockSubId,
      planId: `plan_test_${planKey}`,
      status: 'created',
      keyId: 'rzp_test_repairlens',
      isTestMode: true,
    };
  }

  const planId = await getOrCreateRazorpayPlan(planKey);

  const subscriptionPayload = {
    plan_id: planId,
    total_count: planConfig.totalCount || 12,
    customer_notify: 1,
    quantity: 1,
    notes: {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      planKey,
    },
  };

  const subscription = await razorpay.subscriptions.create(subscriptionPayload);
  return {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    status: subscription.status,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
}

/**
 * Verifies Razorpay subscription signature cryptographically.
 */
export function verifySubscriptionSignature({
  razorpay_payment_id,
  razorpay_subscription_id,
  razorpay_signature,
}) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    // Test mode fallback when running without configured secret
    if (
      razorpay_subscription_id?.startsWith('sub_test_') ||
      razorpay_signature?.startsWith('test_sig_') ||
      razorpay_signature === 'test_signature_valid'
    ) {
      return true;
    }
    throw new Error('Razorpay secret not configured.');
  }

  if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(razorpay_signature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Verifies Razorpay Webhook signature cryptographically.
 */
export function verifyWebhookSignature(rawBody, signature, secret) {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature || !rawBody) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Cancels a subscription in Razorpay (at cycle end by default).
 */
export async function cancelRazorpaySubscription(subscriptionId, cancelAtCycleEnd = true) {
  const razorpay = getRazorpayClient();
  if (!razorpay) {
    throw new Error('Payment gateway is currently unavailable.');
  }

  return await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
}

/**
 * Fetches subscription details from Razorpay.
 */
export async function fetchRazorpaySubscription(subscriptionId) {
  const razorpay = getRazorpayClient();
  if (!razorpay) {
    throw new Error('Payment gateway is currently unavailable.');
  }

  return await razorpay.subscriptions.fetch(subscriptionId);
}
