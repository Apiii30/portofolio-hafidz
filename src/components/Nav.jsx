import { useEffect, useState } from 'react'
import { scrollToTarget } from '../lib/scroll'
import { useStore } from '../lib/store'
import ThemeSwitch from './ThemeSwitch'
import { works } from '../data/profile'

const links = [
  { id: 'top', label: 'Room' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'design', label: 'Design', hidden: works.length === 0 },
  { id: 'contact', label: 'Contact' },
].filter((l) => !l.hidden)

function useBandungTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Nav() {
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)
  const lampOn = useStore((s) => s.lampOn)
  const time = useBandungTime()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (id) => {
    setOpen(false)
    scrollToTarget(`#${id}`)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <button onClick={() => go('top')} className="font-hand text-2xl text-fg md:text-3xl" aria-label="Back to top">
          hafidz<span className="text-accent">.</span>
        </button>
        <nav className="hidden items-center gap-1 rounded-full border border-fg/15 bg-surface/90 p-1 lg:flex" aria-label="Sections">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                active === id ? 'bg-accent text-on-accent' : 'text-fg/70 hover:text-fg'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 rounded-full border border-fg/15 bg-surface/90 py-1 pr-2 pl-2 sm:pl-4">
            <p className="hidden font-mono text-[11px] text-fg/70 sm:block">
              <span className={lampOn ? 'text-accent' : 'text-fg/40'}>●</span> {time} in Bandung
            </p>
            <ThemeSwitch />
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-fg/20 bg-surface/90 px-4 py-2 font-mono text-[11px] tracking-wider uppercase lg:hidden"
            aria-expanded={open}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-page/95 px-6 lg:hidden">
          {links.map(({ id, label }, i) => (
            <button key={id} onClick={() => go(id)} className="flex items-baseline gap-4 text-left font-display text-5xl text-fg">
              <span className="font-mono text-xs text-accent">0{i}</span>
              <span className={active === id ? 'text-accent' : ''}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
