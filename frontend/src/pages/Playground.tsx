import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/solid'
import type { AuthUser } from '@hillolbarman/ui'
import { AlertDialogBox, ConfirmationMessage, ShareDocumentModal } from '@hillolbarman/ui'
import {
  deleteAllDocumentsForUser,
  deleteDocument,
  getDocumentByShareToken,
  listDocumentsForUser,
  saveDocument,
  type PlaygroundDocument,
} from '../lib/playgroundStore'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

const Editor = lazy(() => import('@monaco-editor/react'))

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
]

const starterSnippets: Record<string, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}.\`
}

console.log(greet('developer'))
`,
  typescript: `function greet(name: string): string {
  return \`Hello, \${name}.\`
}

console.log(greet('developer'))
`,
  python: `def greet(name):
    return f"Hello, {name}."


print(greet("developer"))
`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <h1>Hello, developer.</h1>
  </body>
</html>
`,
  css: `body {
  margin: 0;
  font-family: sans-serif;
  background: #101010;
  color: #f5f5f5;
}

h1 {
  color: #9eff1f;
}
`,
  json: `{
  "message": "Hello, developer.",
  "language": "json"
}
`,
}

function getStarterSnippet(language: string): string {
  return starterSnippets[language] ?? starterSnippets['javascript']!
}

interface PlaygroundProps {
  onNavigate: (to: string) => void
  routeSearch?: string
  currentUser?: AuthUser | null
  onLogout?: () => void
}

export default function Playground({ onNavigate, routeSearch = '', currentUser, onLogout }: PlaygroundProps) {
  const [documents, setDocuments] = useState<PlaygroundDocument[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(true)
  const [title, setTitle] = useState('Untitled snippet')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(getStarterSnippet('javascript'))
  const [notice, setNotice] = useState('')
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [documentPendingDelete, setDocumentPendingDelete] = useState<PlaygroundDocument | null>(null)
  const [deleteMode, setDeleteMode] = useState<'single' | 'all' | null>(null)

  const refreshDocuments = useCallback(async () => {
    const nextDocuments = currentUser ? await listDocumentsForUser(currentUser.id) : []
    setDocuments(nextDocuments)
  }, [currentUser])

  useEffect(() => {
    let isActive = true

    const loadDocuments = async () => {
      try {
        const nextDocuments = currentUser ? await listDocumentsForUser(currentUser.id) : []
        if (isActive) setDocuments(nextDocuments)
      } catch (error) {
        if (isActive && error instanceof Error) setNotice(error.message)
      }
    }

    loadDocuments()
    return () => { isActive = false }
  }, [currentUser])

  useEffect(() => {
    let isActive = true

    const loadDocument = async () => {
      const params = new URLSearchParams(routeSearch)
      const shareToken = params.get('share')

      if (shareToken) {
        const sharedDoc = await getDocumentByShareToken(shareToken)
        if (!isActive) return

        if (sharedDoc) {
          const isOwnerViewingSharedDoc = currentUser?.id === sharedDoc.ownerId
          setActiveDocumentId(isOwnerViewingSharedDoc ? sharedDoc.id : null)
          setIsCreatingNew(!isOwnerViewingSharedDoc)
          setTitle(sharedDoc.title)
          setLanguage(sharedDoc.language)
          setCode(sharedDoc.content)
          setNotice(`Loaded shared doc: ${sharedDoc.title}`)
        }
        return
      }

      if (documents.length > 0 && !activeDocumentId && !isCreatingNew) {
        const [firstDoc] = documents
        if (firstDoc) {
          setActiveDocumentId(firstDoc.id)
          setIsCreatingNew(false)
          setTitle(firstDoc.title)
          setLanguage(firstDoc.language)
          setCode(firstDoc.content)
        }
      }
    }

    loadDocument().catch((error) => {
      if (isActive && error instanceof Error) setNotice(error.message)
    })

    return () => { isActive = false }
  }, [activeDocumentId, currentUser?.id, documents, isCreatingNew, routeSearch])

  useEffect(() => {
    if (!showSaveConfirmation) return

    const timer = window.setTimeout(() => setShowSaveConfirmation(false), 2500)
    return () => window.clearTimeout(timer)
  }, [showSaveConfirmation])

  const openDocument = (doc: PlaygroundDocument) => {
    setActiveDocumentId(doc.id)
    setIsCreatingNew(false)
    setTitle(doc.title)
    setLanguage(doc.language)
    setCode(doc.content)
    setNotice(`Opened ${doc.title}`)
  }

  const handleNewDocument = () => {
    setActiveDocumentId(null)
    setIsCreatingNew(true)
    setTitle('Untitled snippet')
    setLanguage('javascript')
    setCode(getStarterSnippet('javascript'))
    setShareUrl('')
    setNotice('New snippet created.')
  }

  const handleLanguageChange = (nextLanguage: string) => {
    const nextStarter = getStarterSnippet(nextLanguage)
    const currentStarter = getStarterSnippet(language)
    const shouldReplaceWithStarter = !activeDocumentId || code === currentStarter

    setLanguage(nextLanguage)
    if (shouldReplaceWithStarter) setCode(nextStarter)
  }

  const handleSave = async () => {
    if (!currentUser) {
      onNavigate('/login?redirect=/playground')
      return
    }

    try {
      const savedDoc = await saveDocument({
        id: activeDocumentId,
        title,
        content: code,
        language,
        ownerId: currentUser.id,
        isShared: documents.find((item) => item.id === activeDocumentId)?.isShared ?? false,
      })

      setActiveDocumentId(savedDoc.id)
      setIsCreatingNew(false)
      await refreshDocuments()
      setNotice('Document saved successfully.')
      setShowSaveConfirmation(true)
    } catch (error) {
      if (error instanceof Error) setNotice(error.message)
    }
  }

  const handleShare = async (docToShare?: PlaygroundDocument) => {
    try {
      const nextId = docToShare?.id ?? activeDocumentId
      const nextTitle = docToShare?.title ?? title
      const nextContent = docToShare?.content ?? code
      const nextLanguage = docToShare?.language ?? language

      const savedDoc = await saveDocument({
        id: nextId,
        title: nextTitle,
        content: nextContent,
        language: nextLanguage,
        ownerId: currentUser?.id ?? '',
        isShared: true,
      })

      setActiveDocumentId(savedDoc.id)
      setIsCreatingNew(false)
      await refreshDocuments()
      setShareUrl(`${window.location.origin}/playground?share=${savedDoc.shareToken ?? ''}`)
      setShareModalOpen(true)
      setNotice('Share link created.')
    } catch (error) {
      if (error instanceof Error) setNotice(error.message)
    }
  }

  const handleShareSavedDocument = async (event: React.MouseEvent, doc: PlaygroundDocument) => {
    event.stopPropagation()
    setActiveDocumentId(doc.id)
    setTitle(doc.title)
    setLanguage(doc.language)
    setCode(doc.content)

    if (doc.isShared) {
      setShareUrl(`${window.location.origin}/playground?share=${doc.shareToken ?? ''}`)
      setShareModalOpen(true)
      return
    }

    await handleShare(doc)
  }

  const handleDeleteDocument = (event: React.MouseEvent, doc: PlaygroundDocument) => {
    event.stopPropagation()
    setDeleteMode('single')
    setDocumentPendingDelete(doc)
  }

  const handleDeleteAllDocuments = () => {
    setDeleteMode('all')
    setDocumentPendingDelete({ id: 'all-documents', title: 'all saved documents' } as PlaygroundDocument)
  }

  const closeDeleteDialog = () => {
    setDeleteMode(null)
    setDocumentPendingDelete(null)
  }

  const confirmDeleteDocument = async () => {
    if (!documentPendingDelete) return

    try {
      if (deleteMode === 'all') {
        await deleteAllDocumentsForUser(currentUser?.id ?? '')
        setDocuments([])
        handleNewDocument()
        setNotice('All saved documents deleted.')
        setDocumentPendingDelete(null)
        setDeleteMode(null)
        return
      }

      await deleteDocument(documentPendingDelete.id)

      const remaining = documents.filter((item) => item.id !== documentPendingDelete.id)
      setDocuments(remaining)

      if (activeDocumentId === documentPendingDelete.id) {
        const [nextDoc] = remaining
        if (nextDoc) {
          openDocument(nextDoc)
        } else {
          handleNewDocument()
        }
      }

      setNotice(`Deleted ${documentPendingDelete.title}.`)
      setDocumentPendingDelete(null)
      setDeleteMode(null)
    } catch (error) {
      if (error instanceof Error) setNotice(error.message)
    }
  }

  const storageMessage = currentUser ? (
    <>
      Showing all documents for{' '}
      <span className="font-semibold text-accent">{currentUser.name}</span>. Saved files appear here.
    </>
  ) : (
    'Sign in to save snippets and keep them synced off this device.'
  )

  return (
    <div>
      <AppHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath="/playground" />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Code Playground</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm/7 text-muted">
            Create, save, and share code snippets from a browser-based development workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[21rem_minmax(0,1fr)]">
          <aside className="flex min-h-200 flex-col overflow-hidden rounded-3xl bg-surface p-4 outline -outline-offset-1 outline-white/10 lg:h-[calc(100vh-9rem)]">
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Saved documents</h2>
                <p className="type-body mt-1">{storageMessage}</p>
              </div>
            </div>

            {!currentUser ? (
              <button
                type="button"
                onClick={() => onNavigate('/login?redirect=/playground')}
                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]"
              >
                Log in to save your work
              </button>
            ) : null}

            <div className="mt-4 flex-1 overflow-hidden">
              <div className="h-full space-y-2.5 overflow-y-auto pr-1">
                {documents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-muted">
                    {currentUser
                      ? 'No saved documents yet. Save the current snippet to create your first document.'
                      : 'Saved snippets will stack here.'}
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-stretch gap-2 rounded-2xl border p-2 transition ${
                        activeDocumentId === doc.id
                          ? 'border-accent bg-accent/10 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]'
                          : 'border-white/10 bg-black/20 hover:border-white/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openDocument(doc)}
                        className="min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-white">{doc.title}</p>
                          {activeDocumentId === doc.id ? (
                            <span className="shrink-0 rounded-full bg-accent/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                              Open
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{doc.language}</p>
                        <p className="mt-2 text-xs text-muted">Updated {new Date(doc.updatedAt).toLocaleString()}</p>
                      </button>
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleShareSavedDocument(e, doc)}
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-accent hover:text-accent"
                        >
                          Share
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDocument(e, doc)}
                          className="rounded-xl border border-red-500/30 px-3 py-2 text-xs font-semibold text-white transition hover:border-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {currentUser && documents.length > 0 ? (
              <button
                type="button"
                onClick={handleDeleteAllDocuments}
                className="mt-5 w-full rounded-xl border border-red-500 px-4 py-3 text-sm font-semibold text-red-400 transition hover:border-red-600 hover:bg-red-500 hover:text-white"
              >
                Delete all
              </button>
            ) : null}
          </aside>

          <section className="min-w-0 rounded-3xl bg-surface p-4 outline -outline-offset-1 outline-white/10">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="snippet-title" className="mb-2 block text-base font-semibold text-white font-mono">
                  Document title
                </label>
                <input
                  id="snippet-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                />
              </div>

              <div className="xl:w-52">
                <label htmlFor="language" className="mb-2 block text-base font-semibold text-white font-mono">
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="block w-full appearance-none rounded-xl bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-surface text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/70">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex shrink-0 items-center justify-center gap-x-2 rounded-md border border-accent/10 bg-accent px-4 py-3 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]"
              >
                <CloudArrowUpIcon aria-hidden="true" className="size-5" />
                Save
              </button>

              <button
                type="button"
                onClick={handleNewDocument}
                className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
              >
                + New
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3">
              <div className="min-h-28rem w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-white outline-none">
                <Suspense
                  fallback={
                    <div className="flex h-[70vh] items-center justify-center rounded-xl border border-white/10 bg-black/30 text-sm text-gray-400">
                      Loading editor...
                    </div>
                  }
                >
                  <Editor
                    height="70vh"
                    theme="vs-dark"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value ?? '')}
                    options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
                  />
                </Suspense>
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                <p className="text-base font-semibold text-white">Storage rules</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm/6 text-muted marker:text-accent">
                  <li>Saved snippets stay attached to your account.</li>
                  <li>You need to be signed in to save or share a snippet.</li>
                  <li>Shared links reopen the last saved version of a shared snippet.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                <p className="text-base font-semibold text-white">Status</p>
                <p className="mt-3 text-sm/6 text-muted">{notice || 'No recent activity.'}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
      <ConfirmationMessage open={showSaveConfirmation} message="Document saved successfully." />
      <AlertDialogBox
        open={Boolean(documentPendingDelete)}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteDocument}
        title={deleteMode === 'all' ? 'Delete all documents?' : 'Delete document?'}
        description={
          deleteMode === 'all'
            ? 'All saved documents will be removed from your account. This cannot be undone.'
            : documentPendingDelete
              ? `"${documentPendingDelete.title}" will be removed from your saved documents. This can't be undone.`
              : ''
        }
        confirmLabel={deleteMode === 'all' ? 'Delete all' : 'Delete'}
        cancelLabel="Cancel"
      />
      <ShareDocumentModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} shareUrl={shareUrl} />
    </div>
  )
}
