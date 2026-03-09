import { useEffect, useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ComponentsTestPage from './pages/ComponentsTestPage'
import AllProjects from './pages/AllProjects'
import AboutMe from './pages/AboutMe'

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (to) => {
    const nextPath = normalizePath(to)
    if (nextPath === path) return
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const page = useMemo(() => {
    if (path === '/login' || path === '/register') {
      return <AuthPage mode={path === '/register' ? 'register' : 'login'} onNavigate={navigate} />
    }
    if (path === '/components-test') {
      return <ComponentsTestPage onNavigate={navigate} />
    }
    if (path === '/projects') {
      return <AllProjects onNavigate={navigate} />
    }
    if (path === '/about') {
      return <AboutMe onNavigate={navigate} />
    }
    return <HomePage onNavigate={navigate} />
  }, [path])

  return page
}
