import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Check, Crown, Sparkles, QrCode, Upload, ShieldCheck, ArrowRight, X } from 'lucide-react'

const PLANS = [
  {
    id: 'plan_3m',
    name: '3 Months Pass',
    durationMonths: 3,
    price: 14.99,
    description: 'Perfect for short-term projects and fast bulk archiving.',
    features: [
      'Unlimited Fetch & Download Requests',
      'Maximum Download Speeds',
      'Telegram Forum Topics Access',
      'Zero Advertisements',
      'Direct Browser Local Streaming'
    ]
  },
  {
    id: 'plan_6m',
    name: '6 Months Pass',
    durationMonths: 6,
    price: 24.99,
    popular: true,
    description: 'Best value for active Telegram media downloaders.',
    features: [
      'Unlimited Fetch & Download Requests',
      'Maximum Download Speeds',
      'Telegram Forum Topics Access',
      'Zero Advertisements',
      'Direct Browser Local Streaming',
      'Priority Server Slots'
    ]
  },
  {
    id: 'plan_12m',
    name: '12 Months VIP Pass',
    durationMonths: 12,
    price: 39.99,
    description: 'Ultimate 1-Year VIP Pass with all features & updates.',
    features: [
      'Unlimited Fetch & Download Requests',
      'Maximum Download Speeds',
      'Telegram Forum Topics Access',
      'Zero Advertisements',
      'Direct Browser Local Streaming',
      'Priority Server Slots',
      'VIP Support'
    ]
  }
]

export default function PricingView() {
  const { requireAuth, user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  
  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState('qr_code')
  const [txnRefId, setTxnRefId] = useState('')
  const [proofFileName, setProofFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSelectPlan = (plan) => {
    requireAuth(() => {
      setSelectedPlan(plan)
      setShowCheckoutModal(true)
      setSubmitSuccess(false)
    })
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!txnRefId.trim()) {
      alert('Please enter your Transaction Reference ID or UTR number.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>Pro Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Simple, Fair Pricing. Zero Merchant Fees.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Choose a 3, 6, or 12-month plan for unlimited fetches, zero ads, and maximum download speeds.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition border ${
              plan.popular
                ? 'bg-gradient-to-b from-brand-900/40 via-[#18181D] to-[#18181D] border-brand-500 shadow-glow'
                : 'glass-panel border-white/10 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-400 text-white font-bold text-[11px] uppercase tracking-wider shadow-md">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">${plan.price}</span>
                <span className="text-xs text-slate-400 font-medium">/ {plan.durationMonths} months</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-glow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Payment Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#18181D] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-glow text-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitSuccess ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Complete Payment for {selectedPlan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Amount: <strong className="text-white">${selectedPlan.price} USD</strong>. Pay via any method below, then submit your transaction details.
                  </p>
                </div>

                {/* Payment Methods Info Box */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Admin Payment Instructions</span>
                    <span className="text-brand-400 font-medium">100% Secure</span>
                  </div>

                  {/* Sample QR / UPI / Paypal Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                      <p className="text-[11px] text-slate-500 uppercase font-bold">UPI / GPay / PhonePe</p>
                      <p className="font-mono text-white mt-0.5 select-all">admin@upi</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                      <p className="text-[11px] text-slate-500 uppercase font-bold">PayPal.me</p>
                      <p className="font-mono text-white mt-0.5 select-all">paypal.me/admin</p>
                    </div>
                    
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 sm:col-span-2">
                      <p className="text-[11px] text-slate-500 uppercase font-bold">USDT (TRC20 Wallet)</p>
                      <p className="font-mono text-white text-[11px] mt-0.5 break-all select-all">T9xXXxxxxxxxxxxxxxxxxxxxxxxxx</p>
                    </div>
                  </div>
                </div>

                {/* Verification Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Select Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-slate-200 bg-[#18181D] focus:outline-none"
                    >
                      <option value="qr_code">QR Code / UPI</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="crypto">Crypto Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Transaction Reference / UTR / Order ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR123456789 or Paypal Tx ID"
                      value={txnRefId}
                      onChange={(e) => setTxnRefId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Payment Proof Screenshot (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFileName(e.target.files[0]?.name || '')}
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                    {proofFileName && <p className="text-[11px] text-emerald-400 mt-1">Attached: {proofFileName}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 transition shadow-glow text-xs"
                  >
                    {isSubmitting ? 'Submitting Payment Proof...' : 'Submit Payment for Verification'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Payment Submission Received!</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Your payment reference (<strong className="text-white">{txnRefId}</strong>) has been submitted to the Admin for 1-click verification. You can track status on your <strong className="text-white">Profile</strong> page.
                </p>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="py-2.5 px-6 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-glow"
                >
                  Done & Back to Profile
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
