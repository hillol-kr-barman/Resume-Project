import { useEffect, useMemo, useState } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import logo from '../assets/logo_green.svg'
import BackgroundBeams from '../components/BackgroundBeams'
import { loginUser, logoutUser, registerUser, requestPasswordReset, updatePassword } from '../lib/playgroundStore'

export default function AuthPage({
  mode = 'login',
  onNavigate,
  routeSearch = '',
  currentUser,
  onAuthChange,
  isPasswordRecoveryActive = false,
  onPasswordRecoveryConsumed = () => {},
}) {
  const isRegistered = mode === 'register'
  const isForgotPassword = mode === 'forgot-password'
  const isResetPassword = mode === 'reset-password'
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasCheckedRecovery, setHasCheckedRecovery] = useState(!isResetPassword)
  const recoveryHashPresent = window.location.hash.includes('type=recovery')
  const canResetPassword = isPasswordRecoveryActive || recoveryHashPresent || Boolean(currentUser)

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(routeSearch)
    return params.get('redirect') || '/playground'
  }, [routeSearch])

  const title = useMemo(() => {
    if (isRegistered) return 'Set up your account'
    if (isForgotPassword) return 'Reset your password'
    if (isResetPassword) return 'Choose a new password'
    return 'Welcome back, mate'
  }, [isForgotPassword, isRegistered, isResetPassword])

  const subtitle = useMemo(() => {
    if (isRegistered) return 'Sign up to keep your playground docs tucked away for later.'
    if (isForgotPassword) return 'Enter your email and I will send over a password reset link.'
    if (isResetPassword) return 'Set a fresh password for your account and jump back in.'
    return 'Log in to move your playground drafts into saved documents.'
  }, [isForgotPassword, isRegistered, isResetPassword])

  useEffect(() => {
    if (isResetPassword) return
    if (currentUser) {
      onNavigate(redirectPath)
    }
  }, [currentUser, isResetPassword, onNavigate, redirectPath])

  useEffect(() => {
    if (!isResetPassword) return

    if (canResetPassword) {
      setHasCheckedRecovery(true)
      setErrorMessage('')
      return
    }

    setHasCheckedRecovery(true)
    setErrorMessage('That reset link is invalid or has expired. Request a fresh password reset email.')
  }, [canResetPassword, isResetPassword])

  const handleRouteChange = (event, to) => {
    event.preventDefault()
    onNavigate(to)
  }

  const handleHeadBack = async (event) => {
    event.preventDefault()

    if (isResetPassword) {
      try {
        await logoutUser()
      } catch {
        // Ignore logout errors here and still move the user out of the recovery flow.
      }

      onPasswordRecoveryConsumed()
      onAuthChange(null)
      onNavigate('/login')
      return
    }

    onNavigate(redirectPath === '/playground' ? '/playground' : '/')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (isForgotPassword) {
        await requestPasswordReset(formState.email)
        setSuccessMessage('Password reset email sent. Check your inbox for the recovery link.')
        return
      }

      if (isResetPassword) {
        if (!canResetPassword) {
          throw new Error('That reset link is invalid or has expired. Request a fresh password reset email.')
        }

        if (formState.password !== formState.confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const user = await updatePassword(formState.password)
        onPasswordRecoveryConsumed()
        onAuthChange(user)
        onNavigate('/login')
        return
      }

      const user = isRegistered ? await registerUser(formState) : await loginUser(formState)
      onAuthChange(user)
      onNavigate(redirectPath)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center px-4 py-4 sm:px-5 lg:px-6">
      <BackgroundBeams className="-z-10" />

      <div className="grid grid-cols-3 items-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="justify-self-start px-1 py-1 sm:px-3.5">
          <button
            type="button"
            onClick={handleHeadBack}
            className="inline-flex items-center gap-x-2 rounded-md bg-accent/20 px-2.5 py-1.5 text-xs font-semibold text-accent shadow-none transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(158,255,31,0.45)]"
          >
            <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Head back
          </button>
        </div>

        <img alt="Hillol Barman - Logo" src={logo} className="justify-self-center h-10 w-auto" />
        <div aria-hidden="true" className="justify-self-end" />
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-xs">
        <h2 className="mt-3 text-center text-base/7 font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-2 text-center text-sm/7 font-medium tracking-tight text-white">{subtitle}</p>

        <div className="mt-4 bg-card px-4 py-4 shadow-none outline -outline-offset-1 outline-white/10 sm:rounded-lg sm:px-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistered ? (
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-white">
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

            {!isResetPassword ? (
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white">
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
            ) : null}

            {!isForgotPassword ? (
              <div>
              <label htmlFor="password" className="block text-xs font-medium text-white">
                Password
              </label>
              <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isSubmitting || (isResetPassword && !canResetPassword)}
                    autoComplete={isRegistered ? 'new-password' : 'current-password'}
                    value={formState.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                />
              </div>
              </div>
            ) : null}

            {isResetPassword ? (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-white">
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    disabled={isSubmitting || (isResetPassword && !canResetPassword)}
                    autoComplete="new-password"
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  />
                </div>
              </div>
            ) : null}

            {!isRegistered && !isForgotPassword && !isResetPassword ? (
              <div className="-mt-1 text-right">
                <a
                  href={`/forgot-password?redirect=${encodeURIComponent(redirectPath)}`}
                  onClick={(event) => handleRouteChange(event, `/forgot-password?redirect=${encodeURIComponent(redirectPath)}`)}
                  className="text-xs font-semibold text-accent hover:text-accent/80"
                >
                  Forgot password?
                </a>
              </div>
            ) : null}

            {errorMessage ? (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-white">
                {successMessage}
              </p>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={isSubmitting || (isResetPassword && hasCheckedRecovery && !canResetPassword)}
                className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm/6 font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : isRegistered
                    ? 'Create account'
                    : isForgotPassword
                      ? 'Send reset link'
                      : isResetPassword
                        ? 'Update password'
                        : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm/6 text-gray-400">
          {isForgotPassword || isResetPassword ? (
            <>
              {isResetPassword ? 'Need a fresh recovery link?' : 'Remembered it?'}{' '}
              <a
                href={isResetPassword ? `/forgot-password?redirect=${encodeURIComponent(redirectPath)}` : `/login?redirect=${encodeURIComponent(redirectPath)}`}
                onClick={(event) =>
                  handleRouteChange(
                    event,
                    isResetPassword ? `/forgot-password?redirect=${encodeURIComponent(redirectPath)}` : `/login?redirect=${encodeURIComponent(redirectPath)}`,
                  )
                }
                className="font-semibold text-accent hover:text-accent/80"
              >
                {isResetPassword ? 'Request password reset' : 'Back to sign in'}
              </a>
            </>
          ) : (
            <>
              {isRegistered ? 'Already sorted with an account?' : 'Need an account?'}{' '}
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
            </>
          )}
        </p>
      </div>
    </div>
  )
}
