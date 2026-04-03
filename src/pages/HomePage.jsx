import { ArrowRightIcon } from '@heroicons/react/24/solid'
import profHeadshot from '../assets/prof_headshot.png'
import placeHolderImage from '../assets/placeholder_image.jpg'
import coffeeCup from '../assets/coffeeCup.svg'
import { techStackLogos, projects, featuredProjectIds } from './pageData/homePageData'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectsCard from '../components/ProjectsCard'
import BackgroundBeams from '../components/BackgroundBeams'

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
      <div className="relative isolate overflow-hidden pt-20">
        <BackgroundBeams className="-z-10" />
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-18 sm:pb-22 lg:px-6 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
          {/* Hero Text Content */}
            <div className="mx-auto flex w-full max-w-lg flex-col justify-center lg:mx-0 lg:min-h-120">
              <p className="text-xs uppercase tracking-[0.28em] text-accent/70">Feeling Stack Overflowed?</p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                Hey!
              </h1>
              <h4 className="mt-2 text-xl font-semibold tracking-tight text-pretty text-white sm:text-2xl">
                I'm Hillol!
              </h4>
              <p className="mt-5 max-w-md text-sm font-medium text-pretty text-gray-400 sm:text-base/7">
                I create responsive websites and critical web applications using industry standard system design.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-x-4">
                <a
                  href="/HillolBarman_Resume.pdf"
                  download
                  className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Download CV
                </a>

                <button
                  type="button"
                  className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  onClick={(event) => handleNavigate(event, '/components-test')}
                >
                  Debug Button
                </button>
              </div>
            </div>
            {/* Hero Visual / Screenshot */}
            <div className="mx-auto flex w-full max-w-lg justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="w-full max-w-xl">
                <div className="rounded-xl bg-white/2.5 p-2 ring-1 ring-white/10 ring-inset lg:rounded-2xl lg:p-2.5">
                  <img
                    alt="App screenshot"
                    src={placeHolderImage}
                    width={2432}
                    height={1442}
                    className="h-auto w-full rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Am I Section */}
      <div className="mt-24 overflow-hidden sm:mt-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-6">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch">
            {/* Who Am I Content */}
            <div className="lg:pb-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Whoami</h2>
              <p className="mt-5 text-sm/7 text-body">
                Engineer by training. Builder by habit. I design and develop scalable web applications and systems with a focus on clean architecture and thoughtful user experiences.
              </p>
              <p className="mt-5 text-sm/7 text-body">
                I enjoy breaking down complex problems, designing reliable system architectures, and turning ideas into practical products. With experience across the full development lifecycle, I focus on building solutions that are both technically solid and easy for people to use.
              </p>
              <p className="mt-5 text-sm/7 text-body">
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

      <div className="mx-auto mt-24 max-w-6xl sm:mt-28 sm:px-5 lg:px-6">
        <div className="relative isolate overflow-hidden bg-card px-5 py-18 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-12 after:sm:rounded-3xl">
          <h4 className="mx-auto max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
            Most Used Tech Stacks
          </h4>
          <p className="mx-auto mt-5 max-w-3xl text-sm/7 text-body">
            Throughout my coding journey, I have worked with various technologies and tools. I strongly
            believe that staying updated and learning best practices is essential for building solid expertise
            in modern industry-standard development environments.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 opacity-60 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
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
      <div className="mx-auto mt-24 mb-24 max-w-6xl px-5 lg:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">Featured Projects</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectsCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-5">
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
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
              Liked what you saw? 
              <p className="mt-5 max-w-lg text-sm font-medium text-pretty text-gray-400 sm:text-base/7">
              Contact me to hire, or buy me a coffee!
              </p>
            </h2>
            <div className="mt-8 flex items-center gap-x-5">
              <a
                href="/about"
                onClick={(event) => handleNavigate(event, '/about')}
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Contact Me
              </a>
              <a
                href="/coffee"
                onClick={(event) => handleNavigate(event, '/coffee')}
                className="text-sm/6 font-semibold text-gray-300 hover:text-white"
              >
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
