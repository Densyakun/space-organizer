import React, { createContext, useContext, useState } from 'react'

export type Obj = {
  id: string
  type: 'box' | 'sphere'
  color: string
  // transform
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

type Ctx = {
  objects: Obj[]
  setObjects: React.Dispatch<React.SetStateAction<Obj[]>>
  selectedId: string | null
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
  transformMode: 'translate' | 'rotate' | 'scale'
  setTransformMode: React.Dispatch<React.SetStateAction<'translate' | 'rotate' | 'scale'>>
}

const ObjectsContext = createContext<Ctx | null>(null)

export function ObjectsProvider({ children }: { children: React.ReactNode }) {
  const [objects, setObjects] = useState<Obj[]>([
    {
      id: 'obj-1',
      type: 'box',
      color: '#ff69b4',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate')

  return (
    <ObjectsContext.Provider
      value={{ objects, setObjects, selectedId, setSelectedId, transformMode, setTransformMode }}
    >
      {children}
    </ObjectsContext.Provider>
  )
}

export function useObjects() {
  const ctx = useContext(ObjectsContext)
  if (!ctx) throw new Error('useObjects must be used within ObjectsProvider')
  return ctx
}

export default ObjectsContext
