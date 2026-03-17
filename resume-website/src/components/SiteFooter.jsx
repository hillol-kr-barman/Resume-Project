import { navigation, socials } from '../pages/pageData/homePageData'

export default function SiteFooter() {
  return (
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
  )
}
