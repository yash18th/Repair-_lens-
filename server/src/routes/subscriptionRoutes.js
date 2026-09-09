import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { getUserSubscriptionStatus } from '../middleware/subscription.js';
import {
  PLANS,
  createRazorpaySubscription,
  verifySubscriptionSignature,
  verifyWebhookSignature,
  cancelRazorpaySubscription,
  fetchRazorpaySubscription,
} from '../services/razorpayService.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const createSchema = z.object({
  plan: z.enum(['monthly', 'two_month', 'yearly']),
});

const verifySchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_subscription_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  plan: z.enum(['monthly', 'two_month', 'yearly']).optional(),
});

/**
 * GET /api/subscription
 * Retrieves the current subscription status and available plans for the authenticated user.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const subStatus = await getUserSubscriptionStatus(req.user.id);

    return successResponse(res, {
      hasActiveAccess: subStatus.hasActiveAccess,
      isTrialEligible: subStatus.isTrialEligible,
      subscription: subStatus.subscription,
      plans: PLANS,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
    });
  } catch (error) {
    console.error('[Subscription Routes] Fetch status error:', error.message);
    return errorResponse(res, 'Unable to load subscription details.', 500);
  }
});

/**
 * POST /api/subscription/trial
 * Starts a 3-day free trial. Enforces single lifetime trial per user account server-side.
 */
router.post('/trial', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Rule: Server-side check for existing trial. Never trust frontend flags.
    const existingTrial = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: 'trial',
      },
    });

    if (existingTrial) {
      return errorResponse(res, 'You have already used your 3-day free trial.', 400);
    }

    // Check if user already has an active paid subscription
    const currentStatus = await getUserSubscriptionStatus(userId);
    if (currentStatus.hasActiveAccess && currentStatus.subscription?.plan !== 'trial') {
      return errorResponse(res, 'You already have an active subscription.', 400);
    }

    const trialStart = new Date();
    const trialEnd = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: 'trial',
        status: 'trialing',
        provider: 'free_trial',
        price: 0,
        currency: 'INR',
        trialStart,
        trialEnd,
        currentPeriodStart: trialStart,
        currentPeriodEnd: trialEnd,
        cancelAtPeriodEnd: false,
      },
    });

    return successResponse(res, {
      message: 'Your 3-day free trial has been activated!',
      subscription: {
        ...subscription,
        daysRemaining: 3,
        displayStatus: 'Trial Active',
      },
    }, 201);
  } catch (error) {
    console.error('[Subscription Routes] Trial start error:', error.message);
    return errorResponse(res, 'Unable to start free trial. Please try again.', 500);
  }
});

/**
 * POST /api/subscription/create
 * Creates a Razorpay subscription for the chosen paid plan.
 */
router.post('/create', requireAuth, async (req, res) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'Please select a valid subscription plan.', 400);
    }

    const { plan: planKey } = parsed.data;
    const planConfig = PLANS[planKey];
    const userId = req.user.id;

    // Prevent duplicate active subscriptions
    const currentStatus = await getUserSubscriptionStatus(userId);
    if (
      currentStatus.hasActiveAccess &&
      currentStatus.subscription?.plan !== 'trial' &&
      !currentStatus.subscription?.cancelAtPeriodEnd
    ) {
      return errorResponse(
        res,
        'You already have an active subscription. Please manage or cancel your existing subscription before switching plans.',
        400
      );
    }

    // Create subscription via Razorpay API
    const razorpaySub = await createRazorpaySubscription({
      planKey,
      user: req.user,
    });

    // Record pending subscription in database
    await prisma.subscription.create({
      data: {
        userId,
        plan: planKey,
        status: 'pending',
        provider: 'razorpay',
        providerSubscriptionId: razorpaySub.subscriptionId,
        providerPlanId: razorpaySub.planId,
        price: planConfig.price,
        currency: planConfig.currency,
        cancelAtPeriodEnd: false,
      },
    });

    return successResponse(res, {
      subscriptionId: razorpaySub.subscriptionId,
      keyId: razorpaySub.keyId,
      plan: planConfig,
    });
  } catch (error) {
    console.error('[Subscription Routes] Create subscription error:', error.message);
    return errorResponse(res, error.message || 'Unable to initiate subscription.', 500);
  }
});

/**
 * POST /api/subscription/verify
 * Cryptographically verifies the Razorpay payment signature and activates the subscription.
 */
