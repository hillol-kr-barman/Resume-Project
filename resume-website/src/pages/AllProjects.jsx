export default function AllProjects({ onNavigate }) {
    const handleRouteChange = (event, to) => {
        event.preventDefault()
        onNavigate(to)
    }

    return(
        <>
        <h1 className="text-white bg-background">Navigated to all projects</h1>
        </>
    )
}