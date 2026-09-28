import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bowlby-one'
import '@fontsource/karla/400.css'
import '@fontsource/karla/700.css'
import '@fontsource/gochi-hand'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import './index.css'
import App from './App'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