router.post('/verify', requireAuth, async (req, res) => {
  try {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'Invalid subscription verification payload.', 400);
    }

    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan: planKey } = parsed.data;

    // Cryptographic signature verification
    const isValid = verifySubscriptionSignature({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    if (!isValid) {
      console.warn('[Subscription Routes] Signature verification failed for sub:', razorpay_subscription_id);
      return errorResponse(res, 'Payment verification failed. Please contact support.', 400);
    }

    // Fetch live subscription details from Razorpay
    let periodStart = new Date();
    let periodEnd = new Date();

    try {
      const liveSub = await fetchRazorpaySubscription(razorpay_subscription_id);
      if (liveSub.current_start) {
        periodStart = new Date(liveSub.current_start * 1000);
      }
      if (liveSub.current_end) {
        periodEnd = new Date(liveSub.current_end * 1000);
      } else {
        // Fallback calculation based on plan interval
        const monthsToAdd = planKey === 'yearly' ? 12 : planKey === 'two_month' ? 2 : 1;
        periodEnd.setMonth(periodEnd.getMonth() + monthsToAdd);
      }
    } catch (fetchErr) {
      console.warn('[Subscription Routes] Could not fetch live details, using defaults:', fetchErr.message);
      const monthsToAdd = planKey === 'yearly' ? 12 : planKey === 'two_month' ? 2 : 1;
      periodEnd.setMonth(periodEnd.getMonth() + monthsToAdd);
    }

    // Update existing pending record or upsert by providerSubscriptionId
    const updated = await prisma.subscription.upsert({
      where: {
        providerSubscriptionId: razorpay_subscription_id,
      },
      update: {
        status: 'active',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      },
      create: {
        userId: req.user.id,
        plan: planKey || 'monthly',
        status: 'active',
        provider: 'razorpay',
        providerSubscriptionId: razorpay_subscription_id,
        price: planKey ? PLANS[planKey]?.price || 99 : 99,
        currency: 'INR',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    return successResponse(res, {
      message: 'Subscription successfully activated!',
      subscription: updated,
    });
  } catch (error) {
    console.error('[Subscription Routes] Verify error:', error.message);
    return errorResponse(res, 'Unable to verify subscription.', 500);
  }
});

/**
 * POST /api/subscription/cancel
 * Schedules cancellation of the active subscription at the end of the current billing cycle.
 */
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentStatus = await getUserSubscriptionStatus(userId);

    if (!currentStatus.hasActiveAccess || !currentStatus.subscription) {
      return errorResponse(res, 'No active subscription found to cancel.', 404);
    }

    const sub = currentStatus.subscription;

    // If active trial
    if (sub.plan === 'trial') {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      });

      return successResponse(res, {
        message: 'Your free trial has been cancelled.',
      });
    }

    // If Razorpay subscription
    if (sub.providerSubscriptionId) {
      try {
        await cancelRazorpaySubscription(sub.providerSubscriptionId, true);
      } catch (err) {
        console.warn('[Subscription Routes] Razorpay cancel call returned:', err.message);
      }
    }

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
      },
    });

    const accessUntilDate = updated.currentPeriodEnd
      ? new Date(updated.currentPeriodEnd).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'the end of your billing cycle';

    return successResponse(res, {
      message: `Your subscription is cancelled and will remain active until ${accessUntilDate}.`,
      subscription: updated,
    });
  } catch (error) {
    console.error('[Subscription Routes] Cancel error:', error.message);
    return errorResponse(res, 'Unable to cancel subscription. Please try again.', 500);
  }
});

/**
 * POST /api/subscription/webhook
 * Idempotent Razorpay Webhook Handler.
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      console.warn('[Subscription Webhook] Invalid webhook signature');
      return errorResponse(res, 'Invalid webhook signature', 400);
    }

    const event = req.body?.event;
    const subscriptionEntity = req.body?.payload?.subscription?.entity;

    if (!subscriptionEntity || !subscriptionEntity.id) {
      // Return 200 to acknowledge non-subscription events gracefully
      return successResponse(res, { received: true, ignored: true });
    }

    const subscriptionId = subscriptionEntity.id;
    console.log(`[Subscription Webhook] Processing event "${event}" for subscription ${subscriptionId}`);

    const periodStart = subscriptionEntity.current_start
      ? new Date(subscriptionEntity.current_start * 1000)
      : undefined;
    const periodEnd = subscriptionEntity.current_end
      ? new Date(subscriptionEntity.current_end * 1000)
      : undefined;

    // Idempotent event state updates
    switch (event) {
      case 'subscription.authenticated':
      case 'subscription.activated':
      case 'subscription.charged':
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscriptionId },
          data: {
            status: 'active',
            ...(periodStart ? { currentPeriodStart: periodStart } : {}),
            ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
            cancelAtPeriodEnd: false,
          },
        });
        break;

      case 'subscription.pending':
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscriptionId },
          data: { status: 'pending' },
        });
        break;

      case 'subscription.halted':
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscriptionId },
          data: { status: 'past_due' },
        });
        break;

      case 'subscription.cancelled':
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscriptionId },
          data: {
            status: 'cancelled',
            cancelAtPeriodEnd: true,
            cancelledAt: new Date(),
          },
        });
        break;

      case 'subscription.completed':
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscriptionId },
          data: { status: 'expired' },
        });
        break;

      default:
        console.log(`[Subscription Webhook] Unhandled event: ${event}`);
    }

    return successResponse(res, { received: true, processed: true });
  } catch (error) {
    console.error('[Subscription Webhook] Processing error:', error.message);
    return errorResponse(res, 'Webhook handler error', 500);
  }
});

export default router;
