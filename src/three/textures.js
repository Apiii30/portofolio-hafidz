import * as THREE from 'three'

export const palette = {
  ink: '#10121b',
  night: '#171a26',
  dusk: '#242a40',
  haze: '#3a4263',
  cream: '#f1e6d2',
  lamp: '#ffc857',
  rose: '#e98a9b',
}

export function seeded(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// What you see through the window: Bandung at night, Tangkuban Perahu on the horizon.
export function windowViewTexture() {
  return canvasTexture(1024, 768, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#12152a')
    sky.addColorStop(0.35, '#232a52')
    sky.addColorStop(0.55, '#4b4175')
    sky.addColorStop(0.7, '#7a5680')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)

    const rnd = seeded(7)
    for (let i = 0; i < 140; i++) {
      const r = rnd() * 1.6 + 0.4
      g.globalAlpha = 0.3 + rnd() * 0.7
      g.fillStyle = palette.cream
      g.beginPath()
      g.arc(rnd() * w, rnd() * h * 0.5, r, 0, Math.PI * 2)
      g.fill()
    }
    g.globalAlpha = 1

    // moon
    const mx = w * 0.62
    const my = h * 0.36
    const glow = g.createRadialGradient(mx, my, 10, mx, my, 150)
    glow.addColorStop(0, 'rgba(241,230,210,0.35)')
    glow.addColorStop(1, 'rgba(241,230,210,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, w, h)
    g.fillStyle = palette.cream
    g.beginPath()
    g.arc(mx, my, 34, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#e2d4bb'
    g.beginPath()
    g.arc(mx - 12, my + 8, 8, 0, Math.PI * 2)
    g.arc(mx + 14, my - 10, 5, 0, Math.PI * 2)
    g.fill()

    // Tangkuban Perahu — the "upturned boat"
    g.fillStyle = '#34345e'
    g.beginPath()
    g.moveTo(0, h * 0.7)
    g.bezierCurveTo(w * 0.2, h * 0.64, w * 0.28, h * 0.55, w * 0.38, h * 0.53)
    g.lineTo(w * 0.6, h * 0.52)
    g.bezierCurveTo(w * 0.7, h * 0.54, w * 0.82, h * 0.62, w, h * 0.66)
    g.lineTo(w, h)
    g.lineTo(0, h)
    g.fill()

    g.fillStyle = '#23254a'
    g.beginPath()
    g.moveTo(0, h * 0.66)
    for (let x = 0; x <= w; x += 64) g.lineTo(x, h * (0.63 + Math.sin(x * 0.012) * 0.02))
    g.lineTo(w, h)
    g.lineTo(0, h)
    g.fill()

    // city lights
    for (let i = 0; i < 260; i++) {
      const x = rnd() * w
      const y = h * (0.64 + rnd() * 0.3)
      g.fillStyle = rnd() > 0.8 ? palette.rose : palette.lamp
      g.globalAlpha = 0.5 + rnd() * 0.5
      g.fillRect(x, y, 2 + rnd() * 2, 2 + rnd() * 2)
    }
    g.globalAlpha = 1
  })
}

// Same view in the morning: sun where the moon was, haze on the mountain, rooftops instead of lights.
export function windowDayTexture() {
  return canvasTexture(1024, 768, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#6fa6d8')
    sky.addColorStop(0.4, '#a9cdea')
    sky.addColorStop(0.62, '#f4dcc0')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)

    const mx = w * 0.62
    const my = h * 0.36
    const glow = g.createRadialGradient(mx, my, 10, mx, my, 170)
    glow.addColorStop(0, 'rgba(255,244,214,0.8)')
    glow.addColorStop(1, 'rgba(255,244,214,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#fff4d6'
    g.beginPath()
    g.arc(mx, my, 34, 0, Math.PI * 2)
    g.fill()

    // a few lazy clouds
    const rnd = seeded(12)
    g.fillStyle = 'rgba(255,255,255,0.85)'
    for (let i = 0; i < 5; i++) {
      const cx = w * (0.2 + rnd() * 0.6)
      const cy = h * (0.22 + rnd() * 0.18)
      for (let k = 0; k < 4; k++) {
        g.beginPath()
        g.ellipse(cx + k * 22 - 33, cy + (k % 2) * -8, 30 + rnd() * 10, 14 + rnd() * 6, 0, 0, Math.PI * 2)
        g.fill()
      }
    }

    g.fillStyle = '#8ea3c6'
    g.beginPath()
    g.moveTo(0, h * 0.7)
    g.bezierCurveTo(w * 0.2, h * 0.64, w * 0.28, h * 0.55, w * 0.38, h * 0.53)
    g.lineTo(w * 0.6, h * 0.52)
    g.bezierCurveTo(w * 0.7, h * 0.54, w * 0.82, h * 0.62, w, h * 0.66)
    g.lineTo(w, h)
    g.lineTo(0, h)
    g.fill()

    g.fillStyle = '#6f9786'
    g.beginPath()
    g.moveTo(0, h * 0.66)
    for (let x = 0; x <= w; x += 64) g.lineTo(x, h * (0.63 + Math.sin(x * 0.012) * 0.02))
    g.lineTo(w, h)
    g.lineTo(0, h)
    g.fill()

    for (let i = 0; i < 140; i++) {
      const bw = 8 + rnd() * 18
      const bh = 6 + rnd() * 22
      const x = rnd() * w
      const y = h * (0.68 + rnd() * 0.28)
      g.fillStyle = rnd() > 0.7 ? '#e9dfcc' : rnd() > 0.5 ? '#c96f4f' : '#58698f'
      g.fillRect(x, y - bh, bw, bh)
    }
  })
}

