import { useMemo } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import logo from '../assets/logo_green.svg'

export default function AuthPage({ mode = 'login', onNavigate }) {
  const isRegistered = mode === 'register'

  const title = useMemo(() => {
    if (isRegistered) return 'Create your account'
    return 'Welcome Back'
  }, [isRegistered])

  const subtitle = useMemo(() => {
    if (isRegistered) return 'Sign up to continue building your profile.'
    return 'Please log in to continue'
  }, [isRegistered])

  const handleRouteChange = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <>
      {/* Auth Page Layout */}
      <div className="relative flex min-h-screen flex-col justify-center px-4 py-4 sm:px-6 lg:px-8">
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full mask-[radial-gradient(90%_90%_at_center,white,transparent)] stroke-accent/25"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="auth-grid-pattern"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#auth-grid-pattern)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        {/* Top Bar: Back Button + Logo */}
        <div className="grid grid-cols-3 items-center sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back to Home */}
          <div className="justify-self-start px-1 py-1 sm:px-3.5">
            <button
              type="button"
              onClick={(event) => handleRouteChange(event, '/')}
              className="inline-flex items-center gap-x-2 rounded-md bg-accent/20 px-2.5 py-1.5 text-sm font-semibold text-accent shadow-none transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(158,255,31,0.45)]"
            >
              <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
              Back
            </button>
          </div>

          <img
            alt="Hillol Barman - Logo"
            src={logo}
            className="justify-self-center h-10 w-auto"
          />
          <div aria-hidden="true" className="justify-self-end" />
        </div>

        {/* Auth Card Wrapper */}
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Auth Heading */}
          <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-white">
            {title}
          </h2>

          {/* Auth Subheading */}
          <p className="mt-2 text-center text-sm/9 font-medium tracking-tight text-white">
            {subtitle}
          </p>

          {/* Auth Form Card */}
          <div className="bg-card px-5 mt-4 py-6 shadow-none outline -outline-offset-1 outline-white/10 sm:rounded-lg sm:px-8">
            {/* Email/Password Form */}
            <form action="#" method="POST" className="space-y-4">

              {/* Email Text Box*/}
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  />
                </div>
              </div>

              {/* Password Text Box*/}
              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  />
                </div>
              </div>

              {/* Remember Me Check Box*/}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-white/10 bg-white/5 checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:border-gray-700 disabled:bg-gray-800 disabled:checked:bg-gray-800 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="block text-sm/6 text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm/6">
                  <a
                    href="#"
                    className="font-semibold text-accent hover:text-accent/80"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={(event) => handleRouteChange(event, '/login')}
                  className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm/6 font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Sign in
                </button>
              </div>
            </form>

            {/* Social Login Options */}
            <div>
              {/* Social Divider */}
              <div className="mt-6 flex items-center gap-x-4">
                <div className="w-full flex-1 border-t border-white/10" />
                <p className="text-sm/6 font-medium text-nowrap text-white">Or continue with</p>
                <div className="w-full flex-1 border-t border-white/10" />
              </div>

              {/* Social Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-none inset-ring inset-ring-white/5 transition-shadow duration-300 hover:shadow-[0_0_16px_rgba(158,255,31,0.35)] focus-visible:inset-ring-transparent"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">Google</span>
                </a>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-none inset-ring inset-ring-white/5 transition-shadow duration-300 hover:shadow-[0_0_16px_rgba(158,255,31,0.35)] focus-visible:inset-ring-transparent"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="size-5 fill-white"
                  >
                    <path
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Register Redirect */}
          <p className="mt-6 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a
              href="#"
              onClick={(event) => handleRouteChange(event, '/register')}
              className="font-semibold text-accent hover:text-accent/80"
            >
              Register Now!
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
