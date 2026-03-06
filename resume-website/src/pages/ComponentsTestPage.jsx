import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'

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

          
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-none hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
              Back to Home
            </button>
            

          
          
        </section>
      </div>
    </main>
  )
}
