import React, { useState } from 'react';
import { ShieldCheck, Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SubscriptionCard({
  subscription,
  onManage,
  onCancel,
  isCancelling,
}) {
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  if (!subscription) {
    return null;
  }

  const isTrial = subscription.plan === 'trial';
  const isCancelled = subscription.status === 'cancelled' || subscription.cancelAtPeriodEnd;
  const renewalDate = isTrial ? subscription.trialEnd : subscription.currentPeriodEnd;

  const formattedDate = renewalDate
    ? new Date(renewalDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '--';

  const planTitle = {
    trial: 'Free Trial',
    monthly: 'Monthly Plan',
    two_month: '2 Months Plan',
    yearly: 'Yearly Plan',
  }[subscription.plan] || subscription.plan;

  const priceFormatted = isTrial
    ? '₹0 / 3 days'
    : subscription.plan === 'yearly'
    ? '₹599 / year'
    : subscription.plan === 'two_month'
    ? '₹299 / 2 months'
    : '₹99 / month';

  return (
    <div className="rounded-xl border border-[#232B36] bg-[#121720] p-6 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232B36] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.14em] text-[#7D91AA]">
              Current Plan
            </span>
            {isCancelled ? (
              <span className="px-2 py-0.5 rounded-md bg-[#B36262]/10 border border-[#B36262]/30 text-[10px] font-mono text-[#B36262] uppercase tracking-wider">
                CANCELLED — ACCESS UNTIL {formattedDate}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-[#55A477]/10 border border-[#55A477]/30 text-[10px] font-mono text-[#55A477] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#55A477] animate-pulse"></span>
                {subscription.displayStatus || 'ACTIVE'}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-[#F4F6F8]">{planTitle}</h3>
          <p className="text-xs font-mono text-[#A7B0BC]">{priceFormatted}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onManage && (
            <button
              type="button"
              onClick={onManage}
              className="px-3.5 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] hover:border-[#7D91AA]/40 text-xs font-semibold text-[#F4F6F8] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Manage Subscription
            </button>
          )}

          {!isCancelled && onCancel && (
            <button
              type="button"
              onClick={() => setConfirmCancelOpen(true)}
              disabled={isCancelling}
              className="px-3.5 py-2 rounded-lg border border-[#B36262]/30 bg-[#B36262]/10 hover:bg-[#B36262]/20 text-xs font-semibold text-[#B36262] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#232B36] bg-[#0D1118] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#687382] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#7D91AA]" />
            <span>Days Remaining</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#F4F6F8]">
            {subscription.daysRemaining ?? 0} {subscription.daysRemaining === 1 ? 'day' : 'days'}
          </p>
        </div>

        <div className="rounded-lg border border-[#232B36] bg-[#0D1118] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#687382] uppercase tracking-wider">
            <Calendar className="w-3 h-3 text-[#7D91AA]" />
            <span>{isCancelled ? 'Access Expiration' : isTrial ? 'Trial Expiry' : 'Next Billing'}</span>
          </div>
          <p className="text-base font-semibold font-mono text-[#F4F6F8]">
            {formattedDate}
          </p>
        </div>

        <div className="rounded-lg border border-[#232B36] bg-[#0D1118] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#687382] uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#55A477]" />
            <span>Diagnostic Engine</span>
          </div>
          <p className="text-base font-semibold font-mono text-[#55A477]">
            Unlocked
          </p>
        </div>
      </div>

      {confirmCancelOpen && (
        <div className="rounded-lg border border-[#B36262]/40 bg-[#B36262]/10 p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#B36262] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-[#F4F6F8]">Cancel your recurring subscription?</p>
              <p className="text-[#A7B0BC] leading-relaxed">
                Your subscription will not renew, but you will retain full access to RepairLens diagnostic intelligence until <span className="text-[#F4F6F8] font-mono">{formattedDate}</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                await onCancel();
                setConfirmCancelOpen(false);
              }}
              disabled={isCancelling}
              className="px-3 py-1.5 rounded-md bg-[#B36262] hover:bg-[#B36262]/80 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancelOpen(false)}
              className="px-3 py-1.5 rounded-md border border-[#232B36] bg-[#161C25] text-xs font-medium text-[#A7B0BC] hover:text-[#F4F6F8] cursor-pointer"
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
