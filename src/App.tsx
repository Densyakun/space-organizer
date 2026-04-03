import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import './App.css'
import ObjectManager from './components/ObjectManager'
import { ObjectsProvider, useObjects } from './contexts/ObjectsContext'

function Scene() {
  const { objects } = useObjects()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {objects.map((o) => (
        <mesh key={o.id} position={[o.x, o.y, o.z]}>
          {o.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
          <meshStandardMaterial color={o.color} />
        </mesh>
      ))}
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
