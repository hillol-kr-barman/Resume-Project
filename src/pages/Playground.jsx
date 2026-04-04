import { useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import {
    getDocumentByShareToken,
    listDocumentsForUser,
    listTemporaryDocuments,
    saveDocument,
} from '../lib/playgroundStore'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
]

const starterSnippet = `function greet(name) {
  return \`G'day, \${name}.\`
}

console.log(greet('mate'))
`

export default function Playground({ onNavigate, routeSearch = '', currentUser, onLogout }) {
    const [documents, setDocuments] = useState([])
    const [activeDocumentId, setActiveDocumentId] = useState(null)
    const [title, setTitle] = useState('Untitled snippet')
    const [language, setLanguage] = useState('javascript')
    const [code, setCode] = useState(starterSnippet)
    const [notice, setNotice] = useState('')

    const refreshDocuments = useMemo(() => {
        return () => {
            const nextDocuments = currentUser
                ? listDocumentsForUser(currentUser.id)
                : listTemporaryDocuments()
            setDocuments(nextDocuments)
        }
    }, [currentUser])

    useEffect(() => {
        refreshDocuments()
    }, [refreshDocuments])

    useEffect(() => {
        const params = new URLSearchParams(routeSearch)
        const sharedDocument = getDocumentByShareToken(params.get('share'))

        if (sharedDocument) {
            setActiveDocumentId(sharedDocument.id)
            setTitle(sharedDocument.title)
            setLanguage(sharedDocument.language)
            setCode(sharedDocument.content)
            setNotice(`Loaded shared doc: ${sharedDocument.title}`)
            return
        }

        if (documents.length > 0 && !activeDocumentId) {
            const [firstDocument] = documents
            setActiveDocumentId(firstDocument.id)
            setTitle(firstDocument.title)
            setLanguage(firstDocument.language)
            setCode(firstDocument.content)
        }
    }, [activeDocumentId, documents, routeSearch])

    const openDocument = (document) => {
        setActiveDocumentId(document.id)
        setTitle(document.title)
        setLanguage(document.language)
        setCode(document.content)
        setNotice(`Opened ${document.title}`)
    }

    const handleNewDocument = () => {
        setActiveDocumentId(null)
        setTitle('Untitled snippet')
        setLanguage('javascript')
        setCode(starterSnippet)
        setNotice('Fresh snippet, ready to go.')
    }

    const handleSave = () => {
        const document = saveDocument({
            id: activeDocumentId,
            title,
            content: code,
            language,
            ownerId: currentUser?.id ?? null,
        })

        setActiveDocumentId(document.id)
        refreshDocuments()
        setNotice(
            currentUser
                ? 'Document saved to your account, all sorted.'
                : 'Temporary draft saved for 24 hours. Log in to hang onto it for good.',
        )
    }

    const handleShare = async () => {
        const document = saveDocument({
            id: activeDocumentId,
            title,
            content: code,
            language,
            ownerId: currentUser?.id ?? null,
        })

        const shareUrl = `${window.location.origin}/playground?share=${document.shareToken}`
        setActiveDocumentId(document.id)
        refreshDocuments()

        try {
            await navigator.clipboard.writeText(shareUrl)
            setNotice('Share link copied to the clipboard.')
        } catch {
            setNotice(`Share this link around: ${shareUrl}`)
        }
    }

    const savedLabel = currentUser ? 'Saved documents' : 'Temporary drafts'
    const storageMessage = currentUser
        ? `${currentUser.name} is signed in. Anything saved here stays tucked into this account.`
        : 'Guest mode keeps drafts around for 24 hours. Log in if you want to hang onto them properly.'

    return (
        <div>
            <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath="/playground" />

            <main className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Code Playground</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm/7 text-body">
                        A handy place to muck around with snippets, save drafts, and share what you are working on. Logged-in users keep their docs, and guests can still have a decent fiddle.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
                    <aside className="rounded-3xl bg-card p-4 outline -outline-offset-1 outline-white/10">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-white">{savedLabel}</h2>
                                <p className="type-body mt-1">{storageMessage}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleNewDocument}
                                className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
                            >
                                New
                            </button>
                        </div>

                        {!currentUser ? (
                            <button
                                type="button"
                                onClick={() => onNavigate('/login?redirect=/playground')}
                                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
                            >
                                Log in for permanent storage
                            </button>
                        ) : null}

                        <div className="mt-4 space-y-2.5">
                            {documents.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-body">
                                    Nothing saved yet. Save the snippet on the right to get the first one going.
                                </div>
                            ) : (
                                documents.map((document) => (
                                    <button
                                        key={document.id}
                                        type="button"
                                        onClick={() => openDocument(document)}
                                        className={`w-full rounded-2xl border px-4 py-2.5 text-left transition ${activeDocumentId === document.id
                                            ? 'border-accent bg-accent/10'
                                            : 'border-white/10 bg-black/20 hover:border-white/30'
                                            }`}
                                    >
                                        <p className="truncate text-sm font-semibold text-white">{document.title}</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-body">{document.language}</p>
                                        <p className="mt-2 text-xs text-body">
                                            Updated {new Date(document.updatedAt).toLocaleString()}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </aside>

                    <section className="rounded-3xl bg-card p-4 outline -outline-offset-1 outline-white/10">
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
                            <div>
                                <label htmlFor="snippet-title" className="block text-xs font-medium text-white">
                                    Document title
                                </label>
                                <input
                                    id="snippet-title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="mt-2 block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                                />
                            </div>

                            <div>
                                <label htmlFor="language" className="block text-xs font-medium text-white">
                                    Language
                                </label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                    className="mt-2 block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
                                >
                                    {languageOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-card text-white">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                            <div className="min-h-28rem w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-white outline-none"
                                onChange={(event) => setCode(event.target.value)}>
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
                        </div>

                        <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                                <p className="text-base font-semibold text-white">Storage rules</p>
                                <ul className="mt-3 space-y-2 text-sm/6 text-body">
                                    <li>Guest saves are temporary and expire after 24 hours.</li>
                                    <li>Signed-in saves stay attached to the user account.</li>
                                    <li>Shared links reopen the last saved version of a snippet.</li>
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
        </div>
    )
}
