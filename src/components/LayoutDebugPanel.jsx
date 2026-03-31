import { useEffect, useState } from 'react'

function readMetrics() {
  const html = document.documentElement
  const body = document.body
  const root = document.getElementById('root')
  const heroHeading = document.querySelector('h1')
  const visualViewport = window.visualViewport

  return {
    href: window.location.href,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth || null,
    outerHeight: window.outerHeight || null,
    devicePixelRatio: window.devicePixelRatio,
    visualViewportWidth: visualViewport?.width ?? null,
    visualViewportHeight: visualViewport?.height ?? null,
    visualViewportScale: visualViewport?.scale ?? null,
    htmlFontSize: window.getComputedStyle(html).fontSize,
    bodyFontSize: body ? window.getComputedStyle(body).fontSize : null,
    rootFontSize: root ? window.getComputedStyle(root).fontSize : null,
    heroHeadingFontSize: heroHeading ? window.getComputedStyle(heroHeading).fontSize : null,
    htmlClientWidth: html.clientWidth,
    bodyClientWidth: body?.clientWidth ?? null,
  }
}

export default function LayoutDebugPanel() {
  const [metrics, setMetrics] = useState(() => readMetrics())

  useEffect(() => {
    const syncMetrics = () => {
      setMetrics(readMetrics())
    }

    syncMetrics()
    window.addEventListener('resize', syncMetrics)
    window.addEventListener('orientationchange', syncMetrics)
    window.visualViewport?.addEventListener('resize', syncMetrics)

    return () => {
      window.removeEventListener('resize', syncMetrics)
      window.removeEventListener('orientationchange', syncMetrics)
      window.visualViewport?.removeEventListener('resize', syncMetrics)
    }
  }, [])

  return (
    <aside className="fixed right-3 bottom-3 z-[120] max-w-xs rounded-xl border border-accent/40 bg-black/85 p-3 text-xs text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <p className="font-semibold text-accent">Layout Debug</p>
      <dl className="mt-2 space-y-1 break-all text-gray-200">
        <div>
          <dt className="text-accent/80">url</dt>
          <dd>{metrics.href}</dd>
        </div>
        <div>
          <dt className="text-accent/80">inner</dt>
          <dd>{metrics.innerWidth} x {metrics.innerHeight}</dd>
        </div>
        <div>
          <dt className="text-accent/80">outer</dt>
          <dd>{metrics.outerWidth ?? 'n/a'} x {metrics.outerHeight ?? 'n/a'}</dd>
        </div>
        <div>
          <dt className="text-accent/80">visual viewport</dt>
          <dd>{metrics.visualViewportWidth ?? 'n/a'} x {metrics.visualViewportHeight ?? 'n/a'} @ {metrics.visualViewportScale ?? 'n/a'}</dd>
        </div>
        <div>
          <dt className="text-accent/80">dpr</dt>
          <dd>{metrics.devicePixelRatio}</dd>
        </div>
        <div>
          <dt className="text-accent/80">font sizes</dt>
          <dd>html {metrics.htmlFontSize}, body {metrics.bodyFontSize}, root {metrics.rootFontSize}</dd>
        </div>
        <div>
          <dt className="text-accent/80">hero h1</dt>
          <dd>{metrics.heroHeadingFontSize ?? 'not found'}</dd>
        </div>
        <div>
          <dt className="text-accent/80">client width</dt>
          <dd>html {metrics.htmlClientWidth}, body {metrics.bodyClientWidth ?? 'n/a'}</dd>
        </div>
      </dl>
    </aside>
  )
}
