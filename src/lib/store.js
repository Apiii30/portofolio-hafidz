import { useSyncExternalStore } from 'react'

// Tiny shared state between the DOM and the 3D room.
let state = {
  sceneLoaded: false,
  ready: false,
  lampOn: true,
  hoveredSkill: null,
  paused: false,
  // { image, title, issuer, issued } while the full-size viewer is open
  lightbox: null,
  // set before React boots by the inline script in index.html
  theme: typeof document !== 'undefined' && document.documentElement.dataset.theme === 'day' ? 'day' : 'night',
}
const listeners = new Set()

export function setState(patch) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export function getState() {
  return state
}

export function useStore(selector) {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => selector(state),
  )
}
