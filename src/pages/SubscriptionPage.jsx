import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Lock,
  Zap,
  Check,
  Loader2,
  Smartphone,
  Shield,
  Building2,
} from 'lucide-react';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import PricingCards from '../components/subscription/PricingCards';
import {
  getSubscriptionStatus,
  startFreeTrial,
  createSubscription,
  verifySubscriptionPayment,
  cancelSubscription,
  openRazorpaySubscriptionCheckout,
} from '../services/subscriptionApi';
import { useAuth } from '../context/AuthContext';

const PLAN_DETAILS = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    price: '₹0',
    numericPrice: 0,
    period: '3 Days',
    badge: '3-DAY TRIAL',
    description: 'Complimentary full-access diagnostic trial.',
    features: [
      'Full AI Visual Damage Detection',
      '3-Day Full Telemetry Lab Access',
      'Component Identification Engine',
      'Preliminary Cost Intelligence',
      'Scan History & PDF Export',
    ],
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '₹99',
    numericPrice: 99,
    period: '1 Month',
    badge: 'STANDARD',
    description: 'Flexible monthly billing for active workshop technicians.',
    features: [
      'Unlimited AI Damage Diagnoses',
      'All 6 Hardware Categories Unlocked',
      'Real-time Market Pricing Engine',
      'OEM & Aftermarket Parts Estimation',
      'Persistent Scan Telemetry Storage',
      'Cancel Anytime with 1 Click',
    ],
  },
  two_month: {
    id: 'two_month',
    name: '2 Months Plan',
    price: '₹299',
    numericPrice: 299,
    period: '2 Months',
    badge: 'BI-MONTHLY',
    description: 'Bi-monthly uninterrupted access for diagnostic labs.',
    features: [
      'Everything in Monthly Plan',
      'Multi-angle Photo Fusion Engine',
      'Dedicated Nearby Repair Shop Finder',
      'Continuous Hardware Support',
      'Full Telemetry & Scan History Retention',
      'Cancel Anytime with 1 Click',
    ],
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan',
    price: '₹599',
    numericPrice: 599,
    period: '1 Year',
    badge: 'BEST VALUE',
    description: 'Maximum annual cost savings for busy workshops and engineering labs.',
    features: [
      'Everything in All Plans',
      'Maximum Cost Savings (~₹50/month effective)',
      'Priority Cloud AI Inference',
      'Full Enterprise Telemetry Retention',
      'Unlimited Estimates & Reports Export',
      'Dedicated Technician Support',
    ],
  },
};

