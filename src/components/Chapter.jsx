export default function Chapter({ n, children }) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent uppercase" data-reveal>
      <span className="grid h-7 w-7 place-items-center rounded-full border border-accent/60 text-[10px] tracking-normal">{n}</span>
      {children}
    </p>
  )
}
