import { useMemo } from 'react'

export default function AuthPage({ mode = 'login', onNavigate }) {
  const isRegister = mode === 'register'

  const title = useMemo(() => {
    if (isRegister) return 'Create your account'
    return 'Welcome back'
  }, [isRegister])

  const subtitle = useMemo(() => {
    if (isRegister) return 'Sign up to continue building your profile.'
    return 'Log in to continue to your dashboard.'
  }, [isRegister])

  const handleRouteChange = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white"
        >
          ← Back to home
        </button>

        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Account access</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-4 text-sm text-slate-300">{subtitle}</p>

            <div className="mt-8 inline-flex rounded-lg border border-white/10 bg-slate-950 p-1">
              <a
                href="/login"
                onClick={(event) => handleRouteChange(event, '/login')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  !isRegister ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Login
              </a>
              <a
                href="/register"
                onClick={(event) => handleRouteChange(event, '/register')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  isRegister ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Register
              </a>
            </div>
          </section>

          <section className="p-8 sm:p-10">
            <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-slate-950/70 p-6">
              <p className="text-sm font-semibold text-cyan-300">Paste your Tailwind UI block here</p>
              <p className="mt-3 text-sm text-slate-400">
                Replace this section with the login/register component you copy from Tailwind UI.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
