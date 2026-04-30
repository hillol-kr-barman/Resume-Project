import { SiteHeader } from '@hillolbarman/ui'
import type { AuthUser } from '@hillolbarman/ui'
import logo from '../assets/logo_green.svg'
import { navigation } from '../pages/pageData/homePageData'

interface AppHeaderProps {
  currentPath?: string
  currentUser?: AuthUser | null
  onNavigate: (to: string) => void
  onLogout?: () => void
}

export default function AppHeader({ currentPath, currentUser, onNavigate, onLogout }: AppHeaderProps) {
  return (
    <SiteHeader
      navItems={navigation}
      logoSrc={logo}
      logoAlt="Hillol Barman"
      siteName="Hillol Barman"
      currentPath={currentPath}
      currentUser={currentUser}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  )
}
