import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import profHeadshot from '../assets/prof_headshot.png'
import placeHolderImage from '../assets/placeholder_image.jpg'
import logo from '../assets/logo_green.svg'
import coffeeCup from '../assets/coffeeCup.svg'

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

const featuredProjects = [
  {
    title: 'Example 1',
    content: 'Demo content of the project goes here. Lorem ipsum dolor init sel.',
    imageSrc: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    gitLink: 'https://github.com/hillol-kr-barman/Resume-Project/'
  },
  {
    title: 'Example 2',
    content: 'Demo content of the project goes here. Lorem ipsum dolor init sel.',
    imageSrc: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    gitLink: 'https://github.com/hillol-kr-barman/Resume-Project/'
  },
  {
    title: 'Example 3',
    content: 'Demo content of the project goes here. Lorem ipsum dolor init sel.',
    imageSrc: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    gitLink: 'https://github.com/hillol-kr-barman/Resume-Project/'
  }
]

const socials = [
    {
      name: 'Facebook',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
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

  const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
    event.preventDefault()
    if (closeMobileMenu) setMobileMenuOpen(false)
    onNavigate(to)
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
            <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
              <span className="sr-only">Hillol Barman</span>
              <img
                alt="Hillol Barman - Logo"
                src={logo}
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
            <a href="/login" onClick={(event) => handleNavigate(event, '/login', { closeMobileMenu: true })} className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        {/* Mobile Slide-out Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src={logo}
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
                    onClick={(event) => handleNavigate(event, '/login', { closeMobileMenu: true })}
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
                onClick={(event) => handleNavigate(event, '/components-test')}
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
            {/* Who Am I Content */}
            <div className="lg:pb-2">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Whoami</h2>
              <p className="mt-6 text-base/7 text-body">
                Engineer by training. Builder by habit. I design and develop scalable web applications and systems with a focus on clean architecture and thoughtful user experiences.
              </p>
              <p className="mt-6 text-base/7 text-body">
                I enjoy breaking down complex problems, designing reliable system architectures, and turning ideas into practical products. With experience across the full development lifecycle, I focus on building solutions that are both technically solid and easy for people to use.
              </p>
              <p className="mt-6 text-base/7 text-body">
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
          <h4 className="text-center text-lg/8 font-semibold text-white">Most Used Tech Stacks</h4>
          <p className="mt-6 text-center text-base/7 text-body">
            Throughout my coding journey, I have worked with various technologies and tools. I strongly
            believe that staying updated and learning best practices is essential for building solid expertise
            in modern industry-standard development environments.
          </p>
          <div className="mx-auto mt-10 opacity-60 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
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

      {/* Featured Projects */}
      <div className="mx-auto mt-24 mb-32 max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl text-center font-semibold tracking-tight text-white sm:text-5xl">Featured Projects</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl bg-white/5 p-6 outline -outline-offset-1 outline-white/10"
            >
              <h4 className="text-center text-2xl font-semibold text-white">{item.title}</h4>
              <p className="mt-4 text-center text-base/7 text-body">{item.content}</p>
              <img
                src={item.imageSrc}
                alt={`${item.title} thumbnail`}
                className="mt-6 h-44 w-full rounded-xl object-cover"
              />
              <a
                href={item.gitLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
              >
                <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
                View on GitHub
              </a>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-3">
          <div class="border-t mt-12 border-white/10"></div>
          <button
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          onClick={(event) => handleNavigate(event, '/projects')}>
          View All
          </button>
        </div>
        
      </div>


      {/* Buy me a Coffee Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Liked what you saw? Contact me to hire, or buy me a coffee!
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact Me
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-300 hover:text-white">
                Get me a coffee <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          {/* Coffee Cup Image */}
          <div className="coffee-cup-stage hidden items-center justify-center lg:flex">
            <img
              src={coffeeCup}
              alt="Coffee cup illustration"
              className="block h-40 w-40 object-contain xl:h-48 xl:w-48"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}

      <footer>
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-white">
                {item.name}
              </a>
            ))}
          </nav>
          <div className="mt-16 flex justify-center gap-x-10">
            {socials.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-white">
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="size-6" />
              </a>
            ))}
          </div>
          <p className="mt-10 text-center text-sm/6 text-gray-400">&copy; {new Date().getFullYear()} Hillol Barman Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
