import { useState } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import coffeeCup from '../assets/coffeeCup.svg'
import { techStackLogos, projects, featuredProjectIds } from './pageData/homePageData'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectsCard from '../components/ProjectsCard'
import BackgroundBeams from '../components/BackgroundBeams'

export default function HomePage({ onNavigate, currentUser, onLogout, currentPath = '/' }) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
    event.preventDefault()
    onNavigate(to)
  }

  const handleNewsletterSubmit = (event) => {
    event.preventDefault()

    const trimmedEmail = newsletterEmail.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      setNewsletterMessage('Chuck in a valid email and I will keep you posted.')
      return
    }

    setNewsletterMessage(`Too easy. ${trimmedEmail} is now on the list.`)
    setNewsletterEmail('')
  }

  const featuredProjects = featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean)

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-32">
        <BackgroundBeams className="-z-10" />
        <div className="mx-auto max-w-6xl px-5 pb-18 pt-10 sm:pb-22 lg:px-6 lg:pb-24 lg:pt-18">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="type-eyebrow">Lazymate for polished web builds</p>
            <h1 className="type-hero mt-5 max-w-3xl text-balance">
              Build proper digital gear.
              <span className="mt-3 block text-accent">Leave the chaos at the door.</span>
            </h1>
            <p className="type-body mt-6 max-w-2xl text-pretty">
              Lazymate is where I design and build sharp web apps without the usual carry-on. Clean systems, tidy UI, and practical engineering that gets the job sorted.
            </p>
            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/projects"
                onClick={(event) => handleNavigate(event, '/projects')}
                className="inline-flex items-center justify-center gap-x-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Browse Projects
                <ArrowRightIcon aria-hidden="true" className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Clouds Section */}

      <div className="mx-auto mt-24 max-w-6xl sm:mt-28 sm:px-5 lg:px-6">
        <div className="relative isolate overflow-hidden bg-card px-5 py-14 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-10 after:sm:rounded-3xl">
          <h4 className="type-section-title mx-auto max-w-2xl">
            Tech I Reach For Most
          </h4>
          <p className="type-body mx-auto mt-4 max-w-3xl">
            These are the tools I keep coming back to when a build needs to be fast, reliable, and easy to live with.
            I stay current, pinch the best ideas, and use the stack that makes the product feel right.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 opacity-60 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
            {techStackLogos.map((logo) => (
              <img
                key={logo.name}
                alt={logo.name}
                src={logo.src}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            ))}
          </div>
          <div className="type-eyebrow mt-14 items-center justify-center">This site runs on</div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
            <span className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">React</span>
            <span className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">Fast API</span>
            <span className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">Supabase</span>
            <span className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">Tailwind</span>
            <span className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">Stripe</span>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mx-auto mt-32 mb-24 max-w-6xl px-5 lg:px-6">
        <h2 className="type-section-title text-center">Featured Builds</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectsCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-5 gap-4">
          <div className="border-t mt-6 col-span-2 border-white/10"></div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={(event) => handleNavigate(event, '/projects')}>
            See the lot
            <ArrowRightIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </button>
          <div className="border-t mt-6 col-span-2 border-white/10"></div>
        </div>

      </div>

      {/* Newsletter Section */}
      <div className="mx-auto max-w-6xl px-5 py-6 lg:px-6">
        <section className="rounded-[28px] border border-white/10 bg-card/80 px-5 py-6 sm:px-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-center">
            <div className="flex justify-center lg:justify-start lg:border-r lg:border-white/10 lg:pr-8">
              <div className="max-w-2xl text-center lg:text-left">
              <p className="type-eyebrow">Newsletter</p>
              <h2 className="type-section-title mt-3">
                Want the latest builds without the fluff?
              </h2>
              <p className="type-body mt-3 max-w-xl">
                I send occasional short, practical, and no nonsense news. You stay lazy. I got ya.
              </p>
              </div>
            </div>

            <div className="flex justify-center">
              <form onSubmit={handleNewsletterSubmit} className="w-full max-w-sm text-center">
                <label htmlFor="newsletter-email" className="type-label block">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => {
                    setNewsletterEmail(event.target.value)
                    if (newsletterMessage) setNewsletterMessage('')
                  }}
                  placeholder="you@properemail.com"
                  className="mt-3 block w-full rounded-md border border-white/10 bg-background/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Subscribe
                </button>
                <p className="type-body mt-3 min-h-9 text-gray-400">
                  {newsletterMessage || 'Pop your email in and I will keep you in the loop.'}
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>


      {/* Buy me a Coffee Section */}
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16 lg:px-6">
        <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 px-5 py-6 sm:px-6 sm:py-6">
          <div className="grid items-center gap-5 lg:grid-cols-4">
            <div className="max-w-2xl col-span-3">
              <p className="type-eyebrow">Small shout, big thanks</p>
              <h2 className="type-section-title mt-3 max-w-xl text-balance">
                Enjoyed the work?
              </h2>
              <p className="type-body mt-3 max-w-xl">
                If you&apos;re keen to work together, sing out. If you just want to back the work, a coffee helps keep the late-night tinkering rolling.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href="/about"
                  onClick={(event) => handleNavigate(event, '/about')}
                  className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Contact Me
                </a>
                <a
                href="/coffee"
                onClick={(event) => handleNavigate(event, '/coffee')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  Shout me a coffee <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="coffee-cup-stage flex items-right justify-end">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-card sm:h-32 sm:w-32">
                <img
                  src={coffeeCup}
                  alt="Coffee cup illustration"
                  className="block h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
