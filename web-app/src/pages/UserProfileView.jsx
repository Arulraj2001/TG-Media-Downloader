import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import SeoMeta from '../components/SeoMeta'
import {
  User, Mail, Shield, Crown, Clock, Download,
  Settings, LogOut, ExternalLink, AlertCircle, CheckCircle2,
  BarChart3, Zap, Calendar, ArrowRight
} from 'lucide-react'

export default function UserProfileView() {
  const { user, profile, subscription, signOut, freeFetchesRemaining, tgSession } = useAuth()
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from('payment_verifications')
      .select('*, subscription_plans(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setPaymentHistory(data || [])
        setLoading(false)
      })
  }, [user])

  if (!user || !profile) return null

  const isSubscribed = profile?.subscription_end && new Date(profile.subscription_end) > new Date()
  const subEnd = profile?.subscription_end ? new Date(profile.subscription_end).toLocaleDateString() : null

  const today = new Date().toISOString().split('T')[0]
  const fetchUsedToday = profile?.fetch_date === today ? (profile?.fetch_count || 0) : 0
  const fetchLimit = 5

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SeoMeta title="My Profile — TG Media Downloader" description="View your subscription, download stats, and manage your account." />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">My Account</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile, subscription, and usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#635BFF] to-purple-500 flex items-center justify-center text-white text-xl font-black">
              {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{profile.full_name || 'User'}</p>
              <p className="text-slate-400 text-xs truncate">{profile.email}</p>
              {profile.role === 'admin' && (
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-semibold">ADMIN</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-slate-600" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-slate-600" />
              <span>{isSubscribed ? 'PRO Subscriber' : 'Free Plan'}</span>
            </div>
            {tgSession?.connected && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Telegram connected ({tgSession.phone})</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            {profile.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                <Settings className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            <button onClick={signOut} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Usage & subscription */}
        <div className="md:col-span-2 space-y-4">
          {/* Subscription status */}
          <div className={`glass-panel rounded-2xl p-6 ${isSubscribed ? 'border-[#635BFF]/30' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSubscribed ? 'bg-[#635BFF]' : 'bg-white/[0.05]'}`}>
                  <Crown className={`w-5 h-5 ${isSubscribed ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  <p className="text-white font-bold">{isSubscribed ? `${profile.subscription_plan || 'Pro'} Plan` : 'Free Plan'}</p>
                  <p className="text-xs text-slate-400">
                    {isSubscribed ? `Active until ${subEnd}` : '5 finds per day limit'}
                  </p>
                </div>
              </div>
              {!isSubscribed && (
                <Link to="/pricing" className="flex items-center gap-1 bg-[#635BFF] hover:bg-[#5248e8] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                  Upgrade <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {!isSubscribed && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Daily fetches used</span>
                  <span className="text-white font-mono font-bold">{fetchUsedToday} / {fetchLimit}</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#635BFF] to-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (fetchUsedToday / fetchLimit) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {freeFetchesRemaining} fetches remaining today. Resets at midnight UTC.
                </p>
              </div>
            )}

            {isSubscribed && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Zap className="w-4 h-4" />
                Unlimited fetches — PRO active
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Fetches Today', value: fetchUsedToday, icon: BarChart3 },
              { label: 'TG Connected', value: tgSession?.connected ? 'Yes' : 'No', icon: CheckCircle2 },
              { label: 'Plan', value: isSubscribed ? 'Pro' : 'Free', icon: Crown },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-panel rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 text-[#635BFF] mx-auto mb-2" />
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Payment history */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="text-white font-bold text-sm">Payment History</h3>
            </div>
            {loading ? (
              <div className="py-8 text-center text-slate-500 text-sm">Loading...</div>
            ) : paymentHistory.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-sm">No payment history yet.</p>
                <Link to="/pricing" className="text-[#635BFF] text-xs hover:underline mt-1 inline-block">
                  View plans →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {paymentHistory.map(pv => (
                  <div key={pv.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-semibold">{pv.subscription_plans?.name || pv.plan_id}</p>
                      <p className="text-slate-500 text-[10px] font-mono">Ref: {pv.reference_id}</p>
                      <p className="text-slate-600 text-[10px]">{new Date(pv.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                      pv.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      pv.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {pv.status.charAt(0).toUpperCase() + pv.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
