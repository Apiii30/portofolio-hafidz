import SceneSection from '../components/SceneSection'
import Chapter from '../components/Chapter'
import { works } from '../data/profile'

const tilts = ['-rotate-3', 'rotate-2', '-rotate-1']

// Only rendered when `works` in profile.js has entries (see App.jsx).
export default function Works() {
  return (
    <SceneSection id="design" cam="board" side="right" label="Design and editing">
      <Chapter n="05">The corkboard</Chapter>
      <h2 className="font-display text-[11vw] leading-[0.95] sm:text-5xl md:text-6xl" data-reveal>
        The other half
        <br />
        of my <span className="text-accent-2">brain</span>.
      </h2>
      <p className="mt-4 max-w-md text-fg/70" data-reveal>
        Graphic design, photo retouching and video edits. Pinned here because code isn't the only thing I make.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {works.map((w, i) => (
          <li key={w.title} data-reveal={i % 2 ? 3 : -3} data-interactive className={`bg-paper p-2 pb-8 shadow-[4px_4px_0_var(--color-shadow)] ${tilts[i % tilts.length]}`}>
            <img src={w.image} alt={w.title} className="aspect-[4/5] w-full object-cover" loading="lazy" />
            <p className="mt-2 font-hand text-lg text-night">{w.title}</p>
          </li>
        ))}
      </ul>
    </SceneSection>
  )
}
