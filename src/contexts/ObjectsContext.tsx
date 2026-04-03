import React, { createContext, useContext, useState } from 'react'

export type Obj = {
  id: string
  type: 'box' | 'sphere'
  color: string
  x: number
  y: number
  z: number
}

type Ctx = {
  objects: Obj[]
  setObjects: React.Dispatch<React.SetStateAction<Obj[]>>
}

const ObjectsContext = createContext<Ctx | null>(null)

export function ObjectsProvider({ children }: { children: React.ReactNode }) {
  const [objects, setObjects] = useState<Obj[]>([
    { id: 'obj-1', type: 'box', color: '#ff69b4', x: 0, y: 0, z: 0 },
  ])

  return <ObjectsContext.Provider value={{ objects, setObjects }}>{children}</ObjectsContext.Provider>
}

export function useObjects() {
  const ctx = useContext(ObjectsContext)
  if (!ctx) throw new Error('useObjects must be used within ObjectsProvider')
  return ctx
}

export default ObjectsContext
