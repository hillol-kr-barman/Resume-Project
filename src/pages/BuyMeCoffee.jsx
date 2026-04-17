import { useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const supportTiers = [
  {
    id: 'espresso',
    amount: '$5',
    label: 'Basic Support',
    cta: 'Support with $5',
    description: 'A small contribution toward maintaining this portfolio and its related project work.',
  },
  {
    id: 'double',
    amount: '$10',
    label: 'Standard Support',
    cta: 'Support with $10',
    description: 'Additional support for continued development, hosting, and professional project improvements.',
  },
  {
    id: 'snacks',
    amount: '$20',
    label: 'Extended Support',
    cta: 'Support with $20',
    description: 'A generous contribution toward ongoing technical experiments and portfolio enhancements.',
  },
]

export default function BuyMeCoffee({ onNavigate, currentUser, onLogout, currentPath = '/coffee' }) {
  const [isSubmittingTier, setIsSubmittingTier] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  const checkoutStatus = useMemo(() => new URLSearchParams(window.location.search).get('status'), [])
  const shouldShowDefaultMessage = checkoutStatus === null && !checkoutError

  async function startCheckout({ tier = null, customAmount: rawCustomAmount = null }) {
    setCheckoutError('')

    const submissionId = tier ?? 'custom'
    setIsSubmittingTier(submissionId)

    let requestBody = {}

    if (rawCustomAmount !== null) {
      const parsedAmount = Number.parseFloat(rawCustomAmount)

      if (!Number.isFinite(parsedAmount)) {
        setCheckoutError('Enter a valid amount, for example 26 or 26.50.')
        setIsSubmittingTier(null)
        return
      }

      if (parsedAmount <= 25) {
        setCheckoutError('Custom support amounts must be at least $26.00.')
        setIsSubmittingTier(null)
        return
      }

      requestBody = { custom_amount: parsedAmount }
    } else {
      requestBody = { tier }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      let payload = null

      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        throw new Error(payload?.detail || 'Could not start checkout.')
      }

      if (!payload?.url) {
        throw new Error('Stripe did not return a checkout URL.')
      }

      window.location.href = payload.url
    } catch (error) {
      const message =
        error instanceof TypeError
          ? `Could not reach the payment API at ${API_BASE_URL}. Make sure the FastAPI server is running.`
          : error.message || 'Could not start checkout.'

      setCheckoutError(message)
    } finally {
      setIsSubmittingTier(null)
    }
  }

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 lg:px-6">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-card">
          <div className='flex flex-col items-center text-center'>
            <div className="px-5 py-6 sm:px-6 sm:py-7">
              <p className="type-eyebrow">Support My Work</p>
              <h1 className="type-section-title mt-4 max-w-2xl">
                Support continued portfolio development.
              </h1>
              {shouldShowDefaultMessage ? (
                <p className="type-body mt-4 max-w-2xl">
                  Select a support tier to continue to secure Stripe Checkout.
                </p>
              ) : null}


              {checkoutStatus === 'success' ? (
                <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-white">
                  Payment completed. Thank you for supporting the work.
                </div>
              ) : null}

              {checkoutStatus === 'cancelled' ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  Checkout was cancelled. You can try again at any time.
                </div>
              ) : null}

              {checkoutError ? (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {checkoutError}
                </div>
              ) : null}
            </div>
          </div>
          <section className="m-5 sm:m-6">
            <div className='grid gap-4 md:grid-cols-1'>
              <div className="grid gap-4 md:grid-cols-3">
                {supportTiers.map((tier) => (
                  <article key={tier.amount} className="card-panel flex h-full flex-col">
                    <p className="type-eyebrow">{tier.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{tier.amount}</p>
                    <p className="type-body mt-2 flex-1">{tier.description}</p>
                    <button
                      type="button"
                      onClick={() => startCheckout({ tier: tier.id })}
                      disabled={isSubmittingTier !== null}
                      className="mt-4 inline-flex w-full justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-wait disabled:opacity-80"
                    >
                      {isSubmittingTier === tier.id ? 'Redirecting...' : tier.cta}
                    </button>
                  </article>
                ))}
              </div>
              <div className='card-panel'>
                <p className="type-eyebrow">Custom Support</p>
                <div className="mt-2">
                  <input
                    id="custom_amount"
                    name="custom_amount"
                    type="number"
                    min="1"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="30.00"
                    aria-describedby="custom_amount"
                    value={customAmount}
                    onChange={(event) => setCustomAmount(event.target.value)}
                    className="block w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-accent/60 focus:outline-none"
                  />
                </div>
                <p className="type-body mt-2">Enter a custom amount to support ongoing portfolio development and technical work.</p>
                <button
                  type="button"
                  onClick={() => startCheckout({ customAmount })}
                  disabled={isSubmittingTier !== null}
                  className="mt-4 inline-flex w-full justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-wait disabled:opacity-80"
                >
                  {isSubmittingTier === 'custom' ? 'Redirecting...' : 'Support with a custom amount'}
                </button></div>
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
