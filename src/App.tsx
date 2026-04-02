import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function Box() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls />
    </>
  )
}

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Scene />
      </Canvas>
      <div className="ui-overlay">
        <h1>Vite + React + R3F (Bun)</h1>
        <p>ドラッグして回転、スクロールでズーム</p>
      </div>
    </div>
  )
}

export default App
