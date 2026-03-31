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
  const handleNavigate = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  const checkoutStatus = useMemo(() => new URLSearchParams(window.location.search).get('status'), [])

  async function startCheckout(tier) {
    setCheckoutError('')
    setIsSubmittingTier(tier)

    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
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
      setCheckoutError(error.message || 'Could not start checkout.')
    } finally {
      setIsSubmittingTier(null)
    }
  }

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-card">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_24rem]">
            <div className="px-8 py-10 sm:px-10 sm:py-12">
              <p className="text-sm uppercase tracking-[0.32em] text-accent/70">Support My Work</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Buy me a coffee while I build the next thing.
              </h1>
              <p className="mt-6 max-w-2xl text-base/8 text-body">
                Choose a support tier and you will be redirected to secure Stripe Checkout.
              </p>

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

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/about"
                  onClick={(event) => handleNavigate(event, '/about')}
                  className="inline-flex rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent"
                >
                  Contact me instead
                </a>
                <a
                  href="#stripe-placeholder"
                  className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
                >
                  Continue to payment
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 bg-background/40 px-8 py-10 sm:px-10 sm:py-12 lg:border-t-0 lg:border-l">
              <div className="rounded-2xl border border-accent/20 bg-black/40 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent/70">Next Step</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Stripe checkout goes here</h2>
                <p className="mt-4 text-sm/7 text-body">
                  Select a tier below to create a Checkout Session on the backend and continue with Stripe.
                </p>
                <div id="stripe-placeholder" className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/3 p-5">
                  <p className="text-sm font-medium text-white">Secure payment via Stripe Checkout</p>
                  <p className="mt-2 text-sm/6 text-gray-400">
                    Your card details stay on Stripe. This page only requests a checkout session from your FastAPI backend.
                  </p>
                  <button
                    type="button"
                    onClick={() => startCheckout('espresso')}
                    disabled={isSubmittingTier !== null}
                    className="mt-5 inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] disabled:cursor-wait disabled:opacity-80"
                  >
                    {isSubmittingTier === 'espresso' ? 'Redirecting...' : 'Quick support checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-6 md:grid-cols-3">
            {supportTiers.map((tier) => (
              <article key={tier.amount} className="rounded-2xl border border-white/10 bg-card p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-accent/70">{tier.label}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{tier.amount}</p>
                <p className="mt-4 text-sm/7 text-body">{tier.description}</p>
                <button
                  type="button"
                  onClick={() => startCheckout(tier.id)}
                  disabled={isSubmittingTier !== null}
                  className="mt-6 inline-flex w-full justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-wait disabled:opacity-80"
                >
                  {isSubmittingTier === tier.id ? 'Redirecting...' : tier.cta}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
