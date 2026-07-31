import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import SeoMeta from '../components/SeoMeta'
import { Check, Crown, ShieldCheck, ArrowRight, X, Lock, FileCheck, Globe, Upload, Image } from 'lucide-react'

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 }
]

export default function PricingView() {
  const { systemSettings, submitPaymentVerification } = useApp()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  // Currency State
  const [currency, setCurrency] = useState('USD')
  const activeCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]

  const formatPrice = (usdPrice) => {
    const val = usdPrice * activeCurrency.rate
    if (currency === 'INR') return Math.round(val).toLocaleString('en-IN')
    return val.toFixed(2)
  }

  const BASE_PLANS = [
    {
      id: 'plan_3m',
      name: '3 Months Pass',
      durationMonths: 3,
      usdPrice: systemSettings.plan3mPrice || 14.99,
      description: 'Ideal for short-term bulk archiving projects.',
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
      usdPrice: systemSettings.plan6mPrice || 24.99,
      popular: true,
      description: 'Best value pass for active Telegram media downloaders.',
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
      usdPrice: systemSettings.plan12mPrice || 39.99,
      description: 'Full 1-Year VIP Pass with all features and priority slots.',
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

  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState('qr_code')
  const [txnRefId, setTxnRefId] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setSubmitError('File too large. Max 10MB.'); return }
    setProofFile(file)
    setProofPreview(URL.createObjectURL(file))
    setSubmitError('')
  }

  const handleSelectPlan = (plan) => {
    requireAuth(() => {
      setSelectedPlan(plan)
      setShowCheckoutModal(true)
      setSubmitSuccess(false)
      setSubmitError('')
      setProofPreview('')
      setProofFile(null)
      setTxnRefId('')
    })
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!txnRefId.trim()) { setSubmitError('Please enter your Transaction Reference ID or UTR.'); return }
    if (!proofFile) { setSubmitError('Please upload a payment screenshot.'); return }
    if (!user) { setSubmitError('Please sign in first.'); return }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Upload screenshot to Supabase Storage
      const ext = proofFile.name.split('.').pop() || 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(path, proofFile, { contentType: proofFile.type, upsert: false })

      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`)

      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path)
      const screenshotUrl = urlData?.publicUrl || ''

      // Insert payment_verifications row
      const { error: insertErr } = await supabase.from('payment_verifications').insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount_paid: selectedPlan.usdPrice * activeCurrency.rate,
        currency: activeCurrency.code,
        payment_method: paymentMethod === 'qr_code' ? 'QR Code / UPI' : paymentMethod === 'paypal' ? 'PayPal' : 'Other',
        reference_id: txnRefId.trim(),
        screenshot_url: screenshotUrl,
        status: 'pending',
      })

      if (insertErr) throw new Error(`Submit failed: ${insertErr.message}`)

      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <SeoMeta
        title="Pricing & Subscription Passes - TG Media Downloader"
        description="Choose a 3-month, 6-month, or 12-month pass for unlimited downloads, max speed, and zero ads."
      />

      {/* Header & Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>PRO PASSES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            Transparent Global Pricing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Select a pass for unlimited downloads, zero ads, and high-speed local streaming.
          </p>
        </div>

        {/* Currency Selector Bar */}
        <div className="glass-panel p-2 rounded-[8px] flex items-center gap-2 border border-[#CBD5E1] dark:border-white/10 shadow-sm">
          <Globe className="w-4 h-4 text-[#635BFF] ml-2" />
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Currency:</span>
          <div className="flex items-center gap-1">
            {CURRENCIES.map(curr => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`px-3 py-1 rounded-[6px] text-xs font-mono font-bold transition ${
                  currency === curr.code
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {curr.symbol} {curr.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BASE_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-[12px] p-6 sm:p-8 flex flex-col justify-between transition border ${
              plan.popular
                ? 'glass-panel border-[#635BFF] shadow-lift'
                : 'glass-panel hover:border-[#635BFF]/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-[4px] bg-[#635BFF] text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm">
                MOST POPULAR
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-current">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl sm:text-4xl font-extrabold text-current">
                  {activeCurrency.symbol}{formatPrice(plan.usdPrice)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ {plan.durationMonths}m ({activeCurrency.code})</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-[#CBD5E1] dark:border-white/10 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C48C] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full ${plan.popular ? 'btn-fintech-primary' : 'btn-fintech-secondary'}`}
              >
                <span>Select Plan ({activeCurrency.code})</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Payment Verification Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel rounded-[12px] p-6 sm:p-8 text-current max-h-[90vh] overflow-y-auto shadow-lift">
            
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-current p-1 rounded-[4px] hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitSuccess ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-current">Complete Payment for {selectedPlan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Amount: <strong className="font-mono text-current">{activeCurrency.symbol}{formatPrice(selectedPlan.usdPrice)} {activeCurrency.code}</strong>. Transfer using instructions below, then submit reference info.
                  </p>
                </div>

                {/* Payment Methods Details & QR Code */}
                <div className="p-4 rounded-[10px] glass-card space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                    <span className="font-mono font-bold text-xs uppercase">SCAN QR CODE OR COPY PAY DETAILS</span>
                    <span className="text-[#00C48C] font-mono text-[10px] font-bold">INSTANT VERIFICATION</span>
                  </div>

                  {/* QR Code Display Card */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-100 dark:bg-white/5 p-3.5 rounded-[8px] border border-slate-200 dark:border-white/10">
                    <div className="bg-white p-2 rounded-[8px] border border-slate-300 dark:border-white/20 shadow-sm shrink-0">
                      <img
                        src={systemSettings.paymentQrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=admin@upi&pn=TG%20Downloader'}
                        alt="Payment QR Code"
                        className="w-36 h-36 object-contain rounded-[4px]"
                      />
                    </div>
                    <div className="space-y-2 font-mono text-xs text-left flex-1">
                      <div className="p-2 rounded-[6px] glass-input">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">UPI / GPAY ID</p>
                        <p className="font-bold text-[#635BFF] text-xs mt-0.5 select-all">{systemSettings.paymentUpiId || 'admin@upi'}</p>
                      </div>

                      <div className="p-2 rounded-[6px] glass-input">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">PAYPAL.ME</p>
                        <p className="font-bold text-current text-xs mt-0.5 select-all">{systemSettings.paymentPaypalMe || 'paypal.me/admin'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Payment Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input font-mono text-xs focus:outline-none"
                    >
                      <option value="qr_code">QR Code / UPI</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="crypto">Crypto Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Transaction Reference / UTR / Order ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR123456789"
                      value={txnRefId}
                      onChange={(e) => setTxnRefId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Upload Payment Screenshot / Receipt *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                      className="w-full text-xs font-mono text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-[6px] file:border-0 file:bg-[#635BFF]/10 file:text-[#635BFF] file:font-bold hover:file:bg-[#635BFF]/20"
                    />
                    {proofPreview && (
                      <div className="mt-2 p-2 rounded-[6px] glass-card flex items-center gap-3">
                        <img src={proofPreview} alt="Receipt Screenshot" className="w-16 h-16 object-cover rounded-[4px] border border-slate-200 dark:border-white/10" />
                        <span className="text-[11px] text-[#00C48C] font-mono font-bold">✓ Screenshot Attached</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-fintech-primary text-xs flex items-center justify-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT PAYMENT FOR VERIFICATION'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-10 h-10 rounded-[6px] bg-[#00C48C]/20 border border-[#00C48C]/40 text-[#00C48C] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-current">Payment Submitted</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your payment reference (<strong className="font-mono text-current">{txnRefId}</strong>) for {activeCurrency.symbol}{formatPrice(selectedPlan.usdPrice)} {activeCurrency.code} has been submitted for admin verification.
                </p>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="btn-fintech-primary text-xs"
                >
                  Return to Account
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
