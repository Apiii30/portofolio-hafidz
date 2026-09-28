import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Room from './Room'
import CameraRig from './CameraRig'
import { ThemeDriver, themeMix } from './themeMix'
import { setState, useStore } from '../lib/store'

function Loaded() {
  useEffect(() => {
    setState({ sceneLoaded: true })
  }, [])
  return null
}

const lowPower = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4)

// Moonlight by night, morning sun through the same window by day.
const LIGHTING = {
  night: { bg: '#10121b', hemiSky: '#8d9be0', hemiGround: '#2a2238', hemi: 0.95, amb: '#6b74b3', ambI: 0.55, sun: '#9fb1ff', sunI: 0.9, exposure: 1.2, bloom: 0.9 },
  day: { bg: '#f3eadb', hemiSky: '#e6eeff', hemiGround: '#b89a82', hemi: 1.7, amb: '#fff4e4', ambI: 0.75, sun: '#fff0d2', sunI: 3.2, exposure: 1.05, bloom: 0.3 },
}

function Lighting({ bloom }) {
  const hemi = useRef()
  const amb = useRef()
  const sun = useRef()
  const stars = useRef()
  const c = useMemo(() => {
    const pair = (k) => [new THREE.Color(LIGHTING.night[k]), new THREE.Color(LIGHTING.day[k])]
    return { bg: pair('bg'), hemiSky: pair('hemiSky'), hemiGround: pair('hemiGround'), amb: pair('amb'), sun: pair('sun') }
  }, [])

  useFrame(({ scene, gl }) => {
    const m = themeMix.value
    const lerp = (k) => LIGHTING.night[k] + (LIGHTING.day[k] - LIGHTING.night[k]) * m
    scene.background.lerpColors(c.bg[0], c.bg[1], m)
    hemi.current.color.lerpColors(c.hemiSky[0], c.hemiSky[1], m)
    hemi.current.groundColor.lerpColors(c.hemiGround[0], c.hemiGround[1], m)
    hemi.current.intensity = lerp('hemi')
    amb.current.color.lerpColors(c.amb[0], c.amb[1], m)
    amb.current.intensity = lerp('ambI')
    sun.current.color.lerpColors(c.sun[0], c.sun[1], m)
    sun.current.intensity = lerp('sunI')
    gl.toneMappingExposure = lerp('exposure')
    stars.current.visible = m < 0.4
    if (bloom.current) bloom.current.intensity = lerp('bloom')
  })

  return (
    <>
      <color attach="background" args={[LIGHTING.night.bg]} />
      <hemisphereLight ref={hemi} />
      <ambientLight ref={amb} />
      <directionalLight
        ref={sun}
        position={[1.5, 6, -9]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0015}
      />
      <group ref={stars}>
        <Stars radius={40} depth={30} count={1200} factor={2.2} saturation={0} fade speed={0.4} />
      </group>
    </>
  )
}

export default function Scene() {
  const paused = useStore((s) => s.paused)
  const bloom = useRef()
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, lowPower ? 1.5 : 2]}
        camera={{ fov: 38, near: 0.1, far: 120, position: [8.2, 5.9, 8.8] }}
        gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
        }}
      >
        <ThemeDriver />
        <Lighting bloom={bloom} />
        <Suspense fallback={null}>
          <Room />
          <Loaded />
        </Suspense>
        <Sparkles count={40} scale={[9, 5, 9]} position={[0, 2.5, 0]} size={2.4} speed={0.25} color="#ffc857" opacity={0.6} />
        <CameraRig />
        {!lowPower && (
          <EffectComposer multisampling={0}>
            <Bloom ref={bloom} mipmapBlur intensity={LIGHTING.night.bloom} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
            <Vignette offset={0.3} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
