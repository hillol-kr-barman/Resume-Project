import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo_green.svg'
import aboutMeImage from '../assets/aboutMeImage.png'
import { navigation, socials } from './pageData/homePageData'

export default function AboutMe({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const employment = [
    {
      company: 'Drivers4Me',
      role: 'Freelance UI Designer and Developer',
      location: 'Kolkata, India',
      duration: 'Dec 2020 - Feb 2023',
      highlights: [
        'Developed RESTful APIs using Flask for frontend applications to consume.',
        'Created several pages and reusable components with Next.js and React.',
        'Built a dynamic trip fare estimate service using a rule-based system and geohash, contributing to roughly 60% of the company marketing impact.',
        'Created wireframes, mockups, and graphical assets for Android, iOS, and web platforms.',
      ],
    },
  ]

  const education = [
    {
      institution: 'University of Wollongong, NSW',
      degree: 'MSc in Computer Science (Software Engineering)',
      duration: 'Jul 2023 - Jun 2025',
      notes: 'Graduated with Distinction',
    },
    {
      institution: 'Institute of Engineering and Management (IEM), Kolkata, India',
      degree: 'BSc in Computer Science and Engineering',
      duration: 'Jun 2016 - Jul 2020',
      notes: 'GPA: 3.50/4.0',
    },
  ]

  const achievements = [
    'Microsoft Technology Associate in Java',
    'Served as Technical Head in tech events during Bachelor studies',
    'Regional Math Olympiad Champion (2006)',
    'Intermediate football and badminton player',
  ]

  const timeline = [
    { period: '2006', event: 'Regional Math Olympiad Champion' },
    { period: 'Jun 2016 - Jul 2020', event: 'BSc in Computer Science and Engineering at IEM, Kolkata' },
    { period: 'Dec 2020 - Feb 2023', event: 'Freelance UI Designer and Developer at Drivers4Me' },
    { period: 'Jul 2023 - Jun 2025', event: 'MSc in Computer Science (Software Engineering), UOW - Distinction' },
  ]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
    event.preventDefault()
    if (closeMobileMenu) setMobileMenuOpen(false)
    if (onNavigate) onNavigate(to)
  }

  return (
    <div>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-accent/40 bg-background/75 shadow-black/20 backdrop-blur-md' : 'bg-transparent'
          }`}
      >
        <nav
          aria-label="Global"
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-8 ${isScrolled ? 'py-4' : 'py-6'
            }`}
        >
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
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="group transition duration-300 text-sm/6 font-semibold text-white">
                {item.name}
                <span className="block h-0.5 w-full origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-accent"></span>
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/login" onClick={(event) => handleNavigate(event, '/login', { closeMobileMenu: true })} className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>

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

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-8">
        <section className="rounded-2xl border border-white/10 bg-card p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">About Me</h1>
              <h2 className="mt-8 text-2xl font-semibold text-white">Short Intro</h2>
              <p className="mt-4 max-w-4xl text-base/7 text-body">
                A fast-learning, tech-enthusiastic full-stack engineer focused on building optimized, scalable systems and delivering meaningful contributions to modern development teams.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
                <a className="hover:text-accent" href="mailto:hillolbarman@yahoo.com">hillolbarman@yahoo.com</a>
                <span className="text-white/30">|</span>
                <span>0481 440 299</span>
                <span className="text-white/30">|</span>
                <a className="hover:text-accent" href="https://github.com/hillol-kr-barman" target="_blank" rel="noreferrer">github.com/hillol-kr-barman</a>
              </div>
            </div>
            <img
              src={aboutMeImage}
              alt="Hillol Barman portrait"
              className="mx-auto w-full max-w-xs rounded-2xl border border-white/10 object-cover"
            />
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-semibold text-white">Employment</h2>
          <div className="mt-6 space-y-6">
            {employment.map((job) => (
              <article key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{job.role}</h3>
                  <p className="text-sm text-gray-400">{job.duration}</p>
                </div>
                <p className="mt-1 text-sm font-medium text-accent">{job.company} • {job.location}</p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base/7 text-body">
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-semibold text-white">Education</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {education.map((item) => (
              <article key={item.institution} className="rounded-xl border border-white/10 bg-background/40 p-5">
                <h3 className="text-lg font-semibold text-white">{item.degree}</h3>
                <p className="mt-1 text-sm text-accent">{item.institution}</p>
                <p className="mt-2 text-sm text-gray-400">{item.duration}</p>
                <p className="mt-2 text-sm text-body">{item.notes}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-semibold text-white">Achievements</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6 text-base/7 text-body">
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-semibold text-white">Timeline</h2>
          <div className="mt-6 space-y-4">
            {timeline.map((item) => (
              <div key={item.period} className="grid gap-2 border-l-2 border-accent/60 pl-5 md:grid-cols-[14rem_minmax(0,1fr)]">
                <p className="text-sm font-semibold text-accent">{item.period}</p>
                <p className="text-base/7 text-body">{item.event}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-semibold text-white">Download CV</h2>
          <p className="mt-3 text-base/7 text-body">
            Download a PDF copy of my complete curriculum vitae.
          </p>
          <a
            href="/HillolBarman_Resume.pdf"
            download
            className="mt-6 inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Download CV
          </a>
        </section>
      </main>

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
