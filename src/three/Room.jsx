import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Line, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import bowlbyFont from '@fontsource/bowlby-one/files/bowlby-one-latin-400-normal.woff?url'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff?url'
import { bookshelfRows, shelfLanguages, toolbox, experience, courses } from '../data/profile'
import { setState, useStore } from '../lib/store'
import { toggleTheme } from '../lib/theme'
import { byTheme, themeMix } from './themeMix'
import { palette, windowViewTexture, windowDayTexture, monitorTexture, oceanPosterTexture, polaroidTexture, seeded } from './textures'

const C = {
  wall: '#353b5e',
  wallDay: '#8f9bc9',
  wallTrim: '#2a2f4d',
  wallTrimDay: '#7280b3',
  floor: '#6e5468',
  floorDay: '#b3929a',
  wood: '#a37a5a',
  woodDark: '#6e4f45',
  shelf: '#8a6656',
  ...palette,
}

function Block({ args, color, radius = 0.03, rough = 0.85, children, ...props }) {
  return (
    <RoundedBox args={args} radius={radius} smoothness={2} castShadow receiveShadow {...props}>
      <meshStandardMaterial color={color} roughness={rough} />
      {children}
    </RoundedBox>
  )
}

// Flat box for walls and floor. With `dayColor`, the paint shifts as daylight comes in.
function Plain({ args, color, dayColor, ...props }) {
  const mat = useRef()
  const colors = useMemo(() => dayColor && [new THREE.Color(color), new THREE.Color(dayColor)], [color, dayColor])
  useFrame(() => colors && mat.current.color.lerpColors(colors[0], colors[1], themeMix.value))
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={args} />
      <meshStandardMaterial ref={mat} color={color} roughness={0.95} />
    </mesh>
  )
}

// Unlit, over-bright material that the bloom pass picks up. Dims to `dayIntensity` by day.
function Glow({ color, intensity = 3, dayIntensity = intensity }) {
  const mat = useRef()
  const base = useMemo(() => new THREE.Color(color), [color])
  useFrame(() => mat.current.color.copy(base).multiplyScalar(byTheme(intensity, dayIntensity)))
  return <meshBasicMaterial ref={mat} toneMapped={false} />
}

// A point light whose strength follows the day/night mix.
function ThemedLight({ night, day, ...props }) {
  const light = useRef()
  useFrame(() => (light.current.intensity = byTheme(night, day)))
  return <pointLight ref={light} intensity={night} {...props} />
}

function hoverCursor(setHover) {
  return {
    onPointerOver: (e) => {
      e.stopPropagation()
      setHover?.(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setHover?.(false)
      document.body.style.cursor = ''
    },
  }
}

// ─── shell ──────────────────────────────────────────────────────────
function Shell() {
  const view = useMemo(() => windowViewTexture(), [])
  const dayView = useMemo(() => windowDayTexture(), [])
  const dayMat = useRef()
  useFrame(() => (dayMat.current.opacity = themeMix.value))
  return (
    <group>
      <Plain args={[8.3, 0.3, 8.3]} position={[-0.15, -0.15, -0.15]} color={C.floor} dayColor={C.floorDay} />
      {/* floor boards */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-3.5 + i * 1.0, 0.002, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[0.012, 8]} />
          <meshBasicMaterial color="#4a3749" />
        </mesh>
      ))}

      {/* left wall */}
      <Plain args={[0.3, 4.5, 8.3]} position={[-4.15, 2.25, -0.15]} color={C.wall} dayColor={C.wallDay} />
      {/* back wall, built around the window opening (x -0.4..2.0, y 1.7..3.5) */}
      <Plain args={[3.9, 4.5, 0.3]} position={[-2.35, 2.25, -4.15]} color={C.wall} dayColor={C.wallDay} />
      <Plain args={[2.0, 4.5, 0.3]} position={[3.0, 2.25, -4.15]} color={C.wall} dayColor={C.wallDay} />
      <Plain args={[2.4, 1.7, 0.3]} position={[0.8, 0.85, -4.15]} color={C.wall} dayColor={C.wallDay} />
      <Plain args={[2.4, 1.0, 0.3]} position={[0.8, 4.0, -4.15]} color={C.wall} dayColor={C.wallDay} />
      {/* wainscot stripe */}
      <Plain args={[0.02, 1.0, 8.0]} position={[-3.99, 0.5, 0]} color={C.wallTrim} dayColor={C.wallTrimDay} />
      <Plain args={[8.0, 1.0, 0.02]} position={[0, 0.5, -3.99]} color={C.wallTrim} dayColor={C.wallTrimDay} />
      <Plain args={[0.03, 0.05, 8.0]} position={[-3.98, 1.0, 0]} color={C.cream} />
      <Plain args={[8.0, 0.05, 0.03]} position={[0, 1.0, -3.98]} color={C.cream} />

      {/* window frame */}
      <group>
        <Block args={[2.56, 0.1, 0.36]} position={[0.8, 3.5, -4.15]} color={C.cream} />
        <Block args={[2.76, 0.08, 0.5]} position={[0.8, 1.7, -4.02]} color={C.cream} />
        <Block args={[0.1, 1.8, 0.36]} position={[-0.4, 2.6, -4.15]} color={C.cream} />
        <Block args={[0.1, 1.8, 0.36]} position={[2.0, 2.6, -4.15]} color={C.cream} />
        <Block args={[0.05, 1.8, 0.05]} position={[0.8, 2.6, -4.15]} color={C.cream} />
        <Block args={[2.4, 0.05, 0.05]} position={[0.8, 2.75, -4.15]} color={C.cream} />
      </group>
      <mesh position={[0.8, 2.6, -4.9]}>
        <planeGeometry args={[4.6, 3.3]} />
        <meshBasicMaterial map={view} toneMapped={false} />
      </mesh>
      <mesh position={[0.8, 2.6, -4.89]}>
        <planeGeometry args={[4.6, 3.3]} />
        <meshBasicMaterial ref={dayMat} map={dayView} toneMapped={false} transparent opacity={themeMix.value} />
      </mesh>
      <Curtains />
    </group>
  )
}

