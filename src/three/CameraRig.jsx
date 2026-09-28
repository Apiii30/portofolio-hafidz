import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from '../lib/scroll'

// One camera shot per [data-cam] marker in the page.
// shift moves the subject sideways on screen so text can sit next to it.
export const SHOTS = {
  hero: { pos: [9.4, 6.6, 9.9], look: [-0.2, 1.2, -0.8], shift: 0.2, mobile: { k: 1.3, shiftY: -0.17 } },
  window: { pos: [0.8, 2.62, -2.45], look: [0.8, 2.62, -5], shift: 0, close: true },
  monitor: { pos: [-0.55, 2.2, -0.2], look: [-3.5, 1.5, -1.1], shift: 0.22 },
  shelf: { pos: [-0.75, 1.9, 0.2], look: [-2.2, 1.4, -3.8], shift: 0.2 },
  poster: { pos: [-0.35, 2.15, 2.55], look: [-3.97, 2.3, 1.3], shift: -0.2 },
  board: { pos: [2.75, 2.3, -1.2], look: [3.15, 2.5, -3.97], shift: -0.2 },
  door: { pos: [0.6, 2.3, 5.6], look: [-3.5, 1.6, 2.7], shift: 0.16 },
}

const smooth = (t) => t * t * (3 - 2 * t)

function measure() {
  const vh = window.innerHeight
  return [...document.querySelectorAll('[data-cam]')]
    .map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY
      const at = el.dataset.camAt
      const a = at !== undefined ? top + parseFloat(at) * vh : top + el.offsetHeight / 2 - vh / 2
      return { a: Math.max(0, a), shot: SHOTS[el.dataset.cam] }
    })
    .sort((x, y) => x.a - y.a)
}

function framed(shot, aspect) {
  const portrait = aspect < 1
  const pos = new THREE.Vector3(...shot.pos)
  const look = new THREE.Vector3(...shot.look)
  let shiftY = 0
  if (portrait && !shot.close) {
    const k = shot.mobile?.k ?? THREE.MathUtils.clamp(0.72 / aspect, 1, 1.75)
    pos.sub(look).multiplyScalar(k).add(look)
    shiftY = shot.mobile?.shiftY ?? 0.18
  }
  return { pos, look, shiftX: portrait ? 0 : shot.shift, shiftY }
}

export default function CameraRig() {
  const { camera, size } = useThree()
  const anchors = useRef([])
  const cur = useRef(null)
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), dir: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3() }),
    [],
  )

  useEffect(() => {
    const update = () => (anchors.current = measure())
    update()
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    window.addEventListener('resize', update)
    document.fonts?.ready.then(update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    camera.fov = size.width < size.height ? 50 : 38
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((state, dt) => {
    const list = anchors.current
    if (!list.length) return
    const aspect = size.width / size.height
    const y = window.scrollY

    let i = 0
    while (i < list.length - 1 && y > list[i + 1].a) i++
    const A = framed(list[i].shot, aspect)
    const B = framed(list[Math.min(i + 1, list.length - 1)].shot, aspect)
    const span = list[Math.min(i + 1, list.length - 1)].a - list[i].a
    let t = span > 0 ? THREE.MathUtils.clamp((y - list[i].a) / span, 0, 1) : 0
    // hold still near each shot so there's time to read
    t = smooth(THREE.MathUtils.clamp((t - 0.12) / 0.76, 0, 1))

    tmp.pos.lerpVectors(A.pos, B.pos, t)
    tmp.look.lerpVectors(A.look, B.look, t)
    const shiftX = THREE.MathUtils.lerp(A.shiftX, B.shiftX, t)
    const shiftY = THREE.MathUtils.lerp(A.shiftY, B.shiftY, t)

    if (!cur.current) {
      cur.current = { pos: tmp.pos.clone(), look: tmp.look.clone(), shiftX, shiftY }
    }
    const c = cur.current
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 4)
    c.pos.lerp(tmp.pos, k)
    c.look.lerp(tmp.look, k)
    c.shiftX += (shiftX - c.shiftX) * k
    c.shiftY += (shiftY - c.shiftY) * k

    // a little sway following the pointer
    camera.position.copy(c.pos)
    if (!reducedMotion) {
      const dist = c.pos.distanceTo(c.look)
      tmp.dir.subVectors(c.look, c.pos).normalize()
      tmp.right.crossVectors(tmp.dir, camera.up).normalize()
      tmp.up.crossVectors(tmp.right, tmp.dir)
      camera.position.addScaledVector(tmp.right, state.pointer.x * dist * 0.025)
      camera.position.addScaledVector(tmp.up, state.pointer.y * dist * 0.015)
    }
    camera.lookAt(c.look)

    const w = size.width
    const h = size.height
    camera.setViewOffset(w, h, -c.shiftX * w, c.shiftY * h, w, h)
  })

  return null
}
