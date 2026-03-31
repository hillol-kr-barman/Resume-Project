import { useEffect, useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ComponentsTestPage from './pages/ComponentsTestPage'
import AllProjects from './pages/AllProjects'
import AboutMe from './pages/AboutMe'
import Playground from './pages/Playground'
import Preloader from './components/Preloader'
import { getCurrentUser, logoutUser } from './lib/playgroundStore'

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true)
  const [isPageVisible, setIsPageVisible] = useState(false)
  const [route, setRoute] = useState(() => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  }))
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())

  useEffect(() => {
    const handlePopState = () => {
      setRoute({
        path: normalizePath(window.location.pathname),
        search: window.location.search,
      })
      setCurrentUser(getCurrentUser())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (isPreloading) return

    const timer = window.setTimeout(() => {
      setIsPageVisible(true)
    }, 40)

    return () => window.clearTimeout(timer)
  }, [isPreloading])

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

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
  }

  const page = useMemo(() => {
    if (route.path === '/login' || route.path === '/register') {
      return (
        <AuthPage
          mode={route.path === '/register' ? 'register' : 'login'}
          onNavigate={navigate}
          routeSearch={route.search}
          currentUser={currentUser}
          onAuthChange={handleAuthChange}
        />
      )
    }
    if (route.path === '/components-test') {
      return <ComponentsTestPage onNavigate={navigate} />
    }
    if (route.path === '/projects') {
      return <AllProjects onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
    }
    if (route.path === '/playground') {
      return (
        <Playground
          onNavigate={navigate}
          routeSearch={route.search}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )
    }
    if (route.path === '/about') {
      return <AboutMe onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
    }
    return <HomePage onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  }, [currentUser, route])

  if (isPreloading) {
    return <Preloader onComplete={() => setIsPreloading(false)} />
  }

  return <div className={`app-shell${isPageVisible ? ' app-shell--visible' : ''}`}>{page}</div>
}