// Drawn in a little at night, pulled open by day. Clicking them flips the theme.
function Curtains() {
  const left = useRef()
  const right = useRef()
  const [hover, setHover] = useState(false)
  useFrame(() => {
    left.current.position.x = byTheme(-0.46, -0.76)
    right.current.position.x = byTheme(2.06, 2.36)
  })
  const panel = (
    <>
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[(k - 1) * 0.11, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 2.3, 10]} />
          <meshStandardMaterial color={C.rose} roughness={1} emissive={C.rose} emissiveIntensity={hover ? 0.25 : 0} />
        </mesh>
      ))}
    </>
  )
  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        toggleTheme()
      }}
      {...hoverCursor(setHover)}
    >
      <mesh position={[0.8, 3.72, -3.9]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 3.4, 8]} />
        <meshStandardMaterial color={C.cream} />
      </mesh>
      <group ref={left} position={[-0.76, 2.55, -3.9]}>
        {panel}
      </group>
      <group ref={right} position={[2.36, 2.55, -3.9]}>
        {panel}
      </group>
    </group>
  )
}

// ─── fairy lights ───────────────────────────────────────────────────
function FairyLights() {
  const { points, bulbs } = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 120; i++) {
      const t = i / 120
      const x = -3.9 + t * 7.8
      const y = 4.2 - 0.32 * Math.abs(Math.sin(t * Math.PI * 4))
      pts.push(new THREE.Vector3(x, y, -3.96))
    }
    const b = []
    for (let i = 1; i < 28; i++) b.push(pts[Math.round((i / 28) * 120)])
    return { points: pts, bulbs: b }
  }, [])
  const group = useRef()
  useFrame(({ clock }) => {
    group.current.children.forEach((m, i) => {
      m.scale.setScalar(0.85 + Math.sin(clock.elapsedTime * 2 + i * 1.7) * 0.15)
    })
  })
  return (
    <group>
      <Line points={points} color="#0e0f16" lineWidth={1.5} />
      <group ref={group}>
        {bulbs.map((p, i) => (
          <mesh key={i} position={[p.x, p.y - 0.04, p.z + 0.02]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <Glow color={i % 3 === 0 ? C.rose : C.lamp} intensity={1.5} dayIntensity={0.95} />
          </mesh>
        ))}
      </group>
      <ThemedLight night={2.2} day={0.4} position={[0, 3.6, -3.4]} color={C.lamp} distance={5} decay={1.6} />
    </group>
  )
}

// ─── desk corner ────────────────────────────────────────────────────
function Lamp() {
  const lampOn = useStore((s) => s.lampOn)
  const ready = useStore((s) => s.ready)
  const light = useRef()
  const bulb = useRef()
  const [hover, setHover] = useState(false)
  useFrame((_, dt) => {
    // the sun does most of the work by day, so the lamp only adds a warm pool
    const target = ready && lampOn ? 9 * byTheme(1, 0.45) : 0
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, target, 4, dt)
    bulb.current.color.setScalar(0.15 + (light.current.intensity / 9) * 5)
  })
  return (
    <group
      position={[-3.6, 1.04, 0.15]}
      onClick={(e) => {
        e.stopPropagation()
        setState({ lampOn: !lampOn })
      }}
      {...hoverCursor(setHover)}
    >
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 20]} />
        <meshStandardMaterial color={hover ? C.lamp : C.ink} />
      </mesh>
      <mesh castShadow position={[0.08, 0.3, 0]} rotation-z={-0.35}>
        <cylinderGeometry args={[0.018, 0.018, 0.62, 8]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      <group position={[0.22, 0.6, 0]} rotation-z={-0.9}>
        <mesh castShadow>
          <coneGeometry args={[0.17, 0.24, 20, 1, true]} />
          <meshStandardMaterial color={C.lamp} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
      </group>
      <pointLight
        ref={light}
        position={[0.36, 0.45, 0]}
        color="#ffcf7a"
        intensity={0}
        distance={9}
        decay={1.4}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.004}
      />
    </group>
  )
}

