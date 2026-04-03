import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import BackgroundBeams from '../components/BackgroundBeams'

export default function NotFound({ onNavigate, currentUser, onLogout, currentPath = '' }) {
  const handleNavigate = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="relative isolate overflow-hidden">
        <BackgroundBeams className="-z-10" />
        <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center px-5 py-24 lg:px-6">
          <div className="w-full rounded-3xl border border-white/10 bg-card/80 p-8 text-center backdrop-blur sm:p-12">
            <p className="text-xs uppercase tracking-[0.28em] text-accent/70">Error 404</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Page not found</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm/7 text-body sm:text-base/7">
              The page you are looking for does not exist, may have moved, or is taking a smoko. Let&apos;s get you back somewhere useful.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/"
                onClick={(event) => handleNavigate(event, '/')}
                className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back Home
              </a>
              <a
                href="/projects"
                onClick={(event) => handleNavigate(event, '/projects')}
                className="inline-flex rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-accent/50 hover:text-accent"
              >
                View Projects
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
