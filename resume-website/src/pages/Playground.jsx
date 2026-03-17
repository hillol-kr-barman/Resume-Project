import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo_green.svg'
import { navigation, socials } from './pageData/homePageData'
import {
    getDocumentByShareToken,
    listDocumentsForUser,
    listTemporaryDocuments,
    saveDocument,
} from '../lib/playgroundStore'

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
]

const starterSnippet = `function greet(name) {
  return \`Hello, \${name}.\`
}

console.log(greet('world'))
`

export default function Playground({ onNavigate, routeSearch = '', currentUser, onLogout }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [documents, setDocuments] = useState([])
    const [activeDocumentId, setActiveDocumentId] = useState(null)
    const [title, setTitle] = useState('Untitled snippet')
    const [language, setLanguage] = useState('javascript')
    const [code, setCode] = useState(starterSnippet)
    const [notice, setNotice] = useState('')

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 28)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

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
            setNotice(`Loaded shared document: ${sharedDocument.title}`)
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

    const handleNavigate = (event, to, { closeMobileMenu = false } = {}) => {
        event.preventDefault()
        if (closeMobileMenu) setMobileMenuOpen(false)
        if (onNavigate) onNavigate(to)
    }

    const fullName = currentUser?.name ?? ''
    const firstName = fullName.trim().split(/\s+/)[0] || ''

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
        setNotice('Ready for a new snippet.')
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
                ? 'Document saved to your account.'
                : 'Temporary draft saved for 24 hours. Log in to keep it permanently.',
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
            setNotice('Share link copied to clipboard.')
        } catch {
            setNotice(`Share this link: ${shareUrl}`)
        }
    }

    const savedLabel = currentUser ? 'Saved documents' : 'Temporary drafts'
    const storageMessage = currentUser
        ? `${currentUser.name} is signed in. Documents saved here stay attached to this account.`
        : 'Guest mode stores drafts temporarily for 24 hours. Log in to keep documents permanently.'

    return (
        <div>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-accent/40 bg-background/75 shadow-black/20 backdrop-blur-md' : 'bg-transparent'}`}
            >
                <nav
                    aria-label="Global"
                    className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-8 ${isScrolled ? 'py-4' : 'py-6'}`}
                >
                    <div className="flex lg:flex-1">
                        <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
                            <span className="sr-only">Hillol Barman</span>
                            <img alt="Hillol Barman - Logo" src={logo} className="h-8 w-auto" />
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
                            <a key={item.name} href={item.href} className="group text-sm/6 font-semibold text-white transition duration-300">
                                {item.name}
                                <span className="block h-0.5 w-full origin-center scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {currentUser ? (
                            <div className="flex items-center gap-5">
                                <a href="#" className="group block shrink-0">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                alt={`${currentUser.name} profile`}
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                className="inline-block size-9 rounded-full outline -outline-offset-1 outline-white/10"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-300 group-hover:text-white">{firstName}</p>
                                            <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                                                View profile
                                            </p>
                                        </div>
                                    </div>
                                </a>
                                <button type="button" onClick={onLogout} className="text-sm/6 font-semibold text-white">
                                    Log out <span aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        ) : (
                            <a
                                href="/login?redirect=/playground"
                                onClick={(event) => handleNavigate(event, '/login?redirect=/playground', { closeMobileMenu: true })}
                                className="text-sm/6 font-semibold text-white"
                            >
                                Log in <span aria-hidden="true">&rarr;</span>
                            </a>
                        )}
                    </div>
                </nav>

                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                        <div className="flex items-center justify-between">
                            <a href="/" onClick={(event) => handleNavigate(event, '/', { closeMobileMenu: true })} className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img alt="" src={logo} className="h-8 w-auto" />
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
                                        <a key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5">
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    {currentUser ? (
                                        <button type="button" onClick={onLogout} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5">
                                            Log out
                                        </button>
                                    ) : (
                                        <a
                                            href="/login?redirect=/playground"
                                            onClick={(event) => handleNavigate(event, '/login?redirect=/playground', { closeMobileMenu: true })}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                                        >
                                            Log in
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

            <main className="mx-auto mt-24 max-w-7xl px-6 py-20 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Code Playground</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base/7 text-body">
                        Build with CodeMirror next, but ship the storage flow now. Guests can paste code, save temporary drafts, and share them. Logged-in users keep their documents.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
                    <aside className="rounded-3xl bg-card p-5 outline -outline-offset-1 outline-white/10">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">{savedLabel}</h2>
                                <p className="mt-1 text-sm/6 text-body">{storageMessage}</p>
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
                                onClick={(event) => handleNavigate(event, '/login?redirect=/playground')}
                                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
                            >
                                Log in for permanent storage
                            </button>
                        ) : null}

                        <div className="mt-5 space-y-3">
                            {documents.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-body">
                                    No documents yet. Save the snippet on the right to create the first one.
                                </div>
                            ) : (
                                documents.map((document) => (
                                    <button
                                        key={document.id}
                                        type="button"
                                        onClick={() => openDocument(document)}
                                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${activeDocumentId === document.id
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

                    <section className="rounded-3xl bg-card p-5 outline -outline-offset-1 outline-white/10">
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
                            <div>
                                <label htmlFor="snippet-title" className="block text-sm font-medium text-white">
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
                                <label htmlFor="language" className="block text-sm font-medium text-white">
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

                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">Editor</p>
                                    <p className="text-xs text-body">Replace this textarea with CodeMirror when you add the package.</p>
                                </div>
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

                            <textarea
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                spellCheck="false"
                                className="min-h-[28rem] w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-white outline-none"
                            />
                        </div>

                        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-sm font-semibold text-white">Storage rules</p>
                                <ul className="mt-3 space-y-2 text-sm/6 text-body">
                                    <li>Guest saves are temporary and expire after 24 hours.</li>
                                    <li>Signed-in saves are attached to the user account.</li>
                                    <li>Shared links reopen the last saved version of a snippet.</li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-sm font-semibold text-white">Status</p>
                                <p className="mt-3 text-sm/6 text-body">{notice || 'No recent actions yet.'}</p>
                            </div>
                        </div>
                    </section>
                </div>
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
