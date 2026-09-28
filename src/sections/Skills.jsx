import SceneSection from '../components/SceneSection'
import Chapter from '../components/Chapter'
import { Arrow } from '../components/Doodles'
import { skillGroups, shelfSkills } from '../data/profile'
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
    </SceneSection>
  )
}