function Desk() {
  const screen = useMemo(() => monitorTexture(), [])
  return (
    <group>
      <Block args={[1.1, 0.08, 2.8]} position={[-3.45, 1.0, -1.0]} color={C.wood} />
      {[
        [-3.05, -2.3],
        [-3.05, 0.3],
        [-3.85, -2.3],
        [-3.85, 0.3],
      ].map(([x, z], i) => (
        <Block key={i} args={[0.07, 0.96, 0.07]} position={[x, 0.48, z]} color={C.woodDark} />
      ))}
      <Block args={[0.95, 0.34, 0.6]} position={[-3.45, 0.78, -0.1]} color={C.cream} />
      <Block args={[0.04, 0.04, 0.22]} position={[-2.96, 0.8, -0.1]} color={C.ink} />

      {/* monitor */}
      <Block args={[0.06, 0.78, 1.26]} position={[-3.66, 1.63, -1.0]} color="#1b1f2e" radius={0.025} />
      <mesh position={[-3.626, 1.63, -1.0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[1.16, 0.7]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <Block args={[0.05, 0.26, 0.08]} position={[-3.7, 1.16, -1.0]} color="#1b1f2e" />
      <Block args={[0.32, 0.03, 0.36]} position={[-3.66, 1.055, -1.0]} color="#1b1f2e" />
      <pointLight position={[-3.1, 1.65, -1.0]} color="#8fb8ff" intensity={1.4} distance={2.4} decay={2} />

      {/* keyboard, mouse, mug, books */}
      <Block args={[0.28, 0.035, 0.85]} position={[-3.12, 1.058, -1.0]} color={C.cream} radius={0.012} />
      <Block args={[0.13, 0.04, 0.08]} position={[-3.1, 1.06, -0.4]} color={C.rose} radius={0.018} />
      <group position={[-3.25, 1.04, -2.05]}>
        <mesh castShadow position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.07, 0.065, 0.17, 16]} />
          <meshStandardMaterial color={C.rose} />
        </mesh>
        <mesh castShadow position={[0.08, 0.09, 0]}>
          <torusGeometry args={[0.04, 0.012, 8, 16]} />
          <meshStandardMaterial color={C.rose} />
        </mesh>
      </group>
      {[C.lamp, C.haze, C.cream].map((c, i) => (
        <Block key={i} args={[0.34, 0.06, 0.24]} position={[-3.62, 1.08 + i * 0.062, -2.12]} rotation-y={i * 0.18} color={c} radius={0.01} />
      ))}

      {/* chair */}
      <group position={[-2.55, 0, -0.95]} rotation-y={0.25}>
        <Block args={[0.62, 0.1, 0.62]} position={[0, 0.6, 0]} color={C.rose} radius={0.05} />
        <Block args={[0.1, 0.72, 0.6]} position={[0.3, 1.02, 0]} color={C.rose} radius={0.05} />
        <mesh castShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <mesh castShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.05, 5]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
      </group>
      <Lamp />
    </group>
  )
}

// ─── bookshelf of skills ────────────────────────────────────────────
const bookColors = [C.lamp, C.rose, C.cream, '#8fb8ff', '#8fd4b0', '#f2a071', '#c7a6e8']

// Hovering anything on the shelf lights up the matching chip in the Skills section, and vice versa.
function useSkillHover(label) {
  const hovered = useStore((s) => s.hoveredSkill === label)
  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation()
      setState({ hoveredSkill: label })
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setState({ hoveredSkill: null })
      document.body.style.cursor = ''
    },
  }
  return [hovered, handlers]
}

function Book({ label, x, y, w, h, color }) {
  const [hovered, handlers] = useSkillHover(label)
  const ref = useRef()
  const dark = color === C.cream || color === C.lamp || color === '#8fd4b0'
  useFrame((_, dt) => {
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, hovered ? 0.16 : 0, 10, dt)
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, hovered ? -0.12 : 0, 10, dt)
  })
  return (
    <group position={[x + w / 2, y, -3.72]}>
      <group ref={ref} {...handlers}>
        <Block args={[w, h, 0.34]} position={[0, h / 2, 0]} color={color} radius={0.012} />
        <Block args={[w + 0.004, 0.025, 0.345]} position={[0, h - 0.06, 0]} color={dark ? C.night : C.cream} radius={0.005} />
        <Text
          font={monoFont}
          fontSize={Math.min(0.048, w * 0.42)}
          color={dark ? C.night : C.ink}
          anchorX="center"
          anchorY="middle"
          position={[0, h / 2 - 0.03, 0.172]}
          rotation-z={Math.PI / 2}
          maxWidth={h}
        >
          {label.toUpperCase()}
        </Text>
      </group>
    </group>
  )
}

