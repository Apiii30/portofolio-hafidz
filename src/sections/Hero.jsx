import { useLayoutEffect, useRef } from 'react'
import { gsap, scrollToTarget, reducedMotion } from '../lib/scroll'
import { useStore } from '../lib/store'
import { profile } from '../data/profile'
import { Arrow, Star } from '../components/Doodles'

export default function Hero() {
  const root = useRef()
  const ready = useStore((s) => s.ready)

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('[data-hero]', {
        y: 80,
        rotate: (i) => (i % 2 ? 3 : -3),
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.5,
      })
      gsap.delayedCall(1.4, () => root.current?.querySelectorAll('.scribble').forEach((s) => s.classList.add('is-in')))
    }, root)
    if (reducedMotion) root.current.querySelectorAll('.scribble').forEach((s) => s.classList.add('is-in'))
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      id="top"
      ref={root}
      data-cam="hero"
      data-cam-at="0"
      aria-label="Intro"
      className="scene-section relative z-10 flex min-h-svh flex-col justify-between px-5 pt-24 pb-8 md:px-10 md:pt-32 [@media(max-height:760px)]:md:pt-24"
      style={{ visibility: ready ? 'visible' : 'hidden' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-page/70 via-page/10 to-page/80 md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 bg-linear-to-r from-page/80 via-page/30 to-transparent mask-b-from-70% md:block" />

      <div className="relative max-w-3xl">
        <p data-hero className="mb-6 font-mono text-xs tracking-[0.2em] text-fg/60 uppercase">
          // portfolio · {profile.city}
        </p>
        <h1 className="font-display leading-[0.82] text-fg">
          <span data-hero className="block text-[23vw] text-accent md:text-[11.5vw]">
            Hafidz
          </span>
          <span data-hero className="mt-2 block text-[8.6vw] md:ml-[0.4em] md:text-[4.3vw]">
            Asmar Meisanda
          </span>
        </h1>
        <p data-hero className="mt-7 max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">
          {profile.study} student at {profile.campus}. I build web things from the database up — and push pixels around when nobody's
          watching.
        </p>

        <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToTarget('#projects')}
            className="group rounded-full bg-accent px-6 py-3 font-mono text-sm font-bold tracking-wide text-on-accent uppercase shadow-[4px_4px_0_var(--color-accent-2)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
          >
            See my work <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              download="Hafidz-Asmar-Meisanda-CV.pdf"
              className="group flex items-center gap-2 rounded-full border-2 border-fg/30 bg-page/80 px-6 py-3 font-mono text-sm tracking-wide uppercase transition-colors hover:border-fg"
            >
              Download CV
              <span className="rounded-sm bg-fg/10 px-1.5 py-0.5 text-[10px] tracking-wider text-fg/70 transition-colors group-hover:bg-accent group-hover:text-on-accent">
                PDF
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Pinned to the first screen's height, not the section's, so it's never pushed below the fold. */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(100svh-7.5rem)] flex justify-center">
        <p data-hero className="flex flex-col items-center gap-2.5 font-mono text-xs tracking-[0.2em] text-fg/60 uppercase">
          <span className="relative block h-9 w-5 rounded-full border-2 border-fg/40">
            <span className="absolute top-1.5 left-1/2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-accent" />
          </span>
          Scroll to come in
        </p>
      </div>

      <div className="relative flex items-end justify-center">
        <div data-hero className="absolute right-[7%] bottom-[8vh] hidden rotate-[-4deg] md:block">
          <Arrow className="mb-1 ml-24 h-16 w-28 -rotate-6" color="var(--color-accent-2)" />
          <p className="font-hand text-2xl leading-tight text-accent-2">
            psst — the lamp, the cat
            <br />
            &amp; the curtains are clickable
          </p>
        </div>
        <Star className="absolute right-[38%] bottom-[46vh] hidden h-6 w-6 md:block" color="var(--color-accent)" />
      </div>
    </section>
  )
}
