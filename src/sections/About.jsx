import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/scroll'
import { setState } from '../lib/store'
import { profile } from '../data/profile'
import { Underline, Star, Arrow } from '../components/Doodles'
import { SkyLayer, MoonLayer, MountainLayer, HillLayer, CityLayer, StreetLayer, Angkot } from './BandungSkyline'

const beats = [
  {
    kicker: '01 — About',
    title: (
      <>
        Hi, I'm <span className="relative inline-block text-accent">Hafidz.<Underline className="absolute -bottom-2 left-0 h-3 w-full" color="var(--color-accent-2)" /></span>
      </>
    ),
    body: `I'm a ${profile.semester}th-semester ${profile.study} student (${profile.degree}) at ${profile.campus}, graduating in ${profile.graduation}. Yes, that Bandung — cold mornings, bad traffic, great food.`,
  },
  {
    kicker: 'What I do',
    title: <>Web things, end to end.</>,
    body: 'The table in Postgres, the route in Express, the button you click in React — I like knowing how the whole thing fits together.',
  },
  {
    kicker: 'Off the clock',
    title: <>Pixels, frames &amp; cuts.</>,
    body: "I do graphic design and edit photos and videos — which is why I also run communications for HIMAMI, our student association. Right now I'm looking for an internship where I can ship real work and learn from people better than me.",
  },
]

function Polaroid() {
  if (!profile.photo) return null
  return (
    <figure
      data-photo
      className={`absolute right-5 bottom-[20vh] w-[42vw] max-w-[220px] rotate-[5deg] md:right-auto md:bottom-auto md:left-[54%] md:top-[20vh] md:w-[min(300px,22vw)] md:max-w-none ${
        reducedMotion ? 'hidden md:block' : ''
      }`}
    >
      <div data-intro="photo">
        <div className="relative bg-paper p-2.5 pb-12 shadow-[6px_6px_0_var(--color-shadow)] md:p-3 md:pb-16">
          <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-lamp/70" aria-hidden="true" />
          <img
            src={profile.photo}
            alt={profile.name}
            width="886"
            height="886"
            className="aspect-square w-full object-cover object-[50%_30%]"
          />
          <figcaption className="absolute bottom-3 left-4 font-hand text-xl text-night md:bottom-4 md:text-2xl">that's me :)</figcaption>
        </div>
        <Arrow flip className="absolute top-[18%] -left-32 hidden h-16 w-28 md:block" color="var(--color-accent-2)" />
      </div>
    </figure>
  )
}

export default function About() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const pinSpan = { trigger: root.current, start: 'top top', end: 'bottom bottom' }

      ScrollTrigger.create({ ...pinSpan, onToggle: (self) => setState({ paused: self.isActive }) })
      if (reducedMotion) {
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...pinSpan, scrub: 0.6 } })
      tl.fromTo(q('[data-layer="moon"]'), { yPercent: -8 }, { yPercent: 10, duration: 10 }, 0)
        .fromTo(q('[data-layer="sky"]'), { yPercent: 0 }, { yPercent: -6, duration: 10 }, 0)
        .fromTo(q('[data-layer="mountain"]'), { yPercent: 22 }, { yPercent: 0, duration: 5 }, 0)
        .fromTo(q('[data-layer="hill"]'), { yPercent: 38 }, { yPercent: 0, duration: 5.5 }, 0)
        .fromTo(q('[data-layer="city"]'), { yPercent: 55 }, { yPercent: 0, duration: 6 }, 0)
        .fromTo(q('[data-layer="street"]'), { yPercent: 70 }, { yPercent: 0, duration: 6.5 }, 0)
        .fromTo(q('[data-angkot]'), { xPercent: -120 }, { xPercent: 620, duration: 4.5 }, 5.5)

      const [a, b, c] = q('[data-beat]')
      const photo = q('[data-photo]')

      // The first beat and the photo arrive while the section is still sliding in,
      // so the sky is never empty when it locks into place. This animates the inner
      // wrappers; the pinned timeline below only fades the outer elements out, so the
      // two never fight over the same element.
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 10%', scrub: 0.6 } })
        .fromTo(q('[data-intro="beat"]'), { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0)
        .fromTo(q('[data-intro="photo"]'), { autoAlpha: 0, y: 160, rotate: 11 }, { autoAlpha: 1, y: 0, rotate: 0, ease: 'none' }, 0.15)
        .add(() => q('[data-photo] .scribble').forEach((s) => s.classList.add('is-in')), 0.9)

      const out = { immediateRender: false, duration: 1 }
      tl.fromTo(a, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -60, ...out }, 2.4)
        .fromTo(photo, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -100, ...out }, 2.4)
        .fromTo(b, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 3.3)
        .to(b, { autoAlpha: 0, y: -60, duration: 1 }, 6.2)
        .fromTo(c, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 6.8)
        .to({}, { duration: 1.5 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* the window view melts into the sky */}
      <div className="relative z-10 h-[70vh] pointer-events-none bg-linear-to-b from-transparent to-(--bdg-sky-top)" data-cam="window" data-cam-at="-0.3" />
      <section
        id="about"
        ref={root}
        className="relative z-10 h-[420vh] bg-(--bdg-sky-top)"
        data-cam="window"
        data-cam-at="3.2"
        aria-label="About me"
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-linear-to-b from-(--bdg-sky-top) via-(--bdg-sky-mid) via-45% to-(--bdg-sky-low)">
          <div data-layer="sky" className="absolute inset-0"><SkyLayer /></div>
          <div data-layer="moon" className="absolute inset-0"><MoonLayer /></div>
          <div data-layer="mountain" className="absolute inset-0"><MountainLayer /></div>
          <div data-layer="hill" className="absolute inset-0"><HillLayer /></div>
          <div data-layer="city" className="absolute inset-0"><CityLayer /></div>
          <div data-layer="street" className="absolute inset-0"><StreetLayer /></div>
          <div className="absolute bottom-[4%] left-0 w-[34vw] min-w-[180px] max-w-[320px]" data-angkot>
            <Angkot className="w-full" />
          </div>
          <Polaroid />

          <div className="relative mx-auto grid h-full max-w-7xl items-start px-5 pt-28 md:px-10 md:pt-[16vh]">
            {beats.map((beat, i) => (
              <article
                key={i}
                data-beat
                className={`max-w-xl ${reducedMotion ? 'mb-10' : `col-start-1 row-start-1 ${i > 0 ? 'opacity-0' : ''}`}`}
              >
                <div data-intro={i === 0 ? 'beat' : undefined}>
                  <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    <Star className="h-3 w-3" color="var(--color-accent-2)" /> {beat.kicker}
                  </p>
                  <h2 className="font-display text-[11vw] leading-[0.95] text-fg sm:text-5xl md:text-7xl">{beat.title}</h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">{beat.body}</p>
                  {i === 0 && (
                    <p className="mt-5 inline-block -rotate-2 font-hand text-xl text-accent-2">↓ keep scrolling, we're going downtown</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div className="relative z-10 h-[40vh] pointer-events-none bg-linear-to-b from-(--bdg-street) to-transparent" />
    </>
  )
}
