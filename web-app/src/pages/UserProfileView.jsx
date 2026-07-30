import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { User, Crown, Clock, Calendar, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react'

export default function UserProfileView() {
  const { user, profile, freeFetchesRemaining } = useAuth()
  const { payments, activeSubscription } = useApp()
  const currentSub = activeSubscription || useAuth().subscription

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-mono text-xs">
        <p className="text-slate-400">AUTHENTICATION REQUIRED TO ACCESS ACCOUNT DASHBOARD.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="glass-panel p-6 rounded-[12px] flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-[8px] bg-[#635BFF] flex items-center justify-center text-white text-2xl font-bold font-mono">
          {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-current">{profile?.full_name || 'User Account'}</h1>
            {currentSub ? (
              <span className="badge-mono bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] font-bold">
                PRO ACTIVE
              </span>
            ) : (
              <span className="badge-mono bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] font-bold">
                FREE TIER
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs font-mono">{user.email}</p>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="glass-panel p-6 rounded-[12px] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
          <h2 className="font-bold text-current text-xs font-mono uppercase flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#00C48C]" />
            <span>Active Plan Details</span>
          </h2>
        </div>

        {currentSub ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-[6px] glass-card space-y-1">
              <span className="text-slate-400 text-[11px]">PLAN TYPE</span>
              <p className="font-bold text-current">{currentSub.planName || currentSub.subscription_plans?.name || 'Pro Plan'}</p>
            </div>
            <div className="p-4 rounded-[6px] glass-card space-y-1">
              <span className="text-slate-400 text-[11px]">STATUS</span>
              <p className="font-bold text-[#00C48C] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </p>
            </div>
            <div className="p-4 rounded-[6px] glass-card space-y-1">
              <span className="text-slate-400 text-[11px]">DOWNLOAD LIMIT</span>
              <p className="font-bold text-[#635BFF]">UNLIMITED</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-[6px] glass-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-current font-mono">Free Tier ({freeFetchesRemaining} Free Fetches Available)</p>
              <p className="text-slate-400">Upgrade to a 3, 6, or 12-month pass for unlimited downloads.</p>
            </div>
            <a
              href="/pricing"
              className="btn-fintech-primary text-xs whitespace-nowrap"
            >
              Upgrade Plan
            </a>
          </div>
        )}
      </div>

      {/* Payment Verification Requests Table */}
      <div className="glass-panel p-6 rounded-[12px] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
          <h2 className="font-bold text-current text-xs font-mono uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#635BFF]" />
            <span>Payment Verification Requests ({payments.length})</span>
          </h2>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {payments.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No payment verifications submitted yet.</p>
          ) : (
            payments.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-[6px] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-current">{p.planName}</span>
                    <span className="text-slate-400">({p.amount})</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Method: {p.method} • Ref ID: <strong className="text-current">{p.refId}</strong>
                  </p>
                </div>

                <div>
                  {p.status === 'pending' && (
                    <span className="badge-mono bg-[#FFC700]/10 border border-[#FFC700]/30 text-[#FFC700]">
                      PENDING VERIFICATION
                    </span>
                  )}
                  {p.status === 'approved' && (
                    <span className="badge-mono bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C]">
                      APPROVED & ACTIVE
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
