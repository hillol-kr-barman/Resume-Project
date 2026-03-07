import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import profHeadshot from '../assets/prof_headshot.png'
import placeHolderImage from '../assets/placeholder_image.jpg'

const navigation = [
  { name: 'Featured', href: '#' },
  { name: 'Demo', href: '#' },
  { name: 'About Me', href: '#' },
]

const techStackLogos = [
  { name: 'Tailwind CSS', src: 'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  { name: 'React', src: 'https://cdn.simpleicons.org/react/ffffff' },
  { name: 'Node.js', src: 'https://cdn.simpleicons.org/nodedotjs/ffffff' },
  { name: 'FastAPI', src: 'https://cdn.simpleicons.org/fastapi/ffffff' },
  { name: 'PostgreSQL', src: 'https://cdn.simpleicons.org/postgresql/ffffff' },
  { name: 'Redis', src: 'https://cdn.simpleicons.org/redis/ffffff' },
  { name: 'Docker', src: 'https://cdn.simpleicons.org/docker/ffffff' },
]

export default function HomePage({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleComponentsTestClick = (event) => {
    event.preventDefault()
    onNavigate('/components-test')
  }

  const handleLoginClick = (event) => {
    event.preventDefault()
    setMobileMenuOpen(false)
    onNavigate('/login')
  }

  return (
    <div>
      {/* Sticky Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-accent/40 bg-background/75 shadow-black/20 backdrop-blur-md' : 'bg-transparent'
          }`}
      >
        {/* Desktop + Mobile Nav Bar */}
        <nav
          aria-label="Global"
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-8 ${isScrolled ? 'py-4' : 'py-6'
            }`}
        >
          {/* Brand / Logo */}
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Hillol Barman</span>
              <img
                alt="hillol's logo - dark"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
          </div>
          {/* Mobile Menu Button */}
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
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="group transition duration-300 text-sm/6 font-semibold text-white">
                {item.name}
                <span className="block h-0.5 w-full origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-accent"></span>
              </a>
            ))}
          </div>
          {/* Desktop Auth Link */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/login" onClick={handleLoginClick} className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        {/* Mobile Slide-out Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
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
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    onClick={handleLoginClick}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-24">
        {/* Hero Background Pattern */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-accent/25"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          {/* Hero Text Content */}
          <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">

            <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
              Hey! I'm Hillol!
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              I create responsive websites and critical web applications using industry standard system design.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                className="rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-black shadow-none hover:bg-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={handleComponentsTestClick}
              >
                Test Me
              </button>
            </div>
          </div>
          {/* Hero Visual / Screenshot */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-white/2.5 p-2 ring-1 ring-white/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  alt="App screenshot"
                  src={placeHolderImage}
                  width={2432}
                  height={1442}
                  className="w-full max-w-xl h-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Am I Section */}
      <div className="mt-32 overflow-hidden sm:mt-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-stretch">
            {/* Who Am I Copy */}
            <div className="lg:pb-2">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Whoami</h2>
              <p className="mt-6 text-base/7 text-gray-400">
                Engineer by training. Builder by habit. I design and develop scalable web applications and systems with a focus on clean architecture and thoughtful user experiences.
              </p>
              <p className="mt-6 text-base/7 text-gray-400">
                I enjoy breaking down complex problems, designing reliable system architectures, and turning ideas into practical products. With experience across the full development lifecycle, I focus on building solutions that are both technically solid and easy for people to use.
              </p>
              <p className="mt-6 text-base/7 text-gray-400">
                I hold a background in computer science and continue to explore better ways to build efficient, scalable systems.
              </p>
            </div>
            {/* Who Am I Image */}
            <div className="self-stretch">
              <img
                alt=""
                src={profHeadshot}
                className="h-full w-full rounded-2xl bg-gray-800 object-contain object-top"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 68%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse at center, black 68%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Clouds Section */}
      <div className="bg-background mt-40 mb-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg/8 font-semibold text-white">Most Used Tech Stacks</h2>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
            {techStackLogos.map((logo) => (
              <img
                key={logo.name}
                alt={logo.name}
                src={logo.src}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