export default function SubscriptionPage({ onNavigateDashboard }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPlanId, setCheckoutPlanId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [activeLoadingPlan, setActiveLoadingPlan] = useState(null);
  const [paymentStepText, setPaymentStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getSubscriptionStatus();
      setSubData(data);
    } catch (err) {
      console.warn('[SubscriptionPage] Error loading status:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync with URL parameter ?plan=
  useEffect(() => {
    const requestedPlan = searchParams.get('plan');
    if (requestedPlan && PLAN_DETAILS[requestedPlan] && requestedPlan !== 'trial') {
      setCheckoutPlanId(requestedPlan);
    }
  }, [searchParams]);

  const handleSelectPlan = (planKey) => {
    if (planKey === 'trial') {
      handleStartTrial();
      return;
    }

    if (!isAuthenticated) {
      window.sessionStorage.setItem(
        'repairlens.redirectAfterAuth',
        JSON.stringify({ path: `/payment?plan=${planKey}`, plan: planKey })
      );
      navigate('/login');
      return;
    }

    setCheckoutPlanId(planKey);
    setSearchParams({ plan: planKey });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleStartTrial = async () => {
    if (!isAuthenticated) {
      window.sessionStorage.setItem(
        'repairlens.redirectAfterAuth',
        JSON.stringify({ path: '/payment', action: 'start_trial' })
      );
      navigate('/login');
      return;
    }

    try {
      setActiveLoadingPlan('trial');
      setPaymentStepText('Activating 3-day free trial...');
      setErrorMessage('');
      setSuccessMessage('');

      await startFreeTrial();
      setSuccessMessage('Your 3-day free trial has been activated! Full diagnostic lab unlocked.');
      setPaymentCompleted(true);
      await loadStatus();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to start trial.');
    } finally {
      setActiveLoadingPlan(null);
      setPaymentStepText('');
    }
  };

  const handleProceedToPayment = async () => {
    if (!checkoutPlanId) return;

    if (!isAuthenticated) {
      window.sessionStorage.setItem(
        'repairlens.redirectAfterAuth',
        JSON.stringify({ path: `/payment?plan=${checkoutPlanId}`, plan: checkoutPlanId })
      );
      navigate('/login');
      return;
    }

    try {
      setActiveLoadingPlan(checkoutPlanId);
      setPaymentStepText('Initializing secure checkout session...');
      setErrorMessage('');
      setSuccessMessage('');

      const createResult = await createSubscription(checkoutPlanId);
      const { subscriptionId, keyId, plan } = createResult;

      setPaymentStepText('Opening secure Razorpay payment...');

      await openRazorpaySubscriptionCheckout({
        subscriptionId,
        keyId,
        plan,
        user,
        onSuccess: async (paymentData) => {
          try {
            setPaymentStepText('Verifying payment signature...');
            await verifySubscriptionPayment(paymentData);
            setPaymentStepText('Subscription activated successfully');
            setSuccessMessage(`Payment confirmed! Your ${plan.name} subscription is now active.`);
            setPaymentCompleted(true);
            await loadStatus();
          } catch (verifyErr) {
            setErrorMessage(verifyErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setActiveLoadingPlan(null);
            setPaymentStepText('');
          }
        },
        onDismiss: () => {
          setActiveLoadingPlan(null);
          setPaymentStepText('');
          setErrorMessage('Payment session was dismissed.');
        },
        onError: (err) => {
          setActiveLoadingPlan(null);
          setPaymentStepText('');
          setErrorMessage(err.message || 'Payment processing failed.');
        },
      });
    } catch (err) {
      setActiveLoadingPlan(null);
      setPaymentStepText('');
      setErrorMessage(err.message || 'Failed to initiate payment.');
    }
  };

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      setErrorMessage('');
      setSuccessMessage('');
      const result = await cancelSubscription();
      setSuccessMessage(result.message || 'Subscription successfully cancelled.');
      await loadStatus();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to cancel subscription.');
    } finally {
      setIsCancelling(false);
    }
  };

  const selectedPlanDetails = checkoutPlanId ? PLAN_DETAILS[checkoutPlanId] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-xl border border-[#B36262]/40 bg-[#B36262]/10 p-4 flex items-center gap-3 text-xs text-[#B36262] font-mono animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-[#55A477]/40 bg-[#55A477]/10 p-4 flex items-center gap-3 text-xs text-[#55A477] font-mono animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* SUCCESS CONFIRMATION VIEW */}
      {paymentCompleted && (
        <div className="rounded-2xl border border-[#55A477]/40 bg-[#121720] p-8 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#55A477]/10 border border-[#55A477]/40 flex items-center justify-center mx-auto text-[#55A477]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#55A477] font-bold">
              PAYMENT VERIFIED & ACTIVATED
            </div>
            <h2 className="text-2xl font-extrabold text-[#F4F6F8]">
              Welcome to RepairLens Pro!
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
              Your subscription is now fully active. All AI visual damage detection, component breakdown, and market pricing engines are unlocked.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (onNavigateDashboard) {
                  onNavigateDashboard();
                } else {
                  navigate('/dashboard');
                }
              }}
              className="w-full py-3 px-6 rounded-xl bg-[#55A477] hover:bg-[#489167] text-[#080B10] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Diagnostics Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT CHECKOUT VIEW (WHEN A PLAN IS SELECTED) */}
      {selectedPlanDetails && !paymentCompleted && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setCheckoutPlanId(null);
              setSearchParams({});
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#7D91AA] hover:text-[#F4F6F8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Subscription Plans</span>
          </button>

          {/* Checkout Header */}
          <div className="space-y-1 text-left border-b border-[#232B36] pb-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#7D91AA]">
              <Lock className="w-3 h-3 text-[#55A477]" />
              <span>SECURE RAZORPAY PAYMENT GATEWAY</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F6F8]">
              Complete Your Subscription
            </h1>
            <p className="text-xs text-[#A7B0BC]">
              Review your selected plan and proceed to secure checkout.
            </p>
          </div>

          {paymentStepText && (
            <div className="rounded-xl border border-[#7D91AA]/40 bg-[#161C25] p-4 flex items-center justify-center gap-3 text-xs font-mono text-[#F4F6F8] shadow-lg animate-fadeIn">
              <Loader2 className="w-4 h-4 text-[#7D91AA] animate-spin" />
              <span className="font-semibold tracking-wider uppercase">{paymentStepText}</span>
            </div>
          )}

          {/* Two-Column Checkout Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left: Plan Summary */}
            <div className="md:col-span-3 rounded-xl border border-[#232B36] bg-[#121720] p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#7D91AA]">
                    SELECTED SUBSCRIPTION
                  </span>
                  <h3 className="text-xl font-bold text-[#F4F6F8] mt-1">
                    {selectedPlanDetails.name}
                  </h3>
                  <p className="text-xs text-[#A7B0BC] mt-0.5">
                    {selectedPlanDetails.description}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#7D91AA]/15 border border-[#7D91AA]/30 text-[10px] font-mono font-bold text-[#7D91AA]">
                  {selectedPlanDetails.badge}
                </span>
              </div>

              <div className="border-t border-[#232B36] pt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#687382]">
                  INCLUDED LAB CAPABILITIES:
                </span>
                <div className="space-y-2 text-xs text-[#A7B0BC]">
                  {selectedPlanDetails.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#55A477] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="border-t border-[#232B36] pt-4 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#687382]">
                  SUPPORTED PAYMENT CHANNELS:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg border border-[#232B36] bg-[#0D1118] text-center space-y-1">
                    <Smartphone className="w-4 h-4 text-[#7D91AA] mx-auto" />
                    <div className="text-[10px] font-bold text-[#F4F6F8]">UPI</div>
                    <div className="text-[9px] text-[#687382]">GPay / PhonePe / Paytm</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#232B36] bg-[#0D1118] text-center space-y-1">
                    <CreditCard className="w-4 h-4 text-[#7D91AA] mx-auto" />
                    <div className="text-[10px] font-bold text-[#F4F6F8]">Cards</div>
                    <div className="text-[9px] text-[#687382]">Visa, Master, RuPay</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#232B36] bg-[#0D1118] text-center space-y-1">
                    <Building2 className="w-4 h-4 text-[#7D91AA] mx-auto" />
                    <div className="text-[10px] font-bold text-[#F4F6F8]">NetBanking</div>
                    <div className="text-[9px] text-[#687382]">50+ Indian Banks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Pay Button */}
            <div className="md:col-span-2 rounded-xl border border-[#232B36] bg-[#121720] p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#7D91AA] block">
                  ORDER SUMMARY
                </span>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#A7B0BC]">
                    <span>Plan Price ({selectedPlanDetails.period}):</span>
                    <span className="font-mono text-[#F4F6F8] font-bold">{selectedPlanDetails.price}</span>
                  </div>
                  <div className="flex justify-between text-[#A7B0BC]">
                    <span>Platform & Gateway Fee:</span>
                    <span className="font-mono text-[#55A477]">₹0 (Free)</span>
                  </div>
                  <div className="flex justify-between text-[#A7B0BC]">
                    <span>Taxes & GST (18%):</span>
                    <span className="font-mono text-[#A7B0BC]">Included</span>
                  </div>
                  <div className="border-t border-[#232B36] pt-3 flex justify-between text-sm font-bold text-[#F4F6F8]">
                    <span>Total Payable:</span>
                    <span className="font-mono text-base text-[#55A477]">{selectedPlanDetails.price}</span>
                  </div>
                </div>

                {/* Technician Account Info */}
                {user && (
                  <div className="p-3 rounded-lg border border-[#232B36] bg-[#0D1118] space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#687382]">BILLING TO:</span>
                    <div className="font-semibold text-[#F4F6F8] truncate">{user.name || 'Technician'}</div>
                    <div className="text-[#687382] truncate font-mono text-[11px]">{user.email}</div>
                  </div>
                )}
              </div>

              {/* Pay Action Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={activeLoadingPlan !== null}
                  className="w-full py-3 px-4 rounded-lg bg-[#7D91AA] hover:bg-[#8EA3BD] text-[#080B10] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeLoadingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay {selectedPlanDetails.price} via Razorpay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#687382]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#55A477]" />
                  <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAN SELECTION VIEW (DEFAULT) */}
      {!selectedPlanDetails && !paymentCompleted && (
        <>
          {/* Header Section */}
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161C25] border border-[#232B36] text-[10px] font-mono uppercase tracking-[0.14em] text-[#7D91AA]">
              <Sparkles className="w-3 h-3" />
              <span>OFFICIAL REPAIRLENS SUBSCRIPTIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F4F6F8]">
              CHOOSE YOUR DIAGNOSTIC PLAN
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
              Unlock unlimited AI visual damage diagnostics, component analysis, and live repair cost estimates.
            </p>
          </div>

          {/* Active Subscription Status Card (if subscribed) */}
          {subData?.subscription && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A7B0BC] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#55A477]"></span>
                  Active Plan Status
                </span>
              </div>
              <SubscriptionCard
                subscription={subData.subscription}
                onCancel={handleCancel}
                isCancelling={isCancelling}
              />
            </div>
          )}

          {/* Pricing Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7B0BC]">
                Available Plans
              </span>
              <span className="text-[10px] font-mono text-[#687382]">
                CANCEL ANYTIME • SECURE RAZORPAY BILLING
              </span>
            </div>

            <PricingCards
              onSelectPlan={handleSelectPlan}
              onStartTrial={handleStartTrial}
              isTrialEligible={subData?.isTrialEligible ?? true}
              currentPlan={subData?.subscription?.plan}
              activeLoadingPlan={activeLoadingPlan}
              paymentStepText={paymentStepText}
            />
          </div>

          {/* Security Footer Note */}
          <div className="rounded-xl border border-[#232B36] bg-[#0B0F15] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#687382]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#55A477]" />
              <span>256-BIT ENCRYPTED RAZORPAY SUBSCRIPTION INFRASTRUCTURE</span>
            </div>
            <span>ALL MAJOR UPI, CARDS & NETBANKING SUPPORTED</span>
          </div>
        </>
      )}
    </div>
  );
}
