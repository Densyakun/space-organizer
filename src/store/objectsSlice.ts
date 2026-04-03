import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Obj = {
  id: string
  type: 'box' | 'sphere'
  color: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

type ObjectsState = {
  objects: Obj[]
  selectedId: string | null
  transformMode: 'translate' | 'rotate' | 'scale'
}

const initialState: ObjectsState = {
  objects: [
    {
      id: 'obj-1',
      type: 'box',
      color: '#ff69b4',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  ],
  selectedId: 'obj-1',
  transformMode: 'translate',
}

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    setObjects(state, action: PayloadAction<Obj[]>) {
      state.objects = action.payload
    },
    addObject(state, action: PayloadAction<Obj>) {
      state.objects.push(action.payload)
      state.selectedId = action.payload.id
    },
    updateObject(state, action: PayloadAction<{ id: string; partial: Partial<Obj> }>) {
      const obj = state.objects.find((o) => o.id === action.payload.id)
      if (obj) {
        Object.assign(obj, action.payload.partial)
      }
    },
    removeObject(state, action: PayloadAction<string>) {
      state.objects = state.objects.filter((o) => o.id !== action.payload)
      if (state.selectedId === action.payload) {
        state.selectedId = state.objects.length > 0 ? state.objects[0].id : null
      }
    },
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload
    },
    setTransformMode(state, action: PayloadAction<'translate' | 'rotate' | 'scale'>) {
      state.transformMode = action.payload
    },
  },
})

export const { setObjects, addObject, updateObject, removeObject, setSelectedId, setTransformMode } = objectsSlice.actions
export default objectsSlice.reducer