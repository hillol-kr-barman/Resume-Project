import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo_green.svg'
import { navigation, projects, socials } from './pageData/homePageData'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

export default function AllProjects({ onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.max(1, Math.ceil(projects.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 28)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages)
    }, [currentPage, totalPages])

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

            <main className="mx-auto mt-24 max-w-7xl px-6 py-28 lg:px-8">
                <h1 className="text-4xl text-center font-semibold tracking-tight text-white sm:text-5xl">All Projects</h1>
                <p className="mx-auto mt-4 max-w-2xl text-center text-base/7 text-body">
                    A complete list of projects from my portfolio.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6">
                    {currentProjects.map((item) => (
                        <article
                            key={item.id}
                            className="grid h-full grid-cols-5 items-center rounded-2xl bg-card p-6 outline -outline-offset-1 outline-white/10"
                        >
                            <div className='col-span-3'>
                                <h2 className="text-left text-2xl font-semibold text-white">{item.title}</h2>
                                <p className="mt-4 text-left text-base/7 text-body">{item.content}</p>
                                <p className="mt-4 text-left text-base/7 text-body">
                                    <span className="font-bold"> Techstack: </span><span className="italic">{item.projectTechstack}</span>
                                </p>

                                <div className="mt-6 border-t border-white/10"></div>
                                <a
                                    href={item.gitLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
                                >
                                    <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
                                    View on GitHub
                                </a>
                                <div className="mt-2 border-t border-white/10"></div>
                            </div>
                            <div></div>
                            <div className="flex items-center col-span-1">
                                <img
                                    src={item.imageSrc}
                                    alt={`${item.title} thumbnail`}
                                    className="h-44 w-full rounded-xl object-cover"
                                />
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <nav className="mt-18 flex items-center justify-between border-t border-white/10 px-4 sm:px-0">
                    <div className="-mt-px flex w-0 flex-1">
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault()
                                if (currentPage > 1) setCurrentPage((page) => page - 1)
                            }}
                            className={`inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium ${currentPage === 1 ? 'pointer-events-none text-gray-600' : 'text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
                        >
                            <ArrowLongLeftIcon aria-hidden="true" className="mr-3 size-5 text-gray-500" />
                            Previous
                        </a>
                    </div>
                    <div className="hidden md:-mt-px md:flex">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1
                            const isActive = page === currentPage
                            return (
                                <a
                                    key={page}
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault()
                                        setCurrentPage(page)
                                    }}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${isActive
                                        ? 'border-accent text-accent'
                                        : 'border-transparent text-gray-400 hover:border-white/20 hover:text-gray-200'
                                        }`}
                                >
                                    {page}
                                </a>
                            )
                        })}
                    </div>
                    <div className="-mt-px flex w-0 flex-1 justify-end">
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault()
                                if (currentPage < totalPages) setCurrentPage((page) => page + 1)
                            }}
                            className={`inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium ${currentPage === totalPages ? 'pointer-events-none text-gray-600' : 'text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
                        >
                            Next
                            <ArrowLongRightIcon aria-hidden="true" className="ml-3 size-5 text-gray-500" />
                        </a>
                    </div>
                </nav>
                <div className='mx-auto mt-4 max-w-7xl px-6 py-28 lg:px-8'>
                    <h4 className='text-center text-body'>Page {currentPage} of {totalPages}</h4>
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
