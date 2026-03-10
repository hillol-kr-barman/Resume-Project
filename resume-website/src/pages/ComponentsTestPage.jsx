import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { projects } from './pageData/homePageData'

export default function ComponentsTestPage({ onNavigate }) {
  return (
    <main className="min-h-screen bg-gray-900 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="w-fit rounded-md border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          ← Back to Home
        </button>

        <header>
          <h1 className="text-3xl font-bold">Components Test Page</h1>
          <p className="mt-2 text-sm text-gray-300">
            Use this page to experiment with UI components before adding them to your main pages.
          </p>
        </header>

        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="text-lg font-semibold">Starter Area</h2>


          <div className="mt-12 grid grid-cols-1 gap-6">
            {projects.map((item) => (
              <article
                key={item.id}
                className="grid h-full grid-cols-2 items-center rounded-2xl bg-card p-6 outline -outline-offset-1 outline-white/10"
              >
                <div>

                  <h2 className="text-left text-2xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-4 text-left text-base/7 text-body">{item.content}</p>
                  <p className="mt-4 text-left text-base/7 text-body">
                    <span className="font-bold"> Techstack: </span><span className="italic">{item.projectTechstack}</span>
                  </p>  
                  <a
                    href={item.gitLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
                  >
                    <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
                    View on GitHub
                  </a>
                </div>
                <div className="flex items-center">
                <img
                    src={item.imageSrc}
                    alt={`${item.title} thumbnail`}
                    className="h-44 w-full rounded-xl object-cover"
                  />
                </div>
              </article>
            ))}
          </div>




        </section>
      </div>
    </main>
  )
}
