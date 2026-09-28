import { useMemo } from 'react'
import { seeded } from '../three/textures'

// Five SVG layers of Bandung. Each layer is positioned by the parent's scroll timeline.
// Colours come from the --bdg-* variables in index.css, so the same drawing works for night and day;
// anything wrapped in .night-only (stars, lit windows' glow, street-lamp beams) fades out by day.
const VB = '0 0 1600 900'
const fill = (name) => ({ fill: `var(--bdg-${name})` })

export function SkyLayer() {
  const stars = useMemo(() => {
    const rnd = seeded(21)
    return Array.from({ length: 120 }, () => ({ x: rnd() * 1600, y: rnd() * 560, r: rnd() * 1.6 + 0.4, o: 0.3 + rnd() * 0.7, d: rnd() * 4 }))
  }, [])
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="moonGlow">
          <stop offset="0" style={{ stopColor: 'var(--bdg-sun-glow)' }} stopOpacity="0.4" />
          <stop offset="1" style={{ stopColor: 'var(--bdg-sun-glow)' }} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="night-only">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f1e6d2" opacity={s.o}>
            {i % 4 === 0 && <animate attributeName="opacity" values={`${s.o};0.1;${s.o}`} dur={`${3 + s.d}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>
    </svg>
  )
}

// The moon by night, the sun by day.
export function MoonLayer() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <circle cx="1180" cy="200" r="190" fill="url(#moonGlow)" />
      <circle cx="1180" cy="200" r="62" style={fill('sun')} />
      <g className="night-only" style={fill('crater')}>
        <circle cx="1160" cy="214" r="11" />
        <circle cx="1202" cy="184" r="7" />
        <circle cx="1196" cy="226" r="5" />
      </g>
    </svg>
  )
}

export function MountainLayer() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Tangkuban Perahu — the upturned boat */}
      <path d="M0 640C170 610 330 500 520 452L1030 440C1190 452 1380 540 1600 580V900H0Z" style={fill('mountain')} />
      <path d="M0 640C170 610 330 500 520 452L1030 440C1190 452 1380 540 1600 580" fill="none" style={{ stroke: 'var(--bdg-ridge)' }} strokeWidth="2.5" />
      <path d="M560 452c30 6 60 2 80-4M880 444c40 8 80 6 110 0" style={{ stroke: 'var(--bdg-ridge-line)' }} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="760" y="425" textAnchor="middle" fontFamily="Gochi Hand" fontSize="22" style={fill('label')} opacity="0.55">
        tangkuban perahu
      </text>
    </svg>
  )
}

export function HillLayer() {
  const lights = useMemo(() => {
    const rnd = seeded(5)
    return Array.from({ length: 70 }, () => ({ x: rnd() * 1600, y: 680 + rnd() * 120, c: rnd() > 0.75 }))
  }, [])
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M0 700C180 640 380 690 600 660S1010 610 1210 668 1500 640 1600 650V900H0Z" style={fill('hill')} />
      <g className="night-only">
        {lights.map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r="2.2" fill={l.c ? '#e98a9b' : '#ffc857'} opacity="0.8" />
        ))}
      </g>
    </svg>
  )
}

function Windows({ x, y, cols, rows, w = 10, h = 12, gx = 22, gy = 26, seed }) {
  const rnd = seeded(seed)
  const out = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (rnd() > 0.55) out.push(<rect key={`${r}-${c}`} x={x + c * gx} y={y + r * gy} width={w} height={h} rx="2" style={fill('window')} opacity={0.55 + rnd() * 0.45} />)
    }
  return out
}

export function CityLayer() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <g style={fill('city')}>
        <rect x="40" y="640" width="120" height="260" rx="6" />
        <rect x="180" y="600" width="90" height="300" rx="6" />
        <rect x="290" y="668" width="150" height="232" rx="6" />
        <rect x="1150" y="610" width="110" height="290" rx="6" />
        <rect x="1280" y="660" width="140" height="240" rx="6" />
        <rect x="1440" y="620" width="120" height="280" rx="6" />
      </g>
      <Windows x={60} y={660} cols={4} rows={8} seed={1} />
      <Windows x={196} y={620} cols={3} rows={10} seed={2} />
      <Windows x={310} y={690} cols={6} rows={7} seed={3} />
      <Windows x={1168} y={630} cols={4} rows={9} seed={4} />
      <Windows x={1300} y={680} cols={5} rows={7} seed={6} />
      <Windows x={1460} y={640} cols={4} rows={9} seed={8} />

      {/* Gedung Sate */}
      <g style={fill('sate')}>
        <rect x="520" y="720" width="560" height="180" rx="4" />
        <rect x="740" y="660" width="120" height="80" />
        <path d="M722 664h156l-22-26H744z" />
        <path d="M748 640h104l-18-22h-68z" />
        <path d="M768 620h64l-14-20h-36z" />
        <path d="M784 602h32l-10-18h-12z" />
        <rect x="797" y="500" width="6" height="90" />
      </g>
      {[510, 526, 542, 558, 574].map((cy) => (
        <circle key={cy} cx="800" cy={cy} r="6" style={fill('sate')} />
      ))}
      <circle cx="800" cy="494" r="5" style={fill('lamp-head')} />
      <g style={fill('sate-window')} opacity="0.85">
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${548 + i * 48} 800v-26a10 10 0 0 1 20 0v26z`} />
        ))}
        <rect x="786" y="684" width="28" height="36" rx="12" />
      </g>
      <text x="800" y="870" textAnchor="middle" fontFamily="Gochi Hand" fontSize="22" style={fill('label')} opacity="0.55">
        gedung sate
      </text>
    </svg>
  )
}

