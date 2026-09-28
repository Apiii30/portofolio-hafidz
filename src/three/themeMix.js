import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { getState } from '../lib/store'
import { reducedMotion } from '../lib/scroll'

// 0 = night, 1 = day. Eased every frame so lights, sky and curtains cross-fade together.
export const themeMix = { value: getState().theme === 'day' ? 1 : 0 }

export const byTheme = (night, day) => night + (day - night) * themeMix.value

export function ThemeDriver() {
  useFrame((_, dt) => {
    const target = getState().theme === 'day' ? 1 : 0
    themeMix.value = reducedMotion ? target : THREE.MathUtils.damp(themeMix.value, target, 2.8, dt)
  })
  return null
}
