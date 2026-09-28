import { useStore } from '../lib/store'
import { toggleTheme } from '../lib/theme'

// A little wall light switch. Rocker up = daylight, down = night.
export default function ThemeSwitch() {
  const day = useStore((s) => s.theme === 'day')
  return (
    <button
      type="button"
      role="switch"
      aria-checked={day}
      aria-label="Daylight"
      title={day ? 'Close the curtains' : 'Open the curtains'}
      onClick={toggleTheme}
      className="group flex items-center gap-2 font-mono text-[11px] tracking-wider text-fg/70 uppercase transition-colors hover:text-fg"
    >
      <span className="relative block h-7 w-[22px] rounded-[6px] border border-fg/30 bg-page shadow-[1.5px_1.5px_0_var(--color-shadow)]">
        <span className="absolute top-[2px] left-1/2 h-[2px] w-[2px] -translate-x-1/2 rounded-full bg-fg/40" />
        <span className="absolute bottom-[2px] left-1/2 h-[2px] w-[2px] -translate-x-1/2 rounded-full bg-fg/40" />
        <span
          className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-[3px] bg-accent transition-[top] duration-300 ease-[cubic-bezier(.5,1.8,.5,1)] group-active:scale-90 ${
            day ? 'top-[4px]' : 'top-[12px]'
          }`}
        />
      </span>
      <span className="w-10 text-left">{day ? 'day' : 'night'}</span>
    </button>
  )
}
