import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera, TransformControls } from '@react-three/drei'
import { Provider } from 'react-redux'
import { store } from './store'
import { useAppSelector, useAppDispatch } from './hooks/useRedux'
import { setObjects } from './store/objectsSlice'
import './App.css'
import ObjectManager from './components/ObjectManager'

function Scene() {
  const dispatch = useAppDispatch()
  const objects = useAppSelector((state) => state.objects.objects)
  const selectedId = useAppSelector((state) => state.objects.selectedId)
  const transformMode = useAppSelector((state) => state.objects.transformMode)
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({})
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId
  const objectsRef = useRef(objects)
  objectsRef.current = objects

  useEffect(() => {
    const currentIds = new Set(objects.map((o) => o.id))
    Object.keys(meshRefs.current).forEach((id) => {
      if (!currentIds.has(id)) {
        delete meshRefs.current[id]
      }
    })
  }, [objects])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {objects.map((o) => {
        const pos = [o.position.x, o.position.y, o.position.z] as [number, number, number]
        const rot = [o.rotation?.x ?? 0, o.rotation?.y ?? 0, o.rotation?.z ?? 0] as [number, number, number]
        const scl = [o.scale?.x ?? 1, o.scale?.y ?? 1, o.scale?.z ?? 1] as [number, number, number]

        return (
          <React.Fragment key={o.id}>
            {selectedId === o.id ? (
              <mesh
                ref={(el) => (meshRefs.current[o.id] = el)}
                name={o.id}
                position={pos}
                rotation={rot}
                scale={scl}
              >
                {o.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
                <meshStandardMaterial color={o.color} />
              </mesh>
            ) : (
              <mesh ref={(el) => (meshRefs.current[o.id] = el)} name={o.id} position={pos} rotation={rot} scale={scl}>
                {o.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
                <meshStandardMaterial color={o.color} />
              </mesh>
            )}
          </React.Fragment>
        )
      })}
      {selectedId && meshRefs.current[selectedId] && (
        <TransformControls
          mode={transformMode}
          object={meshRefs.current[selectedId]}
          onChange={() => {
            const currentSelectedId = selectedIdRef.current
            const m = meshRefs.current[currentSelectedId]
            if (!m) return
            dispatch(setObjects(objectsRef.current.map((it) => {
              if (it.id !== currentSelectedId) return it
              const eps = 1e-6
              const samePos = Math.abs(it.position.x - m.position.x) < eps && Math.abs(it.position.y - m.position.y) < eps && Math.abs(it.position.z - m.position.z) < eps
              const sameRot = Math.abs((it.rotation.x) - m.rotation.x) < eps && Math.abs((it.rotation.y) - m.rotation.y) < eps && Math.abs((it.rotation.z) - m.rotation.z) < eps
              const sameScl = Math.abs((it.scale.x) - m.scale.x) < eps && Math.abs((it.scale.y) - m.scale.y) < eps && Math.abs((it.scale.z) - m.scale.z) < eps
              if (samePos && sameRot && sameScl) return it
              return {
                ...it,
                position: { x: m.position.x, y: m.position.y, z: m.position.z },
                rotation: { x: m.rotation.x, y: m.rotation.y, z: m.rotation.z },
                scale: { x: m.scale.x, y: m.scale.y, z: m.scale.z },
              }
            })))
          }}
        />
      )}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls makeDefault />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
