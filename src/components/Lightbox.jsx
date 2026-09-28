import { useEffect, useRef } from 'react'
import { setState, useStore } from '../lib/store'
import { lockScroll } from '../lib/scroll'

// Full-size viewer for certificates. Built on <dialog> so Esc, focus trapping
// and the backdrop come from the browser.
export default function Lightbox() {
  const item = useStore((s) => s.lightbox)
  const dialog = useRef()

  useEffect(() => {
    const d = dialog.current
    if (item && !d.open) {
      d.showModal()
      lockScroll(true)
    } else if (!item && d.open) {
      d.close()
    }
  }, [item])

  const close = () => setState({ lightbox: null })

  return (
    <dialog
      ref={dialog}
      onClose={() => {
        lockScroll(false)
        close()
      }}
      onClick={(e) => e.target === dialog.current && close()}
      aria-label={item?.title}
      className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      {item && (
        <figure className="flex flex-col items-center">
          <img
            src={item.image}
            alt={`${item.title} — ${item.issuer}`}
            className="max-h-[78vh] w-auto max-w-[min(92vw,1100px)] rounded-md bg-paper p-2 shadow-[8px_8px_0_var(--color-shadow)]"
          />
          <figcaption className="mt-5 flex w-full max-w-[min(92vw,1100px)] flex-wrap items-center justify-between gap-3 text-cream">
            <span>
              <span className="block font-display text-xl">{item.title}</span>
              <span className="font-mono text-xs tracking-wider text-cream/70 uppercase">
                {item.issuer} · {item.issued}
              </span>
            </span>
            <span className="flex items-center gap-3 font-mono text-xs uppercase">
              <a href={item.image} target="_blank" rel="noreferrer" className="text-lamp underline-offset-4 hover:underline">
                Full size ↗
              </a>
              <button onClick={close} className="rounded-full border-2 border-cream/40 px-4 py-2 hover:border-cream" autoFocus>
                Close
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}
