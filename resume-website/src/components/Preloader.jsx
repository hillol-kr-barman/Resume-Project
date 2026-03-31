import { useEffect, useState } from 'react'

const words = ['projects', 'systems', 'interfaces', 'workflows', 'portfolio']
const animationDurationMs = 4000
const exitDurationMs = 450

export default function Preloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const enterTimer = window.setTimeout(() => {
      setIsVisible(true)
    }, 30)

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true)
    }, animationDurationMs)

    const completeTimer = window.setTimeout(() => {
      onComplete()
    }, animationDurationMs + exitDurationMs)

    return () => {
      window.clearTimeout(enterTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`preloader${isVisible ? ' preloader--visible' : ''}${isExiting ? ' preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading website"
    >
      <div className="preloader__card">
        <div className="preloader__loader">
          <p className="preloader__label">loading</p>
          <div className="preloader__words" aria-hidden="true">
            {words.map((word) => (
              <span key={word} className="preloader__word">
                {word}
              </span>
            ))}
            <span className="preloader__word">{words[0]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
