import SceneSection from '../components/SceneSection'
import Chapter from '../components/Chapter'
import { Underline } from '../components/Doodles'
import { experience } from '../data/profile'
import { setState } from '../lib/store'

export default function Experience() {
  return (
    <SceneSection id="experience" cam="poster" side="right" label="Experience">
      <Chapter n="04">The poster on the wall</Chapter>
      <h2 className="font-display text-[11vw] leading-[0.95] sm:text-5xl md:text-6xl" data-reveal>
        Where I've
        <br />
        <span className="relative inline-block text-accent">
          put in hours.
          <Underline className="absolute -bottom-3 left-0 h-3 w-full" color="var(--color-accent-3)" />
        </span>
      </h2>

      <div className="mt-12 space-y-6">
        {experience.map((job, i) => (
          <article key={job.org} data-reveal={i % 2 ? 1.5 : -1.5} data-interactive className="card relative p-6 md:p-8">
            <span className={`sticker absolute -top-4 right-5 text-on-accent ${i % 2 ? '-rotate-3 bg-accent-2' : 'rotate-6 bg-accent-3'}`}>{job.type}</span>
            <p className="font-mono text-xs tracking-[0.15em] text-fg/60 uppercase">{job.period}</p>
            <h3 className="mt-2 font-display text-3xl text-fg">{job.role}</h3>
            <p className="font-hand text-2xl text-accent-2">@ {job.org}</p>
            <ul className="mt-5 space-y-2.5 text-fg/80">
              {job.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
            {job.certificate && (
              <button
                onClick={() => setState({ lightbox: job.certificate })}
                className="group mt-6 flex w-full items-center gap-4 rounded-xl border border-fg/15 p-2 pr-4 text-left transition-colors hover:border-accent"
              >
                <img src={job.certificate.thumb} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover sm:h-14 sm:w-20" loading="lazy" />
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] tracking-wider text-fg/60 uppercase">{job.certificate.issued}</span>
                  <span className="block font-display text-sm leading-tight text-fg sm:text-base">{job.certificate.title}</span>
                </span>
                <span className="ml-auto shrink-0 font-mono text-xs text-accent uppercase">View ↗</span>
              </button>
            )}
          </article>
        ))}
      </div>
    </SceneSection>
  )
}
