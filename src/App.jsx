import { lazy, Suspense, useEffect, useState } from 'react'
import HomePage from './pages/HomePage'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const ComponentsTestPage = lazy(() => import('./pages/ComponentsTestPage'))
const AllProjects = lazy(() => import('./pages/AllProjects'))
const AboutMe = lazy(() => import('./pages/AboutMe'))
const Playground = lazy(() => import('./pages/Playground'))
const BuyMeCoffee = lazy(() => import('./pages/BuyMeCoffee'))
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'))
const NotFound = lazy(() => import('./pages/NotFound'))

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

const PASSWORD_RECOVERY_FLAG = 'resume-password-recovery'

function mapSessionUser(user) {
  if (!user) return null

  const fullName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Mate'

  return {
    id: user.id,
    name: fullName,
    email: user.email ?? '',
  }
}

export default function App() {
  const isSiteUnderConstruction = false
  const [route, setRoute] = useState(() => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  }))
  const [currentUser, setCurrentUser] = useState(null)
  const [isPasswordRecoveryActive, setIsPasswordRecoveryActive] = useState(() => {
    return window.sessionStorage.getItem(PASSWORD_RECOVERY_FLAG) === 'true'
  })

  useEffect(() => {
    let isMounted = true
    let unsubscribe = () => {}
    let idleHandle = null

    const bootstrapAuth = async () => {
      try {
        const [{ getCurrentUser }, { supabase }] = await Promise.all([
          import('./lib/playgroundStore'),
          import('./lib/supabaseClient'),
        ])

        const user = await getCurrentUser()
        if (!isMounted) return

        setCurrentUser(user)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (isMounted) {
            setCurrentUser(mapSessionUser(session?.user ?? null))
            const isRecovery = event === 'PASSWORD_RECOVERY'

            if (isRecovery) {
              window.sessionStorage.setItem(PASSWORD_RECOVERY_FLAG, 'true')
            }

            if (event === 'SIGNED_OUT') {
              window.sessionStorage.removeItem(PASSWORD_RECOVERY_FLAG)
            }

            setIsPasswordRecoveryActive(isRecovery || window.sessionStorage.getItem(PASSWORD_RECOVERY_FLAG) === 'true')
          }
        })

        unsubscribe = () => subscription.unsubscribe()
      } catch {
        if (isMounted) setCurrentUser(null)
      }
    }

    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(() => {
        bootstrapAuth()
      })
    } else {
      idleHandle = window.setTimeout(() => {
        bootstrapAuth()
      }, 1)
    }

    return () => {
      isMounted = false
      if (typeof idleHandle === 'number') {
        window.clearTimeout(idleHandle)
      } else if (idleHandle !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle)
      }
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setRoute({
        path: normalizePath(window.location.pathname),
        search: window.location.search,
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    if (!isSiteUnderConstruction || route.path === '/') return

    window.history.replaceState({}, '', '/')
    setRoute({
      path: '/',
      search: '',
    })
  }, [isSiteUnderConstruction, route.path])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [route.path, route.search])

  const navigate = (to) => {
    const nextUrl = new URL(to, window.location.origin)
    const nextPath = normalizePath(nextUrl.pathname)
    const nextSearch = nextUrl.search

    if (nextPath === route.path && nextSearch === route.search) return

    window.history.pushState({}, '', `${nextPath}${nextSearch}`)
    setRoute({ path: nextPath, search: nextSearch })
  }

  const handleAuthChange = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = async () => {
    const { logoutUser } = await import('./lib/playgroundStore')
    await logoutUser()
    setCurrentUser(null)
  }

  const renderLazyPage = (node) => (
    <Suspense fallback={null}>
      {node}
    </Suspense>
  )

  let page = null

  if (isSiteUnderConstruction) {
    page = renderLazyPage(<UnderConstruction />)
  } else if (
    route.path === '/login' ||
    route.path === '/register' ||
    route.path === '/forgot-password' ||
    route.path === '/reset-password'
  ) {
    page = renderLazyPage(
      <AuthPage
        mode={
          route.path === '/register'
            ? 'register'
            : route.path === '/forgot-password'
              ? 'forgot-password'
              : route.path === '/reset-password'
                ? 'reset-password'
                : 'login'
        }
        onNavigate={navigate}
        routeSearch={route.search}
        currentUser={currentUser}
        onAuthChange={handleAuthChange}
        isPasswordRecoveryActive={isPasswordRecoveryActive}
        onPasswordRecoveryConsumed={() => {
          window.sessionStorage.removeItem(PASSWORD_RECOVERY_FLAG)
          setIsPasswordRecoveryActive(false)
        }}
      />
    )
  } else if (route.path === '/components-test') {
    page = renderLazyPage(<ComponentsTestPage onNavigate={navigate} />)
  } else if (route.path === '/projects') {
    page = renderLazyPage(
      <AllProjects onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  } else if (route.path === '/playground') {
    page = renderLazyPage(
      <Playground
        onNavigate={navigate}
        routeSearch={route.search}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    )
  } else if (route.path === '/about') {
    page = renderLazyPage(
      <AboutMe onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  } else if (route.path === '/coffee') {
    page = renderLazyPage(
      <BuyMeCoffee onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  } else if (route.path === '/') {
    page = <HomePage onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  } else {
    page = renderLazyPage(
      <NotFound onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  }

  return page
}
