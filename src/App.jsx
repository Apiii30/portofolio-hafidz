import { useEffect, useLayoutEffect } from 'react'
import Scene from './three/Scene'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Works from './sections/Works'
import Contact from './sections/Contact'
import Lightbox from './components/Lightbox'
import { works } from './data/profile'
import { gsap, ScrollTrigger, startSmoothScroll, reducedMotion } from './lib/scroll'
import { useStore } from './lib/store'

function useReveals(ready) {
  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const markIn = () => {
          el.classList.add('is-in')
          el.querySelectorAll('.scribble').forEach((s) => s.classList.add('is-in'))
        }
        if (reducedMotion) return markIn()
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          rotate: parseFloat(el.dataset.reveal) || 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true, onEnter: markIn },
        })
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready])
}

// ScrollTrigger only re-measures on window resize. Fonts loading, the scrollbar
// coming back after the loader, or images settling all move things too.
function useRefreshOnLayoutChange() {
  useEffect(() => {
    let t
    let lastH = document.body.offsetHeight
    let lastW = document.documentElement.clientWidth
    const ro = new ResizeObserver(() => {
      const h = document.body.offsetHeight
      const w = document.documentElement.clientWidth
      if (h === lastH && w === lastW) return
      lastH = h
      lastW = w
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    ro.observe(document.documentElement)
    return () => {
      ro.disconnect()
      clearTimeout(t)
    }
  }, [])
}

export default function App() {
  const ready = useStore((s) => s.ready)
  useEffect(() => startSmoothScroll(), [])
  useRefreshOnLayoutChange()
  useReveals(ready)

  return (
    <>
      <Loader />
      <Scene />
      <Nav />
      <main>
        <Hero />
        {/* room stays in view while the camera drifts toward the window */}
        <div className="h-[60vh]" aria-hidden="true" />
        <About />
        <Projects />
        <Skills />
        <Experience />
        {works.length > 0 && <Works />}
        <Contact />
      </main>
      <Lightbox />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
