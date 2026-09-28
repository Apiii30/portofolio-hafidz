// A chapter that floats over the 3D room. The camera frames `cam` while this section is centered.
export default function SceneSection({ id, cam, side = 'left', label, className = '', children }) {
  return (
    <section id={id} data-cam={cam} aria-label={label} className={`scene-section relative z-10 flex min-h-[150vh] items-end md:items-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-page via-page/75 via-50% to-transparent md:hidden" />
      <div
        className={`pointer-events-none absolute inset-y-0 hidden w-2/3 from-page/90 via-page/50 to-transparent mask-y-from-80% md:block ${
          side === 'left' ? 'left-0 bg-linear-to-r' : 'right-0 bg-linear-to-l'
        }`}
      />
      <div className={`relative mx-auto flex w-full max-w-7xl px-5 pt-[45vh] pb-20 md:px-10 md:py-24 ${side === 'right' ? 'md:justify-end' : ''}`}>
        <div className="w-full md:max-w-[min(580px,44vw)]">{children}</div>
      </div>
    </section>
  )
}