// Python: a two-tone coiled snake, blue and yellow like the logo.
function Snake() {
  const blue = <meshStandardMaterial color="#4b7bbd" roughness={0.6} />
  return (
    <group>
      <mesh castShadow position={[0, 0.035, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.075, 0.032, 10, 28]} />
        {blue}
      </mesh>
      <mesh castShadow position={[0, 0.095, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.055, 0.029, 10, 24]} />
        <meshStandardMaterial color="#f2c94c" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0.02, 0.15, 0.03]} rotation={[0.4, 0, -0.35]}>
        <capsuleGeometry args={[0.025, 0.07, 4, 8]} />
        {blue}
      </mesh>
      <mesh castShadow position={[0.045, 0.205, 0.055]} scale={[1.15, 0.85, 1.25]}>
        <sphereGeometry args={[0.036, 14, 12]} />
        {blue}
      </mesh>
      {[-0.016, 0.016].map((dx) => (
        <mesh key={dx} position={[0.045 + dx, 0.217, 0.094]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshBasicMaterial color={C.ink} />
        </mesh>
      ))}
      <mesh position={[0.045, 0.197, 0.11]}>
        <boxGeometry args={[0.006, 0.004, 0.03]} />
        <meshBasicMaterial color={C.rose} />
      </mesh>
    </group>
  )
}

// Java: a mug of coffee, still steaming.
function Mug() {
  const steam = useRef()
  useFrame(({ clock }) => {
    steam.current.children.forEach((puff, i) => {
      const t = (clock.elapsedTime * 0.35 + i / 3) % 1
      puff.position.y = 0.17 + t * 0.2
      puff.position.x = Math.sin(t * 6 + i) * 0.015
      puff.scale.setScalar(0.6 + t * 0.9)
      puff.material.opacity = Math.sin(t * Math.PI) * 0.5
    })
  })
  return (
    <group>
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.068, 0.062, 0.16, 22]} />
        <meshStandardMaterial color={C.cream} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.0685, 0.064, 0.03, 22]} />
        <meshStandardMaterial color="#e76f51" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.155, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.01, 20]} />
        <meshStandardMaterial color="#4a2c21" roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0.078, 0.085, 0]}>
        <torusGeometry args={[0.036, 0.011, 8, 18]} />
        <meshStandardMaterial color={C.cream} roughness={0.5} />
      </mesh>
      <Text font={bowlbyFont} fontSize={0.03} position={[0, 0.1, 0.07]} color="#e76f51">
        java
      </Text>
      <group ref={steam}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// Everything else is a wooden toy block with a letter on it.
const BLOCKS = { Kotlin: ['K', '#7f52ff'], 'C++': ['C++', '#1f6fb2'] }

function LetterBlock({ label }) {
  const [text, color] = BLOCKS[label] ?? [label.slice(0, 3), '#8fd4b0']
  const size = 0.14
  return (
    <group>
      <Block args={[size, size, size]} position={[0, size / 2, 0]} color={color} radius={0.02} />
      <Text font={bowlbyFont} fontSize={text.length > 1 ? size * 0.34 : size * 0.6} position={[0, size / 2, size / 2 + 0.002]} color="#ffffff">
        {text}
      </Text>
      <Text font={bowlbyFont} fontSize={size * 0.4} position={[0, size + 0.002, 0]} rotation-x={-Math.PI / 2} color="#ffffff" fillOpacity={0.85}>
        {text.slice(0, 1)}
      </Text>
    </group>
  )
}

const FIGURINES = { Python: Snake, Java: Mug }

// A little folded card in front of each collectible, like a museum label.
function ShelfTag({ label }) {
  return (
    <group position={[0, 0.032, 0.17]} rotation-x={-0.35}>
      <mesh>
        <planeGeometry args={[0.17, 0.052]} />
        <meshStandardMaterial color="#f7f0e2" roughness={0.9} />
      </mesh>
      <Text font={monoFont} fontSize={0.027} position={[0, 0, 0.001]} color={C.ink} anchorX="center" anchorY="middle">
        {label.toUpperCase()}
      </Text>
    </group>
  )
}

