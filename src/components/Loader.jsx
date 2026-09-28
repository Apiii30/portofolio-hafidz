import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, lockScroll, reducedMotion } from '../lib/scroll'
import { getState, setState, useStore } from '../lib/store'

const lines = ['finding the light switch…', 'feeding the cat…', 'untangling fairy lights…', 'making coffee…']

export default function Loader() {
  const sceneLoaded = useStore((s) => s.sceneLoaded)
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)
  const root = useRef()

  useEffect(() => {
    lockScroll(true)
    window.scrollTo(0, 0)
    let raf
    const start = performance.now()
    const tick = (now) => {
      // tied to wall-clock time so slow devices don't get a slow loader too
      const target = getState().sceneLoaded ? 100 : 90
      const v = Math.min(target, ((now - start) / 1000) * (reducedMotion ? 400 : 55))
      setCount(Math.round(v))
      if (v < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (count < 100 || !sceneLoaded) return
    let cancelled = false
    let fallback
    const finish = () => {
      lockScroll(false)
      setGone(true)
      // the scrollbar reappears here, which can shift layout by a few pixels
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    document.fonts.ready.then(() => {
      if (cancelled) return
      setState({ ready: true })
      // never leave the visitor stuck behind the curtain, even if a frame hitches
      fallback = setTimeout(finish, 2500)
      gsap.to(root.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: reducedMotion ? 0.01 : 1.1,
        ease: 'expo.inOut',
        delay: 0.25,
        onComplete: finish,
      })
    })
    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [count, sceneLoaded])

  if (gone) return null
  return (
    <div
      ref={root}
      className="fixed inset-0 z-70 flex flex-col justify-between bg-page p-6 text-fg md:p-10"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-xs tracking-[0.2em] text-fg/60 uppercase">hafidz's room · bandung</p>
      <div>
        <p className="font-hand text-2xl text-accent-2 md:text-3xl">{lines[Math.min(lines.length - 1, Math.floor(count / 26))]}</p>
        <p className="font-display text-[28vw] leading-[0.8] text-accent md:text-[18vw]">
          {String(count).padStart(2, '0')}
          <span className="text-fg/30">%</span>
        </p>
      </div>
    </div>
  )
}
