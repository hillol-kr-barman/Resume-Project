import { ArrowRightIcon } from '@heroicons/react/24/solid'
import profHeadshot from '../assets/prof_headshot.png'
import placeHolderImage from '../assets/placeholder_image.jpg'
import coffeeCup from '../assets/coffeeCup.svg'
import { techStackLogos, projects, featuredProjectIds } from './pageData/homePageData'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function HomePage({ onNavigate, currentUser, onLogout, currentPath = '/' }) {
  const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
    event.preventDefault()
    onNavigate(to)
  }

  const featuredProjects = featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean)

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

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
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                className="rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

      <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-card px-6 py-24 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-16 after:sm:rounded-3xl">
          <h4 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Most Used Tech Stacks
          </h4>
          <p className="mx-auto mt-6 text-base/7 text-body">
            Throughout my coding journey, I have worked with various technologies and tools. I strongly
            believe that staying updated and learning best practices is essential for building solid expertise
            in modern industry-standard development environments.
          </p>
          <div className="mx-auto mt-18 opacity-60 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
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
      <div className="mx-auto mt-32 mb-32 max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl text-center font-semibold tracking-tight text-white sm:text-5xl">Featured Projects</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl bg-card p-6 outline -outline-offset-1 outline-white/10"
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
        <div className="grid grid-cols-5 mt-12">
          <div className="border-t mt-6 col-span-2 border-white/10"></div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={(event) => handleNavigate(event, '/projects')}>
            View All
            <ArrowRightIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </button>
          <div className="border-t mt-6 col-span-2 border-white/10"></div>
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
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

      <SiteFooter />
    </div>
  )
}
