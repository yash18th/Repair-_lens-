import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
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

export default function SubscriptionPage({ onNavigateDashboard }) {
  const { user, isAuthenticated } = useAuth();
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLoadingPlan, setActiveLoadingPlan] = useState(null);
  const [paymentStepText, setPaymentStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleStartTrial = async () => {
    try {
      setActiveLoadingPlan('trial');
      setPaymentStepText('Activating 3-day free trial...');
      setErrorMessage('');
      setSuccessMessage('');

      const result = await startFreeTrial();
      setSuccessMessage('Your 3-day free trial has been activated! Full diagnostic lab unlocked.');
      await loadStatus();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to start trial.');
    } finally {
      setActiveLoadingPlan(null);
      setPaymentStepText('');
    }
  };

  const handleSelectPlan = async (planKey) => {
    try {
      setActiveLoadingPlan(planKey);
      setPaymentStepText('Creating secure subscription...');
      setErrorMessage('');
      setSuccessMessage('');

      const createResult = await createSubscription(planKey);
      const { subscriptionId, keyId, plan } = createResult;

      setPaymentStepText('Opening secure payment...');

      await openRazorpaySubscriptionCheckout({
        subscriptionId,
        keyId,
        plan,
        user,
        onSuccess: async (paymentData) => {
          try {
            setPaymentStepText('Verifying payment...');
            const verifyResult = await verifySubscriptionPayment(paymentData);
            setPaymentStepText('Subscription activated');
            setSuccessMessage(`Subscription activated successfully! Welcome to RepairLens ${plan.name}.`);
            await loadStatus();
          } catch (verifyErr) {
            setErrorMessage(verifyErr.message || 'Payment verification failed.');
          } finally {
            setActiveLoadingPlan(null);
            setPaymentStepText('');
          }
        },
        onDismiss: () => {
          setActiveLoadingPlan(null);
          setPaymentStepText('');
          setErrorMessage('Subscription checkout was cancelled.');
        },
        onError: (err) => {
          setActiveLoadingPlan(null);
          setPaymentStepText('');
          setErrorMessage(err.message || 'Payment failed.');
        },
      });
    } catch (err) {
      setActiveLoadingPlan(null);
      setPaymentStepText('');
      setErrorMessage(err.message || 'Failed to initiate subscription.');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Header Section */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161C25] border border-[#232B36] text-[10px] font-mono uppercase tracking-[0.14em] text-[#7D91AA]">
          <Sparkles className="w-3 h-3" />
          <span>FLEXIBLE PLANS & TRIALS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F4F6F8]">
          CHOOSE YOUR REPAIRLENS PLAN
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
          Get unlimited access to AI-powered repair diagnostics and RepairLens tools.
        </p>
      </div>

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

      {/* Active Subscription Status Card */}
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
    </div>
  );
}