function Collectible({ label, x, rotation }) {
  const [hovered, handlers] = useSkillHover(label)
  const lift = useRef()
  const Figure = FIGURINES[label] ?? LetterBlock
  useFrame(({ clock }, dt) => {
    lift.current.position.y = THREE.MathUtils.damp(lift.current.position.y, hovered ? 0.07 : 0, 10, dt)
    const wobble = hovered ? Math.sin(clock.elapsedTime * 7) * 0.18 : 0
    lift.current.rotation.y = THREE.MathUtils.damp(lift.current.rotation.y, rotation + wobble, 10, dt)
  })
  return (
    <group position={[x, 0.725, -3.72]}>
      <group ref={lift} rotation-y={rotation} scale={1.25} {...handlers}>
        <Figure label={label} />
      </group>
      <ShelfTag label={label} />
    </group>
  )
}

const STICKER_COLORS = { Git: '#f05033', GitHub: '#24292f', Postman: '#ff6c37', 'VS Code': '#2f80ed', Figma: '#a259ff' }

function Sticker({ label, x, y, width, tilt, color }) {
  const [hovered, handlers] = useSkillHover(label)
  const ref = useRef()
  useFrame((_, dt) => ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, hovered ? 1.22 : 1, 12, dt)))
  return (
    <group ref={ref} position={[x, y, 0.173]} rotation-z={tilt} {...handlers}>
      <RoundedBox args={[width, 0.08, 0.006]} radius={0.003} smoothness={2}>
        <meshStandardMaterial color={color} roughness={0.4} />
      </RoundedBox>
      <Text font={monoFont} fontSize={0.036} position={[0, 0, 0.0035]} color="#ffffff" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}

// A tool box on the bottom shelf. Tools are stickers on the front; the lid pops open when one is hovered.
function Toolbox({ tools }) {
  const open = useStore((s) => tools.includes(s.hoveredSkill))
  const lid = useRef()
  useFrame((_, dt) => (lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, open ? -0.85 : 0, 8, dt)))

  const stickers = useMemo(() => {
    const rnd = seeded(8)
    const rows = [tools.slice(0, 3), tools.slice(3)]
    return rows.flatMap((row, r) => {
      const widths = row.map((t) => 0.05 + t.length * 0.025)
      const gap = 0.03
      let x = -(widths.reduce((a, b) => a + b, 0) + gap * (row.length - 1)) / 2
      return row.map((label, i) => {
        const item = { label, width: widths[i], x: x + widths[i] / 2, y: r === 0 ? 0.18 : 0.08, tilt: (rnd() - 0.5) * 0.14 }
        x += widths[i] + gap
        return { ...item, color: STICKER_COLORS[label] ?? bookColors[(r * 3 + i) % bookColors.length] }
      })
    })
  }, [tools])

  return (
    <group position={[-2.2, 0.075, -3.74]}>
      <Block args={[0.86, 0.26, 0.34]} position={[0, 0.13, 0]} color="#62a898" radius={0.02} />
      <group ref={lid} position={[0, 0.26, -0.17]}>
        <Block args={[0.88, 0.06, 0.352]} position={[0, 0.03, 0.17]} color="#74bcab" radius={0.02} />
        <Block args={[0.28, 0.025, 0.04]} position={[0, 0.1, 0.17]} color={C.ink} radius={0.01} />
        {[-0.12, 0.12].map((dx) => (
          <Block key={dx} args={[0.025, 0.05, 0.03]} position={[dx, 0.075, 0.17]} color={C.ink} radius={0.006} />
        ))}
      </group>
      {[-0.32, 0.32].map((dx) => (
        <Block key={dx} args={[0.06, 0.04, 0.02]} position={[dx, 0.235, 0.172]} color="#c9c3b6" radius={0.006} />
      ))}
      {/* what's inside, visible when the lid opens */}
      <group position={[0.12, 0.2, 0]} rotation={[0.2, 0, 1.3]}>
        <mesh castShadow position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 10]} />
          <meshStandardMaterial color={C.lamp} />
        </mesh>
        <mesh castShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
          <meshStandardMaterial color="#c9c3b6" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      <mesh castShadow position={[-0.15, 0.225, 0.02]} rotation={[0, 0.4, Math.PI / 2 - 0.1]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
        <meshStandardMaterial color={C.rose} />
      </mesh>
      {stickers.map((st) => (
        <Sticker key={st.label} {...st} />
      ))}
    </group>
  )
}

