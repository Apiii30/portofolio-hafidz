import SceneSection from '../components/SceneSection'
import Chapter from '../components/Chapter'
import { Circle } from '../components/Doodles'
import { projects } from '../data/profile'

const tilts = ['-rotate-1', 'rotate-[0.8deg]', '-rotate-[0.6deg]', 'rotate-1']

export default function Projects() {
  return (
    <SceneSection id="projects" cam="monitor" label="Projects" className="min-h-[160vh]">
      <Chapter n="02">Things I've built</Chapter>
      <h2 className="font-display text-[11vw] leading-[0.95] sm:text-5xl md:text-6xl" data-reveal>
        Off the{' '}
        <span className="relative inline-block">
          monitor
          <Circle className="absolute -inset-x-4 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+32px)]" color="var(--color-accent)" />
        </span>
        .
      </h2>
      <p className="mt-4 max-w-md text-fg/70" data-reveal>
        A few things I've shipped — a business of my own, side projects, and stuff I made just to see if I could.
      </p>

      <ol className="mt-10 space-y-5">
        {projects.map((p, i) => (
          <li
            key={p.title}
            data-reveal={i % 2 ? 2 : -2}
            data-interactive
            className={`card group relative p-5 transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 md:p-6 ${tilts[i % tilts.length]}`}
          >
            {p.highlight && <span className="sticker absolute -top-3.5 right-5 rotate-3 bg-accent-2 text-on-accent">{p.highlight}</span>}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl text-fg md:text-3xl">
                <span className="mr-3 font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                {p.title}
              </h3>
              <span className="font-mono text-xs text-fg/60">{p.year}</span>
            </div>
            <p className="mt-3 text-fg/75">{p.blurb}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <ul className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-full border border-fg/20 px-2.5 py-0.5 font-mono text-[11px] text-fg/70">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 font-mono text-xs uppercase">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="text-accent underline-offset-4 hover:underline">
                    Live ↗
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="text-fg/80 underline-offset-4 hover:underline">
                    Code ↗
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 rotate-[-2deg] font-hand text-xl text-accent-2" data-reveal>
        more on the way — this list is still growing ✦
      </p>
    </SceneSection>
  )
}
