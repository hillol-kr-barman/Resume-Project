import { projects } from './pageData/homePageData'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectsCard from '../components/ProjectsCard'

export default function AllProjects({ onNavigate, currentUser, onLogout, currentPath = '/projects' }) {
    return (
        <div>
            <SiteHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

            <main className="mx-auto max-w-6xl px-5 pt-28 pb-20 lg:px-6">
                <h1 className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">Current Project</h1>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm/7 text-body">
                    This is the project I am currently developing and improving.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-5">
                    {projects.map((project) => (
                        <ProjectsCard key={project.id} project={project} variant="list" />
                    ))}
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
