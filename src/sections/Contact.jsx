import { useState } from 'react'
import Chapter from '../components/Chapter'
import { Underline, Star } from '../components/Doodles'
import { profile, socials, works } from '../data/profile'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" data-cam="door" aria-label="Contact" className="scene-section relative z-10 flex min-h-[130vh] flex-col justify-end">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-page via-page/75 via-50% to-transparent md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 bg-linear-to-r from-page/90 via-page/40 to-transparent mask-t-from-75% md:block" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-[40vh] md:px-10 md:pt-0">
        <div className="md:max-w-[52vw]">
          <Chapter n={works.length ? '06' : '05'}>The door's open</Chapter>
          <h2 className="font-display text-[12.5vw] leading-[0.88] md:text-[7vw]" data-reveal>
            Let's make
            <br />
            <span className="relative inline-block text-accent">
              something.
              <Underline className="absolute -bottom-2 left-0 h-4 w-full" color="var(--color-accent-2)" />
            </span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-fg/75" data-reveal>
            I'm looking for an internship — and open to junior roles too. If you've got a team I could learn from, I'd love to hear
            about it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-bold text-on-accent shadow-[4px_4px_0_var(--color-accent-2)] transition-transform hover:-translate-y-0.5"
            >
              {profile.email}
            </a>
            <button onClick={copy} className="rounded-full border-2 border-fg/30 px-5 py-3 font-mono text-xs tracking-wider uppercase hover:border-fg">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            {profile.cvUrl ? (
              <a href={profile.cvUrl} download className="rounded-full border-2 border-fg/30 px-5 py-3 font-mono text-xs tracking-wider uppercase hover:border-fg">
                Download CV ↓
              </a>
            ) : (
              <span className="sticker -rotate-3 bg-fg/10 text-fg/60 shadow-none">CV — coming soon</span>
            )}
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3" data-reveal>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer" className="group block">
                  <span className="block font-mono text-[11px] tracking-[0.2em] text-fg/60 uppercase">{s.label}</span>
                  <span className="font-hand text-2xl text-fg transition-colors group-hover:text-accent-2">{s.handle} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-24 flex flex-col gap-2 border-t border-fg/10 py-6 font-mono text-[11px] text-fg/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="flex items-center gap-2">
            <Star className="h-3 w-3" color="var(--color-accent)" /> made at night in Bandung
          </p>
        </footer>
      </div>
    </section>
  )
}
