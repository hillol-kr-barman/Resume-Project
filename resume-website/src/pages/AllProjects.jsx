import { useEffect, useState } from 'react'
import { projects } from './pageData/homePageData'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function AllProjects({ onNavigate, currentUser, onLogout, currentPath = '/projects' }) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.max(1, Math.ceil(projects.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages)
    }, [currentPage, totalPages])


    return (
        <div>
            <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

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

            <SiteFooter />
        </div>
    )
}