function Bookshelf() {
  const levels = [2.025, 1.375, 0.725]
  const books = useMemo(() => {
    const rnd = seeded(11)
    const out = []
    let ci = 0
    bookshelfRows.forEach((row, r) => {
      let x = -2.86
      row.forEach((label) => {
        const w = 0.13 + rnd() * 0.04
        const h = 0.44 + rnd() * 0.1
        out.push({ label, x, y: levels[r], w, h, color: bookColors[ci++ % bookColors.length] })
        x += w + 0.012
      })
    })
    return out
  }, [])

  // collectibles line up to the right of the third-row books
  const lastBook = books.filter((b) => b.y === levels[2]).at(-1)
  const start = lastBook ? lastBook.x + lastBook.w + 0.13 : -2.7
  const step = Math.min(0.24, (-1.63 - start) / Math.max(1, shelfLanguages.length - 1))

  return (
    <group>
      <Block args={[0.06, 2.64, 0.46]} position={[-2.92, 1.32, -3.77]} color={C.shelf} radius={0.015} />
      <Block args={[0.06, 2.64, 0.46]} position={[-1.48, 1.32, -3.77]} color={C.shelf} radius={0.015} />
      <Plain args={[1.44, 2.64, 0.03]} position={[-2.2, 1.32, -3.985]} color={C.woodDark} />
      {[0.05, 0.7, 1.35, 2.0, 2.62].map((y) => (
        <Block key={y} args={[1.46, 0.05, 0.46]} position={[-2.2, y, -3.77]} color={C.shelf} radius={0.012} />
      ))}
      {books.map((b) => (
        <Book key={b.label} {...b} />
      ))}
      {shelfLanguages.map((label, i) => (
        <Collectible key={label} label={label} x={start + i * step} rotation={[0.35, -0.2, 0.15, -0.3][i % 4]} />
      ))}
      <Toolbox tools={toolbox} />
      <ThemedLight night={0.9} day={0.4} position={[-2.2, 0.62, -3.2]} color="#ffd9a0" distance={1.6} decay={1.8} />
      {/* shelf decor */}
      <group position={[-1.75, 2.645, -3.75]}>
        <mesh castShadow position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.18, 12]} />
          <meshStandardMaterial color={C.cream} />
        </mesh>
        <mesh castShadow position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial color="#6fae8a" />
        </mesh>
      </group>
      <group position={[-1.75, 1.375, -3.7]}>
        <mesh castShadow position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.15, 16, 12]} />
          <meshStandardMaterial color="#8fb8ff" />
        </mesh>
        <mesh castShadow position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.04, 12]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
      </group>
    </group>
  )
}

// ─── bed + cat ──────────────────────────────────────────────────────
const catLines = ['mrrp?', 'meow.', '5 more minutes…', 'no bugs here', 'hire my human pls', 'zzz']

