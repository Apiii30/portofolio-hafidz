import { getState, setState } from './store'
import { reducedMotion } from './scroll'

const STORAGE_KEY = 'theme'
const META_COLOR = { night: '#10121b', day: '#f3eadb' }
let fadeTimer

export function setTheme(theme) {
  const root = document.documentElement
  if (!reducedMotion) {
    root.classList.add('theme-fade')
    clearTimeout(fadeTimer)
    fadeTimer = setTimeout(() => root.classList.remove('theme-fade'), 700)
  }
  root.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // private mode or blocked storage: the switch still works, it just won't be remembered
  }
  setState({ theme })
}

export function toggleTheme() {
  setTheme(getState().theme === 'day' ? 'night' : 'day')
}
