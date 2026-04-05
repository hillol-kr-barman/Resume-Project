import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import {
  getDocumentByShareToken,
  listDocumentsForUser,
  saveDocument,
} from '../lib/playgroundStore'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ShareDocumentModal from '../components/ShareDocumentModal'

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
]

const starterSnippets = {
  javascript: `function greet(name) {
  return \`G'day, \${name}.\`
}

console.log(greet('mate'))
`,
  typescript: `function greet(name: string): string {
  return \`G'day, \${name}.\`
}

console.log(greet('mate'))
`,
  python: `def greet(name):
    return f"G'day, {name}."


print(greet("mate"))
`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <h1>G'day, mate.</h1>
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
  "message": "G'day, mate.",
  "language": "json"
}
`,
}

function getStarterSnippet(language) {
  return starterSnippets[language] ?? starterSnippets.javascript
}

export default function Playground({ onNavigate, routeSearch = '', currentUser, onLogout }) {
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState(null)
  const [isCreatingNew, setIsCreatingNew] = useState(true)
  const [title, setTitle] = useState('Untitled snippet')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(getStarterSnippet('javascript'))
  const [notice, setNotice] = useState('')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const refreshDocuments = async () => {
    const nextDocuments = currentUser ? await listDocumentsForUser(currentUser.id) : []
    setDocuments(nextDocuments)
  }

  useEffect(() => {
    let isActive = true

    const loadDocuments = async () => {
      try {
        const nextDocuments = currentUser ? await listDocumentsForUser(currentUser.id) : []
        if (isActive) {
          setDocuments(nextDocuments)
        }
      } catch (error) {
        if (isActive) {
          setNotice(error.message)
        }
      }
    }

    loadDocuments()

    return () => {
      isActive = false
    }
  }, [currentUser])

  useEffect(() => {
    let isActive = true

    const loadDocument = async () => {
      const params = new URLSearchParams(routeSearch)
      const shareToken = params.get('share')

      if (shareToken) {
        const sharedDocument = await getDocumentByShareToken(shareToken)

        if (!isActive) return

        if (sharedDocument) {
          const isOwnerViewingSharedDoc = currentUser?.id === sharedDocument.ownerId
          setActiveDocumentId(isOwnerViewingSharedDoc ? sharedDocument.id : null)
          setIsCreatingNew(!isOwnerViewingSharedDoc)
          setTitle(sharedDocument.title)
          setLanguage(sharedDocument.language)
          setCode(sharedDocument.content)
          setNotice(`Loaded shared doc: ${sharedDocument.title}`)
        }

        return
      }

      if (documents.length > 0 && !activeDocumentId && !isCreatingNew) {
        const [firstDocument] = documents
        setActiveDocumentId(firstDocument.id)
        setIsCreatingNew(false)
        setTitle(firstDocument.title)
        setLanguage(firstDocument.language)
        setCode(firstDocument.content)
      }
    }

    loadDocument().catch((error) => {
      if (isActive) {
        setNotice(error.message)
      }
    })

    return () => {
      isActive = false
    }
  }, [activeDocumentId, currentUser?.id, documents, isCreatingNew, routeSearch])

  const openDocument = (document) => {
    setActiveDocumentId(document.id)
    setIsCreatingNew(false)
    setTitle(document.title)
    setLanguage(document.language)
    setCode(document.content)
    setNotice(`Opened ${document.title}`)
  }

  const handleNewDocument = () => {
    setActiveDocumentId(null)
    setIsCreatingNew(true)
    setTitle('Untitled snippet')
    setLanguage('javascript')
    setCode(getStarterSnippet('javascript'))
    setShareUrl('')
    setNotice('Fresh snippet, ready to go.')
  }

  const handleLanguageChange = (nextLanguage) => {
    const nextStarterSnippet = getStarterSnippet(nextLanguage)
    const currentStarterSnippet = getStarterSnippet(language)
    const shouldReplaceWithStarter = !activeDocumentId || code === currentStarterSnippet

    setLanguage(nextLanguage)

    if (shouldReplaceWithStarter) {
      setCode(nextStarterSnippet)
    }
  }

  const handleSave = async () => {
    if (!currentUser) {
      onNavigate('/login?redirect=/playground')
      return
    }

    try {
      const document = await saveDocument({
        id: activeDocumentId,
        title,
        content: code,
        language,
        ownerId: currentUser.id,
        isShared: documents.find((item) => item.id === activeDocumentId)?.isShared ?? false,
      })

      setActiveDocumentId(document.id)
      setIsCreatingNew(false)
      await refreshDocuments()
      setNotice('Document saved to your Supabase account, all sorted.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  const handleShare = async (documentToShare = null) => {
    try {
      const nextId = documentToShare?.id ?? activeDocumentId
      const nextTitle = documentToShare?.title ?? title
      const nextContent = documentToShare?.content ?? code
      const nextLanguage = documentToShare?.language ?? language

      const document = await saveDocument({
        id: nextId,
        title: nextTitle,
        content: nextContent,
        language: nextLanguage,
        ownerId: currentUser?.id,
        isShared: true,
      })

      setActiveDocumentId(document.id)
      setIsCreatingNew(false)
      await refreshDocuments()
      setShareUrl(`${window.location.origin}/playground?share=${document.shareToken}`)
      setShareModalOpen(true)
      setNotice('Share link ready to go.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  const handleShareSavedDocument = async (event, document) => {
    event.stopPropagation()

    setActiveDocumentId(document.id)
    setTitle(document.title)
    setLanguage(document.language)
    setCode(document.content)

    if (document.isShared) {
      setShareUrl(`${window.location.origin}/playground?share=${document.shareToken}`)
      setShareModalOpen(true)
      return
    }

    await handleShare(document)
  }

  const storageMessage = currentUser
    ? `${currentUser.name} is signed in. Anything saved here stays tucked into your account.`
    : 'Sign in to save snippets and keep them synced off this device.'

  return (
    <div>
      <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath="/playground" />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Code Playground</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm/7 text-body">
            A handy place to muck around with snippets, save drafts, and share what you are working on.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="rounded-3xl bg-card p-4 outline -outline-offset-1 outline-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Saved documents</h2>
                <p className="type-body mt-1">{storageMessage}</p>
              </div>
            </div>

            {!currentUser ? (
              <button
                type="button"
                onClick={() => onNavigate('/login?redirect=/playground')}
                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
              >
                Log in to save your work
              </button>
            ) : null}

            <div className="mt-4 space-y-2.5">
              {documents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-body">
                  {currentUser
                    ? 'Nothing saved yet. Save the snippet on the right to get the first one going.'
                    : 'Sign in to start saving snippets.'}
                </div>
              ) : (
                documents.map((document) => (
                  <div
                    key={document.id}
                    className={`flex items-stretch gap-2 rounded-2xl border p-2 transition ${
                      activeDocumentId === document.id
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 bg-black/20 hover:border-white/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => openDocument(document)}
                      className="min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left"
                    >
                      <p className="truncate text-sm font-semibold text-white">{document.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-body">{document.language}</p>
                      <p className="mt-2 text-xs text-body">
                        Updated {new Date(document.updatedAt).toLocaleString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleShareSavedDocument(event, document)}
                      className="self-center rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-accent hover:text-accent"
                    >
                      Share
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="rounded-3xl bg-card p-4 outline -outline-offset-1 outline-white/10">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="snippet-title" className="mb-2 block text-xs font-medium text-white">
                  Document title
                </label>
                <input
                  id="snippet-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                />
              </div>

              <div className="xl:w-52">
                <label htmlFor="language" className="mb-2 block text-xs font-medium text-white">
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(event) => handleLanguageChange(event.target.value)}
                    className="block w-full appearance-none rounded-xl bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-card text-white">
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
                className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
              >
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

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
              <div className="min-h-28rem w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-white outline-none">
                <Editor
                  height="70vh"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value ?? '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                <p className="text-base font-semibold text-white">Storage rules</p>
                <ul className="mt-3 space-y-2 text-sm/6 text-body">
                  <li>Saved snippets stay attached to your account.</li>
                  <li>You need to be signed in to save or share a snippet.</li>
                  <li>Shared links reopen the last saved version of a shared snippet.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                <p className="text-base font-semibold text-white">Status</p>
                <p className="mt-3 text-sm/6 text-body">{notice || 'No action yet. Give it a nudge.'}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
      <ShareDocumentModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} shareUrl={shareUrl} />
    </div>
  )
}
