// Hand-drawn bits. Paths are deliberately wobbly.
// `color` can be any CSS color, including var(--color-…), so it's applied via style + currentColor.

export function Underline({ className = '', color = 'currentColor' }) {
  return (
    <svg className={`scribble pointer-events-none ${className}`} style={{ color }} viewBox="0 0 300 24" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M3 15c38-7 81-9 122-8 45 1 70 5 108 3 22-1 42-4 64-8M20 20c50-4 120-6 190-3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Arrow({ className = '', color = 'currentColor', flip = false }) {
  return (
    <svg className={`scribble pointer-events-none ${className}`} viewBox="0 0 160 90" fill="none" style={{ color, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden="true">
      <path pathLength="1" d="M6 70c18-30 50-52 86-50 20 1 34 12 30 24-4 13-26 12-28-2-3-18 18-32 56-30" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path pathLength="1" d="M138 4l14 9-12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Circle({ className = '', color = 'currentColor' }) {
  return (
    <svg className={`scribble pointer-events-none ${className}`} style={{ color }} viewBox="0 0 200 80" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M150 8C96 0 20 10 8 38c-10 24 50 36 104 34 50-2 86-16 82-38C190 14 140 6 90 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Star({ className = '', color = 'currentColor' }) {
  return (
    <svg className={`pointer-events-none ${className}`} style={{ color }} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2c1 10 4 16 18 18-13 2-17 7-18 18-2-11-6-16-18-18 12-2 16-8 18-18z" fill="currentColor" />
    </svg>
  )
}
