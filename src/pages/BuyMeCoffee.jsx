import { useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const supportTiers = [
  {
    id: 'espresso',
    amount: '$5',
    label: 'Quick espresso',
    cta: 'Support with $5',
    description: 'A small thank-you for the work and ideas shared here.',
  },
  {
    id: 'double',
    amount: '$10',
    label: 'Double shot',
    cta: 'Support with $10',
    description: 'A little extra support while I keep building and improving projects.',
  },
  {
    id: 'snacks',
    amount: '$20',
    label: 'Coffee and snacks',
    cta: 'Support with $20',
    description: 'A generous boost toward more experiments, polish, and late-night debugging.',
  },
]

export default function BuyMeCoffee({ onNavigate, currentUser, onLogout, currentPath = '/coffee' }) {
  const [isSubmittingTier, setIsSubmittingTier] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const handleNavigate = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

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
        setCheckoutError('Mate it must be at least $26.00.')
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
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <p className="text-xs uppercase tracking-[0.28em] text-accent/70">Support My Work</p>
              <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Buy me a coffee while I build the next thing.
              </h1>
              {shouldShowDefaultMessage ? (
                <p className="mt-5 max-w-2xl text-sm/7 text-body">
                  Choose a support tier and you will be redirected to secure Stripe Checkout.
                </p>
              ) : null}


              {checkoutStatus === 'success' ? (
                <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-white">
                  Payment successful. Thank you for the support.
                </div>
              ) : null}

              {checkoutStatus === 'cancelled' ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  Checkout was cancelled. You can try again any time.
                </div>
              ) : null}

              {checkoutError ? (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {checkoutError}
                </div>
              ) : null}
            </div>
          </div>
          <section className="m-8">
            <div className='grid gap-5 md:grid-cols-1'>
              <div className="grid gap-5 md:grid-cols-3">
                {supportTiers.map((tier) => (
                  <article key={tier.amount} className="flex h-full flex-col rounded-2xl border border-white/10 bg-card p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-accent/70">{tier.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{tier.amount}</p>
                    <p className="mt-3 flex-1 text-sm/7 text-body">{tier.description}</p>
                    <button
                      type="button"
                      onClick={() => startCheckout({ tier: tier.id })}
                      disabled={isSubmittingTier !== null}
                      className="mt-6 inline-flex w-full justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-wait disabled:opacity-80"
                    >
                      {isSubmittingTier === tier.id ? 'Redirecting...' : tier.cta}
                    </button>
                  </article>
                ))}
              </div>
              <div className='rounded-2xl border border-white/10 bg-card p-5'>
                <p className="text-xs uppercase tracking-[0.24em] text-accent/70">A Coffee Factory</p>
                <div className="mt-3">
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
                    className="block w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:border-accent/60 focus:outline-none"
                  />
                </div>
                <p className="mt-3 text-sm/7 text-body">Do your magic, I want that coffee bean roastering plant</p>
                <button
                  type="button"
                  onClick={() => startCheckout({ customAmount })}
                  disabled={isSubmittingTier !== null}
                  className="mt-6 inline-flex w-full justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-wait disabled:opacity-80"
                >
                  {isSubmittingTier === 'custom' ? 'Redirecting...' : 'Support with custom amount'}
                </button></div>
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
