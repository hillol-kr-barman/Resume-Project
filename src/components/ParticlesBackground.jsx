import { useEffect, useId } from 'react'
import  nasaParticlesConfig from '../lib/nasaParticlesConfig.json'

const PARTICLES_SCRIPT_SRC = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'

function loadParticlesScript() {
  const existingScript = document.querySelector(`script[src="${PARTICLES_SCRIPT_SRC}"]`)

  if (existingScript) {
    return new Promise((resolve, reject) => {
      if (window.particlesJS) {
        resolve()
        return
      }

      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PARTICLES_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load particles.js'))
    document.body.appendChild(script)
  })
}

export default function ParticlesBackground({ className = '', config = nasaParticlesConfig }) {
  const generatedId = useId().replace(/:/g, '')
  const containerId = `particles-${generatedId}`

  useEffect(() => {
    let isMounted = true

    loadParticlesScript()
      .then(() => {
        if (!isMounted || !window.particlesJS) return

        const container = document.getElementById(containerId)
        if (!container) return

        container.innerHTML = ''
        window.particlesJS(containerId, config)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      isMounted = false
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [config, containerId])

  return <div id={containerId} aria-hidden="true" className={className} />
}
