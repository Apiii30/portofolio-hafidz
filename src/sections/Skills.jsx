import SceneSection from '../components/SceneSection'
import Chapter from '../components/Chapter'
import { Arrow } from '../components/Doodles'
import { skillGroups, shelfSkills, courses } from '../data/profile'
import { setState, useStore } from '../lib/store'

function Chip({ label }) {
  const onShelf = shelfSkills.includes(label)
  const hovered = useStore((s) => s.hoveredSkill === label)
  return (
    <li
      data-interactive
      onMouseEnter={() => onShelf && setState({ hoveredSkill: label })}
      onMouseLeave={() => onShelf && setState({ hoveredSkill: null })}
      className={`rounded-full border-2 px-3.5 py-1.5 font-mono text-sm transition-all duration-200 ${
        hovered ? '-translate-y-0.5 -rotate-2 border-accent bg-accent text-on-accent' : 'border-fg/20 text-fg/85'
      }`}
    >
      {label}
    </li>
  )
}

// A finished course. Hovering it nudges the matching thing on the shelf (the Python snake, say).
function CourseCard({ course }) {
  const hover = (on) => course.skill && setState({ hoveredSkill: on ? course.skill : null })
  return (
    <button
      data-interactive
      onClick={() => setState({ lightbox: course })}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
      className="card group relative flex w-full flex-col gap-4 p-3 text-left transition-colors hover:border-accent sm:flex-row sm:items-center sm:pr-5"
    >
      <span className="sticker absolute -top-3.5 right-4 rotate-3 bg-accent-3 text-on-accent">✓ passed</span>
      <img
        src={course.thumb}
        alt=""
        loading="lazy"
        className="aspect-[1.414] w-full shrink-0 rounded-lg object-cover shadow-[3px_3px_0_var(--color-shadow)] transition-transform duration-300 group-hover:-rotate-2 sm:w-36"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] tracking-wider text-fg/60 uppercase">
          {course.issuer} · {course.issued}
          {course.hours && ` · ${course.hours} hrs`}
        </span>
        <span className="mt-1 block font-display text-lg leading-tight text-fg">{course.title}</span>
        {course.covers && <span className="mt-1.5 block text-sm text-fg/70">{course.covers}</span>}
      </span>
      <span className="shrink-0 self-end font-mono text-xs text-accent uppercase sm:self-center">View ↗</span>
    </button>
  )
}

export default function Skills() {
  return (
    <SceneSection id="skills" cam="shelf" label="Skills">
      <Chapter n="03">The bookshelf</Chapter>
      <h2 className="font-display text-[11vw] leading-[0.95] sm:text-5xl md:text-6xl" data-reveal>
        Stuff I <span className="text-accent-2">know</span>
        <br />
        (and keep reading).
      </h2>
      <p className="mt-4 max-w-md text-fg/70" data-reveal>
        Every book, toy and sticker on that shelf is something I've built with. It gets more crowded every semester.
      </p>

      <div className="mt-10 space-y-7">
        {skillGroups.map((g) => (
          <div key={g.label} data-reveal>
            <p className="mb-3 font-hand text-xl text-accent">{g.label}</p>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <Chip key={s} label={s} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 hidden items-center gap-2 md:flex" data-reveal>
        <p className="rotate-[-3deg] font-hand text-xl text-accent-2">hover a chip — or anything on the shelf</p>
        <Arrow className="h-12 w-20 rotate-[-10deg]" color="var(--color-accent-2)" />
      </div>

      {courses.length > 0 && (
        // the camera zooms into the framed certificate on the shelf while this block is centered
        <div data-cam="certificate" className="mt-10 md:mt-[35vh] md:mb-[25vh]" data-reveal>
          <p className="mb-4 font-hand text-xl text-accent">Homework, signed & stamped</p>
          <div className="space-y-5">
            {courses.map((c) => (
              <CourseCard key={c.credentialId ?? c.title} course={c} />
            ))}
          </div>
        </div>
      )}
    </SceneSection>
  )
}