export function monitorTexture() {
  return canvasTexture(640, 400, (g, w, h) => {
    g.fillStyle = '#0f1119'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#1b1f2e'
    g.fillRect(0, 0, w, 34)
    ;['#e98a9b', '#ffc857', '#8fd4b0'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      g.arc(22 + i * 22, 17, 6, 0, Math.PI * 2)
      g.fill()
    })
    g.fillStyle = '#7b83a6'
    g.font = '15px "JetBrains Mono", monospace'
    g.fillText('hafidz.js', 100, 22)

    const lines = [
      [['const ', '#e98a9b'], ['hafidz', '#f1e6d2'], [' = {', '#7b83a6']],
      [['  role', '#8fb8ff'], [': ', '#7b83a6'], ["'full-stack dev'", '#ffc857'], [',', '#7b83a6']],
      [['  based', '#8fb8ff'], [': ', '#7b83a6'], ["'Bandung, ID'", '#ffc857'], [',', '#7b83a6']],
      [['  stack', '#8fb8ff'], [': [', '#7b83a6'], ["'react'", '#ffc857'], [', ', '#7b83a6'], ["'node'", '#ffc857'], [', ', '#7b83a6'], ["'pg'", '#ffc857'], ['],', '#7b83a6']],
      [['  coffee', '#8fb8ff'], [': ', '#7b83a6'], ['Infinity', '#e98a9b'], [',', '#7b83a6']],
      [['  status', '#8fb8ff'], [': ', '#7b83a6'], ["'open to intern'", '#8fd4b0'], [',', '#7b83a6']],
      [['}', '#7b83a6']],
      [],
      [['hafidz', '#f1e6d2'], ['.', '#7b83a6'], ['build', '#8fb8ff'], ['(', '#7b83a6'], ['yourIdea', '#f1e6d2'], [')', '#7b83a6']],
    ]
    g.font = '22px "JetBrains Mono", monospace'
    lines.forEach((tokens, row) => {
      let x = 56
      const y = 78 + row * 34
      g.fillStyle = '#3a4263'
      g.fillText(String(row + 1).padStart(2, ' '), 14, y)
      tokens.forEach(([text, color]) => {
        g.fillStyle = color
        g.fillText(text, x, y)
        x += g.measureText(text).width
      })
      if (row === lines.length - 1) {
        g.fillStyle = '#ffc857'
        g.fillRect(x + 6, y - 20, 12, 26)
      }
    })
  })
}

export function oceanPosterTexture() {
  return canvasTexture(400, 520, (g, w, h) => {
    g.fillStyle = palette.cream
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#e9b2a0'
    g.beginPath()
    g.arc(w * 0.68, h * 0.26, 62, 0, Math.PI * 2)
    g.fill()
    const blues = ['#6f9fd8', '#4b78b8', '#355a95', '#243f73', '#182b52']
    blues.forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      const base = h * 0.42 + i * 52
      g.moveTo(0, base)
      for (let x = 0; x <= w; x += 10) g.lineTo(x, base + Math.sin(x * 0.03 + i * 1.3) * 14)
      g.lineTo(w, h)
      g.lineTo(0, h)
      g.fill()
    })
    g.fillStyle = palette.cream
    g.font = 'bold 44px "Bowlby One", sans-serif'
    g.fillText('OCEAN', 32, h - 92)
    g.font = '26px "Gochi Hand", cursive'
    g.fillText('young guards · 6 mo', 34, h - 52)
  })
}

export function polaroidTexture(color, seed) {
  return canvasTexture(200, 240, (g, w, h) => {
    g.fillStyle = '#f7f0e2'
    g.fillRect(0, 0, w, h)
    g.fillStyle = color
    g.fillRect(14, 14, w - 28, h - 70)
    const rnd = seeded(seed)
    g.fillStyle = 'rgba(16,18,27,0.25)'
    for (let i = 0; i < 3; i++) {
      g.beginPath()
      g.arc(30 + rnd() * 140, 40 + rnd() * 110, 12 + rnd() * 26, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#3a4263'
    g.font = '24px "Gochi Hand", cursive'
    g.fillText('soon!', 20, h - 22)
  })
}
