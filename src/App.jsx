import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ComponentsTestPage from './pages/ComponentsTestPage'
import AllProjects from './pages/AllProjects'
import AboutMe from './pages/AboutMe'
import Playground from './pages/Playground'
import BuyMeCoffee from './pages/BuyMeCoffee'
import Preloader from './components/Preloader'
import UnderConstruction from './pages/UnderConstruction'
import NotFound from './pages/NotFound'
import { getCurrentUser, logoutUser } from './lib/playgroundStore'
import { supabase } from './lib/supabaseClient'

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

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
  const isPreloaderEnabled = true
  const [isPageVisible, setIsPageVisible] = useState(false)
  const [route, setRoute] = useState(() => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  }))
  const [currentUser, setCurrentUser] = useState(null)
  const shouldRunPreloader = isPreloaderEnabled && !isSiteUnderConstruction
  const [isPreloading, setIsPreloading] = useState(shouldRunPreloader)

  useEffect(() => {
    let isMounted = true

    const syncCurrentUser = async () => {
      try {
        const user = await getCurrentUser()
        if (isMounted) setCurrentUser(user)
      } catch {
        if (isMounted) setCurrentUser(null)
      }
    }

    syncCurrentUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentUser(mapSessionUser(session?.user ?? null))
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
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
    if (!shouldRunPreloader) {
      setIsPreloading(false)
      return
    }
    setIsPreloading(true)
  }, [shouldRunPreloader])

  useEffect(() => {
    if (isPreloading) return

    const timer = window.setTimeout(() => {
      setIsPageVisible(true)
    }, 40)

    return () => window.clearTimeout(timer)
  }, [isPreloading])

  useEffect(() => {
    if (isPreloading) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [isPreloading, route.path, route.search])

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
    await logoutUser()
    setCurrentUser(null)
  }

  let page = null

  if (isSiteUnderConstruction) {
    page = <UnderConstruction />
  } else if (route.path === '/login' || route.path === '/register') {
    page = (
      <AuthPage
        mode={route.path === '/register' ? 'register' : 'login'}
        onNavigate={navigate}
        routeSearch={route.search}
        currentUser={currentUser}
        onAuthChange={handleAuthChange}
      />
    )
  } else if (route.path === '/components-test') {
    page = <ComponentsTestPage onNavigate={navigate} />
  } else if (route.path === '/projects') {
    page = <AllProjects onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  } else if (route.path === '/playground') {
    page = (
      <Playground
        onNavigate={navigate}
        routeSearch={route.search}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    )
  } else if (route.path === '/about') {
    page = <AboutMe onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  } else if (route.path === '/coffee') {
    page = <BuyMeCoffee onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  } else if (route.path === '/') {
    page = <HomePage onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  } else {
    page = <NotFound onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  }

  if (isPreloading) {
    return <Preloader onComplete={() => setIsPreloading(false)} />
  }

  return (
    <div className={`app-shell${isPageVisible ? ' app-shell--visible' : ''}`}>
      {page}
    </div>
  )
}
