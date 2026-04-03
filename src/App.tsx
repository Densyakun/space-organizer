import React, { useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera, TransformControls } from '@react-three/drei'
import './App.css'
import ObjectManager from './components/ObjectManager'
import { ObjectsProvider, useObjects } from './contexts/ObjectsContext'

function Scene() {
  const { objects, selectedId, setObjects, transformMode } = useObjects()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {objects.map((o) => {
        const pos = [o.position.x, o.position.y, o.position.z] as [number, number, number]
        const rot = [o.rotation?.x ?? 0, o.rotation?.y ?? 0, o.rotation?.z ?? 0] as [number, number, number]
        const scl = [o.scale?.x ?? 1, o.scale?.y ?? 1, o.scale?.z ?? 1] as [number, number, number]
        const meshRef = useRef<THREE.Mesh>(null)

        return (
          <React.Fragment key={o.id}>
            {selectedId === o.id ? (
              <TransformControls
                mode={transformMode}
                key={o.id + '-tc'}
                onChange={() => {
                  const m = meshRef.current
                  if (!m) return
                  setObjects((list) => {
                    let changed = false
                    const next = list.map((it) => {
                      if (it.id !== o.id) return it
                      const eps = 1e-6
                      const samePos = Math.abs(it.position.x - m.position.x) < eps && Math.abs(it.position.y - m.position.y) < eps && Math.abs(it.position.z - m.position.z) < eps
                      const sameRot = Math.abs((it.rotation?.x ?? 0) - m.rotation.x) < eps && Math.abs((it.rotation?.y ?? 0) - m.rotation.y) < eps && Math.abs((it.rotation?.z ?? 0) - m.rotation.z) < eps
                      const sameScl = Math.abs((it.scale?.x ?? 1) - m.scale.x) < eps && Math.abs((it.scale?.y ?? 1) - m.scale.y) < eps && Math.abs((it.scale?.z ?? 1) - m.scale.z) < eps
                      if (samePos && sameRot && sameScl) return it
                      changed = true
                      return {
                        ...it,
                        position: { x: m.position.x, y: m.position.y, z: m.position.z },
                        rotation: { x: m.rotation.x, y: m.rotation.y, z: m.rotation.z },
                        scale: { x: m.scale.x, y: m.scale.y, z: m.scale.z },
                      }
                    })
                    return changed ? next : list
                  })
                }}
              >
                <mesh ref={meshRef} name={o.id} position={pos} rotation={rot} scale={scl}>
                  {o.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
                  <meshStandardMaterial color={o.color} />
                </mesh>
              </TransformControls>
            ) : (
              <mesh name={o.id} position={pos} rotation={rot} scale={scl}>
                {o.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
                <meshStandardMaterial color={o.color} />
              </mesh>
            )}
          </React.Fragment>
        )
      })}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls />
    </>
  )
}

function App() {
  return (
    <ObjectsProvider>
      <div id="canvas-container">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Scene />
        </Canvas>
        <div className="ui-overlay">
          <p>ドラッグして回転、スクロールでズーム</p>
          <ObjectManager />
        </div>
      </div>
    </ObjectsProvider>
  )
}

export default App
