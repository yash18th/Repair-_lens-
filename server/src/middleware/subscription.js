import { prisma } from '../db.js';

/**
 * Computes the authoritative server-side subscription and access status for a user.
 */
export async function getUserSubscriptionStatus(userId) {
  if (!userId) {
    return {
      hasActiveAccess: false,
      isTrialEligible: false,
      subscription: null,
    };
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();

  // Rule: A user can only receive ONE 3-day free trial in their account lifetime.
  const hasUsedTrial = subscriptions.some((s) => s.plan === 'trial');
  const isTrialEligible = !hasUsedTrial;

  // 1. Check for active paid subscription
  const activePaid = subscriptions.find(
    (s) => s.plan !== 'trial' && s.status === 'active' && s.currentPeriodEnd && new Date(s.currentPeriodEnd) > now
  );

  // 2. Check for cancelled subscription with access remaining until current period end
  const cancelledWithGrace = subscriptions.find(
    (s) =>
      s.plan !== 'trial' &&
      s.status === 'cancelled' &&
      s.cancelAtPeriodEnd &&
      s.currentPeriodEnd &&
      new Date(s.currentPeriodEnd) > now
  );

  // 3. Check for active trial
  const activeTrial = subscriptions.find(
    (s) => s.plan === 'trial' && s.status === 'trialing' && s.trialEnd && new Date(s.trialEnd) > now
  );

  const activeSub = activePaid || cancelledWithGrace || activeTrial;
  const hasActiveAccess = Boolean(activeSub);

  // Pick the most relevant subscription record to display (active, or most recent)
  const primarySub = activeSub || subscriptions[0] || null;

  if (!primarySub) {
    return {
      hasActiveAccess: false,
      isTrialEligible,
      subscription: null,
    };
  }

  let daysRemaining = 0;
  let displayStatus = 'Inactive';
  const effectiveEnd = primarySub.plan === 'trial' ? primarySub.trialEnd : primarySub.currentPeriodEnd;

  if (effectiveEnd) {
    const diffMs = new Date(effectiveEnd).getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  if (activePaid) {
    displayStatus = 'Active';
  } else if (cancelledWithGrace) {
    const formattedDate = new Date(primarySub.currentPeriodEnd).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    displayStatus = `Cancelled — Access until ${formattedDate}`;
  } else if (activeTrial) {
    displayStatus = 'Trial Active';
  } else if (primarySub.status === 'trialing' && primarySub.trialEnd && new Date(primarySub.trialEnd) <= now) {
    displayStatus = 'Trial Expired';
  } else if (primarySub.status === 'cancelled') {
    displayStatus = 'Cancelled';
  } else if (primarySub.status === 'past_due') {
    displayStatus = 'Past Due';
  } else {
    displayStatus = 'Expired';
  }

  return {
    hasActiveAccess,
    isTrialEligible,
    subscription: {
      id: primarySub.id,
      plan: primarySub.plan,
      status: primarySub.status,
      provider: primarySub.provider,
      providerSubscriptionId: primarySub.providerSubscriptionId,
      price: primarySub.price,
      currency: primarySub.currency,
      trialStart: primarySub.trialStart,
      trialEnd: primarySub.trialEnd,
      currentPeriodStart: primarySub.currentPeriodStart,
      currentPeriodEnd: primarySub.currentPeriodEnd,
      cancelAtPeriodEnd: primarySub.cancelAtPeriodEnd,
      cancelledAt: primarySub.cancelledAt,
      daysRemaining,
      displayStatus,
      createdAt: primarySub.createdAt,
    },
  };
}

/**
 * Access control middleware protecting paid RepairLens features.
 */
export async function requireActiveSubscription(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const subStatus = await getUserSubscriptionStatus(req.user.id);

    if (subStatus.hasActiveAccess) {
      req.subscription = subStatus.subscription;
      return next();
    }

    return res.status(403).json({
      success: false,
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'An active subscription or 3-day free trial is required to perform AI diagnoses.',
      subscription: subStatus.subscription,
      isTrialEligible: subStatus.isTrialEligible,
    });
  } catch (error) {
    console.error('[Subscription Middleware] Error checking access:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify subscription access.',
    });
  }
}
