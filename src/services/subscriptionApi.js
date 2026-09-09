import { getApiBaseUrl } from './config';

/**
 * Loads the official Razorpay Checkout SDK script asynchronously.
 */
export function loadRazorpayCheckoutScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }

    if (window.Razorpay) {
      return resolve(true);
    }

    const existingScript = document.getElementById('razorpay-checkout-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Fetch current user's subscription status, trial eligibility, and available plans.
 */
export async function getSubscriptionStatus() {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/subscription`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Unable to retrieve subscription status.');
  }

  return payload;
}

/**
 * Starts the one-time 3-day free trial.
 */
export async function startFreeTrial() {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/subscription/trial`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Unable to start 3-day free trial.');
  }

  return payload;
}

/**
 * Requests backend to create a Razorpay subscription.
 */
export async function createSubscription(planKey) {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/subscription/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: planKey }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Unable to create subscription.');
  }

  return payload;
}

/**
 * Submits payment and subscription signature to backend for cryptographic verification.
 */
export async function verifySubscriptionPayment(verificationData) {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/subscription/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verificationData),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Payment verification failed.');
  }

  return payload;
}

/**
 * Requests cancellation of the active subscription at the end of the billing period.
 */
export async function cancelSubscription() {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/subscription/cancel`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Unable to cancel subscription.');
  }

  return payload;
}

/**
 * Opens Razorpay Checkout modal for subscription authorization.
 */
export async function openRazorpaySubscriptionCheckout({
  subscriptionId,
  keyId,
  plan,
  user,
  onSuccess,
  onDismiss,
  onError,
}) {
  const scriptLoaded = await loadRazorpayCheckoutScript();
  if (!scriptLoaded || !window.Razorpay) {
    throw new Error('Unable to load payment interface. Please check your internet connection or try again.');
  }

  const effectiveKey = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!effectiveKey) {
    throw new Error('Payment gateway configuration is missing.');
  }

  const options = {
    key: effectiveKey,
    subscription_id: subscriptionId,
    name: 'RepairLens Intelligence',
    description: `${plan.name} Subscription (₹${plan.price})`,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=128',
    currency: 'INR',
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || '',
    },
    theme: {
      color: '#7D91AA',
      backdrop_color: 'rgba(8, 11, 16, 0.9)',
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      escape: true,
      animation: true,
    },
    handler: async function (response) {
      try {
        if (onSuccess) {
          await onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
            plan: plan.id,
          });
        }
      } catch (err) {
        if (onError) onError(err);
      }
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.on('payment.failed', function (response) {
    if (onError) {
      onError(new Error(response.error?.description || 'Payment was unsuccessful. Please try again.'));
    }
  });

  razorpayInstance.open();
}
