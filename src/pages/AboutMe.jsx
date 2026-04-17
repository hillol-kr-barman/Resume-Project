import about400Webp from '../assets/about-400.webp'
import about800Webp from '../assets/about-800.webp'
import about1200Webp from '../assets/about-1200.webp'
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function AboutMe({ onNavigate, currentUser, onLogout, currentPath = '/about' }) {
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
    'Graduated with Distinction from the Master of Computer Science program at the University of Wollongong',
    'Served as Technical Head for technology events during Bachelor studies',
    'Regional Math Olympiad Champion',
  ]

  const timeline = [
    { period: '2006', event: 'Regional Math Olympiad Champion' },
    { period: 'Jun 2016 - Jul 2020', event: 'BSc in Computer Science and Engineering at IEM, Kolkata' },
    { period: 'Dec 2020 - Feb 2023', event: 'Freelance UI Designer and Developer at Drivers4Me' },
    { period: 'Jul 2023 - Jun 2025', event: 'MSc in Computer Science (Software Engineering), UOW - Distinction' },
  ]

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 lg:px-6">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-card/95 p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,22rem)] lg:items-center lg:gap-8">
            <div className="order-2 lg:order-1">
              <p className="type-eyebrow">Professional Profile</p>
              <h1 className="type-page-title mt-4">About Hillol Barman</h1>
              <div className="type-body mt-5 max-w-3xl space-y-3">
                <p>
                  I am a software engineer with a Master of Computer Science in Software Engineering from the University of Wollongong and experience building web applications across frontend, backend, and product design responsibilities.
                </p>
                <p>
                  My work focuses on responsive interfaces, reusable components, RESTful APIs, and maintainable application architecture. I aim to turn product requirements into reliable software that is clear for users and practical for teams to extend.
                </p>
                <p>
                  I am seeking opportunities where I can contribute strong engineering fundamentals, thoughtful problem solving, and a steady focus on quality delivery.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm/7 text-gray-300">
                <a
                  className="rounded-full border border-white/10 bg-background/40 px-4 py-2 transition-colors hover:border-accent/40 hover:text-accent"
                  href="mailto:hillolbarman@yahoo.com"
                >
                  hillolbarman@yahoo.com
                </a>
                <span className="rounded-full border border-white/10 bg-background/40 px-4 py-2">0481 440 299</span>
                <a
                  className="rounded-full border border-white/10 bg-background/40 px-4 py-2 transition-colors hover:border-accent/40 hover:text-accent"
                  href="https://github.com/hillol-kr-barman"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/hillol-kr-barman
                </a>
                <a
                  className="rounded-full border border-white/10 bg-background/40 px-4 py-2 transition-colors hover:border-accent/40 hover:text-accent"
                  href="https://www.linkedin.com/in/hillolbarman/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/hillolbarman
                </a>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="w-full max-w-xs border border-white/10 bg-background/40 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <img
                  src={about800Webp}
                  srcSet={`${about400Webp} 400w, ${about800Webp} 800w, ${about1200Webp} 1200w`}
                  sizes="(max-width: 768px) 90vw, 400px"
                  width="400"
                  height="500"
                  alt="Portrait of Hillol"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className='mt-8 grid w-full gap-3 rounded-3xl border border-white/10 bg-card/70 p-4 text-left sm:grid-cols-3 sm:p-5'>
          <div>
            <p className="type-eyebrow">Focus</p>
            <p className="type-body mt-2">Scalable web applications with clean architecture, accessible interfaces, and clear user flows.</p>
          </div>
          <div>
            <p className="type-eyebrow">Approach</p>
            <p className="type-body mt-2">Structured problem solving, practical engineering decisions, and close attention to product requirements.</p>
          </div>
          <div>
            <p className="type-eyebrow">Outcome</p>
            <p className="type-body mt-2">Reliable software that is responsive, maintainable, and ready for real users.</p>
          </div>
        </section>

        <section className="card-panel mt-8">
          <h2 className="type-card-title">Work</h2>
          <div className="mt-4 space-y-4">
            {employment.map((job) => (
              <article key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="type-card-title">{job.role}</h3>
                  <p className="text-sm/7 text-gray-400">{job.duration}</p>
                </div>
                <p className="mt-1 text-sm/7 font-medium text-accent">{job.company} • {job.location}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm/7 text-body">
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel mt-8">
          <h2 className="type-card-title">Education</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {education.map((item) => (
              <article key={item.institution} className="card-panel-tight">
                <h3 className="type-card-title">{item.degree}</h3>
                <p className="mt-1 text-sm/7 text-accent">{item.institution}</p>
                <p className="mt-2 text-sm/7 text-gray-400">{item.duration}</p>
                <p className="mt-2 text-sm/7 text-body">{item.notes}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel mt-8">
          <h2 className="type-card-title">Achievements</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm/7 text-body">
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card-panel mt-8">
          <h2 className="type-card-title">Timeline</h2>
          <div className="mt-4 space-y-3">
            {timeline.map((item) => (
              <div key={item.period} className="grid gap-2 border-l-2 border-accent/60 pl-4 md:grid-cols-[14rem_minmax(0,1fr)]">
                <p className="text-sm/7 font-semibold text-accent">{item.period}</p>
                <p className="text-sm/7 text-body">{item.event}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-panel mt-8">
          <h2 className="type-card-title">Download CV</h2>
          <p className="type-body mt-3">
            Download a PDF copy of my CV for a complete summary of my experience, education, and technical skills.
          </p>
          <a
            href="/HillolBarman_Resume.pdf"
            download
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
            Download CV
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
