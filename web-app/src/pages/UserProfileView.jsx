import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Crown, Clock, Calendar, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react'

export default function UserProfileView() {
  const { user, profile, subscription, freeFetchesRemaining } = useAuth()
  
  // Sample Payment Verifications history tracker
  const [payments, setPayments] = useState([
    {
      id: 'pay-101',
      planName: '6 Months Pass',
      amount: '$24.99',
      method: 'QR Code / UPI',
      refId: 'UTR9876543210',
      date: '2026-03-29',
      status: 'pending' // pending, approved, rejected
    }
  ])

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-400 text-sm">Please sign in to view your profile and subscription dashboard.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-glow">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-glow">
          {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-white">{profile?.full_name || 'User Account'}</h1>
            {subscription ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                PRO SUBSCRIBER
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[11px] font-bold">
                FREE TIER
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Subscription Card Status */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10 shadow-glow">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Active Subscription Plan</span>
          </h2>
        </div>

        {subscription ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400">Current Plan</span>
              <p className="font-bold text-white text-sm">{subscription.subscription_plans?.name || 'Pro Plan'}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400">Status</span>
              <p className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400">Downloads Limit</span>
              <p className="font-bold text-brand-300 text-sm">Unlimited Fetches & Max Speed</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-white">Free Tier ({freeFetchesRemaining} Free Fetches Remaining)</p>
              <p className="text-slate-400">Subscribe to 3, 6, or 12-month passes for unlimited batch downloads.</p>
            </div>
            <a
              href="/pricing"
              className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs whitespace-nowrap shadow-glow"
            >
              Upgrade Now
            </a>
          </div>
        )}
      </div>

      {/* Payment Verification Tracker */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-glow">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <span>Payment Verification Requests</span>
          </h2>
        </div>

        <div className="space-y-3">
          {payments.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No payment verifications submitted yet.</p>
          ) : (
            payments.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border border-white/5">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{p.planName}</span>
                    <span className="text-slate-400">({p.amount})</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Method: {p.method} • Ref ID: <strong className="text-slate-200">{p.refId}</strong> • Date: {p.date}
                  </p>
                </div>

                <div>
                  {p.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> Pending Admin Verification
                    </span>
                  )}
                  {p.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Active
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
