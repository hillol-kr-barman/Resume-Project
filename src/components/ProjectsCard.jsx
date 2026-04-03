export default function ProjectsCard({ project, variant = 'featured' }) {
  if (variant === 'list') {
    return (
      <article className="grid h-full grid-cols-1 gap-4 rounded-2xl bg-card p-4.5 outline -outline-offset-1 outline-white/10 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3">
          <h2 className="text-left text-lg font-semibold text-white">{project.title}</h2>
          <p className="mt-3 text-left text-sm/7 text-body">{project.content}</p>
          <p className="mt-3 text-left text-sm/7 text-body">
            <span className="font-bold">Techstack: </span>
            <span className="italic">{project.projectTechstack}</span>
          </p>

          <div className="mt-5 border-t border-white/10" />
          <a
            href={project.gitLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
          >
            <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
            View on GitHub
          </a>
          <div className="mt-2 border-t border-white/10" />
        </div>

        <div className="hidden lg:block" />

        <div className="flex items-center lg:col-span-1">
          <img
            src={project.imageSrc}
            alt={`${project.title} thumbnail`}
            className="h-36 w-full rounded-xl object-cover"
          />
        </div>
      </article>
    )
  }

  return (
    <article className="flex h-full flex-col rounded-2xl bg-card p-4.5 outline -outline-offset-1 outline-white/10">
      <h4 className="text-center text-lg font-semibold text-white">{project.title}</h4>
      <p className="mt-3 text-center text-sm/7 text-body">{project.content}</p>
      <img
        src={project.imageSrc}
        alt={`${project.title} thumbnail`}
        className="mt-5 h-36 w-full rounded-xl object-cover"
      />
      <a
        href={project.gitLink}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
      >
        <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
        View on GitHub
      </a>
    </article>
  )
}
  