function Cat() {
  const group = useRef()
  const body = useRef()
  const jump = useRef(0)
  const [line, setLine] = useState(null)
  const count = useRef(0)
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    body.current.scale.y = 0.72 + Math.sin(t * 1.6) * 0.03
    jump.current = Math.max(0, jump.current - dt * 2.2)
    const j = jump.current
    group.current.position.y = 0.72 + Math.sin(j * Math.PI) * 0.35
    group.current.rotation.y = -0.6 + Math.sin(j * Math.PI) * 0.8
  })
  return (
    <group
      ref={group}
      position={[3.05, 0.72, -2.4]}
      rotation-y={-0.6}
      onClick={(e) => {
        e.stopPropagation()
        jump.current = 1
        setLine(catLines[count.current++ % catLines.length])
        clearTimeout(group.current.userData.timer)
        group.current.userData.timer = setTimeout(() => setLine(null), 1800)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <mesh ref={body} castShadow position={[0, 0.1, 0]} scale={[1.35, 0.72, 1]}>
        <sphereGeometry args={[0.2, 20, 16]} />
        <meshStandardMaterial color="#f0a35e" roughness={1} />
      </mesh>
      <group position={[0.24, 0.12, 0.1]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 18, 14]} />
          <meshStandardMaterial color="#f0a35e" roughness={1} />
        </mesh>
        {[-0.06, 0.06].map((z) => (
          <mesh key={z} castShadow position={[0.02, 0.11, z]} rotation-x={z * 3}>
            <coneGeometry args={[0.04, 0.08, 4]} />
            <meshStandardMaterial color="#e08a45" />
          </mesh>
        ))}
        {[-0.045, 0.045].map((z) => (
          <mesh key={z} position={[0.105, 0.02, z]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[0.04, 0.008]} />
            <meshBasicMaterial color={C.ink} side={THREE.DoubleSide} />
          </mesh>
        ))}
        <mesh position={[0.118, -0.02, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={C.rose} />
        </mesh>
      </group>
      <mesh castShadow position={[-0.05, 0.03, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.24, 0.035, 8, 24, Math.PI * 1.1]} />
        <meshStandardMaterial color="#e08a45" roughness={1} />
      </mesh>
      {line && (
        <Html position={[0.2, 0.5, 0]} center zIndexRange={[20, 0]}>
          <div className="font-hand whitespace-nowrap rounded-2xl bg-cream px-3 py-1 text-lg text-night shadow-[3px_3px_0_#10121b]">
            {line}
          </div>
        </Html>
      )}
    </group>
  )
}

function Bed() {
  return (
    <group>
      <Block args={[1.44, 0.34, 2.1]} position={[3.05, 0.22, -2.95]} color={C.woodDark} radius={0.05} />
      <Block args={[1.44, 1.1, 0.1]} position={[3.05, 0.62, -3.94]} color={C.woodDark} radius={0.04} />
      <Block args={[1.34, 0.22, 1.98]} position={[3.05, 0.5, -2.95]} color={C.cream} radius={0.08} />
      <Block args={[1.4, 0.1, 1.35]} position={[3.05, 0.62, -2.55]} color={C.rose} radius={0.05} />
      <Block args={[0.85, 0.16, 0.42]} position={[3.05, 0.7, -3.6]} rotation-x={-0.2} color="#fbf4e6" radius={0.08} />
      <Cat />
    </group>
  )
}

// ─── walls: poster, corkboard, door ─────────────────────────────────
function Poster() {
  const tex = useMemo(() => oceanPosterTexture(), [])
  return (
    <group position={[-3.97, 2.45, 1.7]}>
      <Block args={[0.05, 1.08, 0.86]} color={C.ink} radius={0.015} />
      <mesh position={[0.03, 0, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[0.76, 0.98]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  )
}

// A framed certificate, built facing +z. Click it to see it full size.
// `glowOn` lights the frame up when that skill is hovered anywhere on the page.
function CertificateFrame({ cert, width = 0.7, color = '#c9a35a', metal = 0.35, glowOn, rosette = false, ...props }) {
  const tex = useTexture(cert.thumb)
  tex.colorSpace = THREE.SRGBColorSpace
  const [hover, setHover] = useState(false)
  const linked = useStore((s) => !!glowOn && s.hoveredSkill === glowOn)
  const lit = hover || linked
  const frame = useRef()
  useFrame((_, dt) => {
    frame.current.position.z = THREE.MathUtils.damp(frame.current.position.z, lit ? 0.05 : 0, 10, dt)
  })
  const w = width
  const h = w / (tex.image.width / tex.image.height)
  return (
    <group {...props}>
      <group
        ref={frame}
        onClick={(e) => {
          e.stopPropagation()
          setState({ lightbox: cert })
        }}
        {...hoverCursor(setHover)}
      >
        <RoundedBox args={[w + 0.12, h + 0.12, 0.045]} radius={0.012} smoothness={2} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.45} metalness={metal} emissive={color} emissiveIntensity={lit ? 0.25 : 0} />
        </RoundedBox>
        <mesh position={[0, 0, 0.024]}>
          <planeGeometry args={[w + 0.06, h + 0.06]} />
          <meshStandardMaterial color="#f7f0e2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} roughness={0.7} />
        </mesh>
        {/* award rosette pinned to the corner */}
        {rosette && (
          <group position={[-w / 2 + 0.02, -h / 2 - 0.02, 0.05]}>
            {[-0.025, 0.025].map((dx, i) => (
              <mesh key={dx} position={[dx, -0.07, -0.005]} rotation-z={i ? -0.25 : 0.25}>
                <boxGeometry args={[0.035, 0.12, 0.004]} />
                <meshStandardMaterial color={C.rose} roughness={0.8} />
              </mesh>
            ))}
            <mesh rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
              <meshStandardMaterial color={C.lamp} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.007]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.032, 0.032, 0.006, 16]} />
              <meshStandardMaterial color={C.rose} roughness={0.5} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}

// The internship certificate hangs next to the ocean poster.
const internCert = experience.find((job) => job.certificate)?.certificate

// Course certificates lean against the wall on top of the bookshelf, left of the plant.
// The camera has its own close-up of this spot (SHOTS.certificate in CameraRig.jsx).
// A second certificate stands smaller, in front of the first.
const SHELF_SLOTS = [
  { x: -2.45, z: -3.86, w: 0.5, turn: 0.06 },
  { x: -2.1, z: -3.66, w: 0.36, turn: -0.18 },
]

function ShelfCertificates() {
  if (!courses.length) return null
  return (
    <group>
      {/* a warm spot so the paper reads clearly at night */}
      <ThemedLight night={0.9} day={0.25} position={[-2.3, 3.25, -3.1]} color="#ffeccc" distance={1.8} decay={1.6} />
      {courses.slice(0, SHELF_SLOTS.length).map((cert, i) => {
        const { x, z, w, turn } = SHELF_SLOTS[i]
        const h = w / 1.414 + 0.12
        return (
          <CertificateFrame
            key={cert.credentialId ?? cert.title}
            cert={cert}
            width={w}
            color={C.woodDark}
            metal={0}
            glowOn={cert.skill}
            position={[x, 2.645 + h / 2 + 0.005, z]}
            rotation={[-0.12, turn, 0]}
          />
        )
      })}
    </group>
  )
}

function Corkboard() {
  const photos = useMemo(() => {
    const rnd = seeded(3)
    const colors = [C.rose, '#8fb8ff', C.lamp, '#8fd4b0', '#c7a6e8']
    return colors.map((c, i) => ({
      tex: polaroidTexture(c, i + 2),
      x: -0.37 + (i % 3) * 0.37 + (rnd() - 0.5) * 0.06,
      y: i < 3 ? 0.18 : -0.2,
      r: (rnd() - 0.5) * 0.4,
      pin: bookColors[i],
    }))
  }, [])
  return (
    <group position={[3.18, 2.55, -3.97]}>
      <ThemedLight night={1.6} day={0.3} position={[-0.2, 0.9, 0.8]} color={C.lamp} distance={3} decay={1.6} />
      <Block args={[1.2, 1.0, 0.05]} color={C.woodDark} radius={0.02} />
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[1.08, 0.88]} />
        <meshStandardMaterial color="#b98b5e" roughness={1} />
      </mesh>
      {photos.map((p, i) => (
        <group key={i} position={[p.x + (i >= 3 ? 0.19 : 0), p.y, 0.03 + i * 0.002]} rotation-z={p.r}>
          <mesh castShadow>
            <planeGeometry args={[0.26, 0.31]} />
            <meshStandardMaterial map={p.tex} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.13, 0.01]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color={p.pin} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Door() {
  return (
    <group>
      <Block args={[0.06, 2.3, 1.16]} position={[-3.99, 1.15, 3.1]} color={C.cream} radius={0.02} />
      <Block args={[0.08, 2.2, 1.0]} position={[-3.96, 1.1, 3.1]} color="#4f5a8a" radius={0.02} />
      <Block args={[0.02, 0.8, 0.7]} position={[-3.915, 1.55, 3.1]} color="#46507c" radius={0.02} />
      <Block args={[0.02, 0.6, 0.7]} position={[-3.915, 0.5, 3.1]} color="#46507c" radius={0.02} />
      <mesh castShadow position={[-3.88, 1.05, 2.7]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={C.lamp} metalness={0.6} roughness={0.3} />
      </mesh>
      <Text font={bowlbyFont} fontSize={0.34} position={[-3.93, 2.72, 3.1]} rotation-y={Math.PI / 2} rotation-z={0.06}>
        say hi!
        <Glow color={C.rose} intensity={1.7} dayIntensity={1.05} />
      </Text>
      <ThemedLight night={2.5} day={0.5} position={[-3.4, 2.7, 3.1]} color={C.rose} distance={3.5} decay={1.6} />
      <Block args={[0.7, 0.03, 1.0]} position={[-3.4, 0.015, 3.1]} color={C.lamp} radius={0.01} />
    </group>
  )
}

// ─── floor bits ─────────────────────────────────────────────────────
function FloorBits() {
  return (
    <group>
      <mesh position={[0.7, 0.012, 0.5]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.02, 40]} />
        <meshStandardMaterial color="#b56d88" roughness={1} />
      </mesh>
      <mesh position={[0.7, 0.024, 0.5]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.02, 40]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>
      <mesh position={[0.7, 0.036, 0.5]} receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.02, 40]} />
        <meshStandardMaterial color="#b56d88" roughness={1} />
      </mesh>
      {/* beanbag */}
      <mesh position={[2.3, 0.34, 1.4]} scale={[1, 0.62, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.62, 24, 18]} />
        <meshStandardMaterial color={C.lamp} roughness={1} />
      </mesh>
      {/* plant */}
      <group position={[-3.5, 0, -3.5]}>
        <mesh castShadow position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.17, 0.44, 16]} />
          <meshStandardMaterial color={C.cream} />
        </mesh>
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 0.14, 0.75, Math.sin(a) * 0.14]} rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}>
              <capsuleGeometry args={[0.07, 0.6, 4, 8]} />
              <meshStandardMaterial color={i % 2 ? '#6fae8a' : '#4f8f6f'} roughness={1} />
            </mesh>
          )
        })}
      </group>
      {/* sneakers by the door */}
      {[2.6, 2.4].map((z, i) => (
        <Block key={z} args={[0.34, 0.12, 0.14]} position={[-3.3 + i * 0.05, 0.06, z]} rotation-y={i * 0.3} color={C.cream} radius={0.05} />
      ))}
    </group>
  )
}

export default function Room() {
  return (
    <group>
      <Shell />
      <FairyLights />
      <Desk />
      <Bookshelf />
      <Bed />
      <Poster />
      {internCert && (
        <CertificateFrame cert={internCert} rosette position={[-3.96, 2.28, 0.78]} rotation={[0.04, Math.PI / 2, 0]} />
      )}
      <ShelfCertificates />
      <Corkboard />
      <Door />
      <FloorBits />
    </group>
  )
}