export function StreetLayer() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="0" y="812" width="1600" height="88" style={fill('street')} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 110 + 20} y="858" width="54" height="5" rx="2" style={fill('lane')} />
      ))}
      {[120, 520, 980, 1420].map((x) => (
        <g key={x}>
          <path className="night-only" d={`M${x - 60} 812 L${x} 700 L${x + 60} 812Z`} fill="#ffc857" fillOpacity="0.08" />
          <rect x={x - 3} y="700" width="6" height="112" style={fill('lamp-post')} />
          <circle cx={x} cy="700" r="8" style={fill('lamp-head')} />
        </g>
      ))}
      {[300, 760, 1200].map((x, i) => (
        <g key={x} style={fill('tree')}>
          <rect x={x - 5} y="760" width="10" height="52" />
          <circle cx={x} cy={740 - i * 6} r={38 + i * 4} />
          <circle cx={x - 30} cy={760} r={26} />
          <circle cx={x + 30} cy={758} r={28} />
        </g>
      ))}
    </svg>
  )
}

// A Bandung angkot, drawn in its own small box so it can drive across.
export function Angkot({ className = '' }) {
  return (
    <svg viewBox="0 0 260 120" className={className} aria-hidden="true">
      <path className="night-only" d="M252 70 L380 40 L380 110Z" fill="#ffc857" fillOpacity="0.15" />
      <rect x="10" y="20" width="220" height="74" rx="14" fill="#8fd4b0" />
      <rect x="10" y="62" width="220" height="10" fill="#e98a9b" />
      <path d="M200 20h14c10 0 16 8 18 20l2 22h-34z" fill="#8fd4b0" />
      <path d="M204 28h8c6 0 10 6 11 14l1 12h-20z" fill="#10121b" />
      {[26, 70, 114, 158].map((x) => (
        <rect key={x} x={x} y="28" width="36" height="26" rx="5" style={fill('window')} opacity="0.85" />
      ))}
      <rect x="70" y="6" width="96" height="16" rx="4" fill="#f1e6d2" />
      <text x="118" y="18.5" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" fontSize="11" fill="#10121b">
        DAGO
      </text>
      <circle cx="232" cy="72" r="5" fill="#fff4cc" />
      {[58, 186].map((x) => (
        <g key={x}>
          <circle cx={x} cy="96" r="17" fill="#10121b" />
          <circle cx={x} cy="96" r="7" fill="#3a4263" />
        </g>
      ))}
    </svg>
  )
}
