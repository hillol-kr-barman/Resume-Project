import { useEffect, useMemo, useState } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import logo from '../assets/logo_green.svg'
import BackgroundBeams from '../components/BackgroundBeams'
import { loginUser, registerUser } from '../lib/playgroundStore'

export default function AuthPage({ mode = 'login', onNavigate, routeSearch = '', currentUser, onAuthChange }) {
  const isRegistered = mode === 'register'
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(routeSearch)
    return params.get('redirect') || '/playground'
  }, [routeSearch])

  const title = useMemo(() => {
    if (isRegistered) return 'Create your account'
    return 'Welcome back'
  }, [isRegistered])

  const subtitle = useMemo(() => {
    if (isRegistered) return 'Register to keep playground documents permanently.'
    return 'Log in to move playground drafts into your saved documents.'
  }, [isRegistered])

  useEffect(() => {
    if (currentUser) {
      onNavigate(redirectPath)
    }
  }, [currentUser, onNavigate, redirectPath])

  const handleRouteChange = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const user = isRegistered ? await registerUser(formState) : loginUser(formState)
      onAuthChange(user)
      onNavigate(redirectPath)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center px-4 py-4 sm:px-6 lg:px-8">
      <BackgroundBeams className="-z-10" />

      <div className="grid grid-cols-3 items-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="justify-self-start px-1 py-1 sm:px-3.5">
          <button
            type="button"
            onClick={(event) => handleRouteChange(event, redirectPath === '/playground' ? '/playground' : '/')}
            className="inline-flex items-center gap-x-2 rounded-md bg-accent/20 px-2.5 py-1.5 text-sm font-semibold text-accent shadow-none transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(158,255,31,0.45)]"
          >
            <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Back
          </button>
        </div>

        <img alt="Hillol Barman - Logo" src={logo} className="justify-self-center h-10 w-auto" />
        <div aria-hidden="true" className="justify-self-end" />
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-2 text-center text-sm/7 font-medium tracking-tight text-white">{subtitle}</p>

        <div className="mt-4 bg-card px-5 py-6 shadow-none outline -outline-offset-1 outline-white/10 sm:rounded-lg sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistered ? (
              <div>
                <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formState.name}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  />
                </div>
              </div>
            ) : null}

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
                    disabled={isSubmitting}
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  />
              </div>
            </div>

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
                    disabled={isSubmitting}
                    autoComplete={isRegistered ? 'new-password' : 'current-password'}
                    value={formState.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                />
              </div>
            </div>

            {errorMessage ? (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm/6 font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {isSubmitting ? 'Submitting...' : isRegistered ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm/6 text-gray-400">
          {isRegistered ? 'Already have an account?' : 'Need an account?'}{' '}
          <a
            href={isRegistered ? `/login?redirect=${encodeURIComponent(redirectPath)}` : `/register?redirect=${encodeURIComponent(redirectPath)}`}
            onClick={(event) =>
              handleRouteChange(
                event,
                `${isRegistered ? '/login' : '/register'}?redirect=${encodeURIComponent(redirectPath)}`,
              )
            }
            className="font-semibold text-accent hover:text-accent/80"
          >
            {isRegistered ? 'Sign in' : 'Register now'}
          </a>
        </p>
      </div>
    </div>
  )
}
