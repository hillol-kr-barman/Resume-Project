import Editor from '@monaco-editor/react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'

export default function ComponentsTestPage({ onNavigate }) {
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
            Use this page to experiment with reusable UI components before adding them to your main pages.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
            <Editor
              height="70vh"
              theme="vs-dark"
              defaultLanguage="javascript"
              defaultValue="// edit here"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>
        </header>
      </div>
    </main>
  )
}
