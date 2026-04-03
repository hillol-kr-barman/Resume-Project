import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo_green.svg'
import { navigation } from '../pages/pageData/homePageData'
import AlertDialogBox from './AlertDialogBox'

export default function SiteHeader({ onNavigate, currentUser, onLogout, currentPath = '/' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
    event.preventDefault()
    if (closeMobileMenu) setMobileMenuOpen(false)
    onNavigate(to)
  }

  const firstName = useMemo(() => {
    const fullName = currentUser?.name ?? ''
    return fullName.trim().split(/\s+/)[0] || ''
  }, [currentUser])

  const loginPath = `/login?redirect=${encodeURIComponent(currentPath)}`

  const openLogoutDialog = () => {
    setMobileMenuOpen(false)
    setLogoutDialogOpen(true)
  }

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false)
  }

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false)
    onLogout()
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-accent/40 bg-background/75 shadow-black/20 backdrop-blur-md' : 'bg-transparent'}`}
    >
      <nav
        aria-label="Global"
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-[padding] duration-300 lg:px-6 ${isScrolled ? 'py-3' : 'py-4'}`}
      >
        <div className="flex lg:flex-1">
          <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
            <span className="sr-only">Hillol Barman</span>
            <img alt="Hillol Barman - Logo" src={logo} className="h-8 w-auto" />
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-9">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavigate(event, item.href)}
              aria-current={currentPath === item.href ? 'page' : undefined}
              className={`group text-sm/6 font-medium transition duration-300 ${currentPath === item.href ? 'text-accent' : 'text-white'}`}
            >
              {item.name}
              <span
                className={`block h-0.5 w-full origin-center bg-accent transition-transform duration-500 ${currentPath === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {currentUser ? (
            <div className="flex items-center gap-5">

              <div className="flex items-center">
                <div>
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent outline -outline-offset-1 outline-white/10">
                    <span className="text-xs font-medium text-card">{firstName.slice(0, 1)}</span>
                  </span>
                </div>
                <div className="ml-3">
                  <a href="#" className="group block shrink-0">
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white">{firstName}</p>
                  </a>
                  <button type="button" onClick={openLogoutDialog} className="text-sm/6 font-semibold text-white">
                    Log out <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <a
              href={loginPath}
              onClick={(event) => handleNavigate(event, loginPath, { closeMobileMenu: true })}
              className="text-sm/6 font-semibold text-white"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
              <span className="sr-only">Hillol Barman</span>
              <img alt="Hillol Barman - Logo" src={logo} className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(event) => handleNavigate(event, item.href, { closeMobileMenu: true })}
                    aria-current={currentPath === item.href ? 'page' : undefined}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${currentPath === item.href ? 'bg-accent/10 text-accent' : 'text-white hover:bg-white/5'}`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={openLogoutDialog}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Log out
                  </button>
                ) : (
                  <a
                    href={loginPath}
                    onClick={(event) => handleNavigate(event, loginPath, { closeMobileMenu: true })}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Log in
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      <AlertDialogBox
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        onConfirm={handleConfirmLogout}
        title="Log out?"
        description="Your current session will end on this device. You can sign back in at any time."
        confirmLabel="Log out"
        cancelLabel="Cancel"
      />
    </header>
  )
}
