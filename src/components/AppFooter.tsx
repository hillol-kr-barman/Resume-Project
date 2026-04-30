import { SiteFooter } from '@hillolbarman/ui'
import { navigation, socials } from '../pages/pageData/homePageData'

export default function AppFooter() {
  return (
    <SiteFooter
      navItems={navigation}
      socials={socials}
      ownerName="Hillol Barman"
      copyrightSuffix="Software engineering portfolio"
    />
  )
}
