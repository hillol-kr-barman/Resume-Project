import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import BackgroundBeams from '../components/BackgroundBeams'
import HomePageCard from '../components/HomePageCard'
import { projects, featuredProjectIds } from '../pages/pageData/homePageData'


export default function ComponentsTestPage({ onNavigate }) {
  const featuredProjects = featuredProjectIds
  .map((id) => projects.find((project) => project.id === id))
  .filter(Boolean)


  return (
    <main className="min-h-screen bg-gray-900 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          <ArrowLongLeftIcon className="size-5" />
          Back to Home
        </button>

        <header>
          <h1 className="text-3xl font-bold">Components Test Page</h1>
          <p className="mt-2 text-sm text-gray-300">
            this page is used to test new components before adding to the website 
          </p>

          <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-card">
            <BackgroundBeams />
            <div className="relative px-6 py-12 sm:px-10">
              <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Background Test</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white">
                Beams background preview using the site accent palette.
              </h2>
              <p className="mt-4 max-w-2xl text-base/7 text-body">
                This replaces the particles experiment and the old grid rectangle pattern with a single shared
                background system.
              </p>
            </div>
          </section>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <HomePageCard key={project.id} project={project} />
            ))}
          </div>

        </header>
      </div>
    </main>
  )
}
