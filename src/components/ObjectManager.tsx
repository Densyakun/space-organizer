import { useEffect } from 'react'
import { Box, Button, TextField, Typography, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import { addObject, updateObject, removeObject, setSelectedId, setTransformMode, type Obj } from '../store/objectsSlice'

export default function ObjectManager() {
  const dispatch = useAppDispatch()
  const objects = useAppSelector((state) => state.objects.objects)
  const selectedId = useAppSelector((state) => state.objects.selectedId)
  const transformMode = useAppSelector((state) => state.objects.transformMode)

  function handleAddObject() {
    const id = `obj-${Date.now()}`
    const o: Obj = {
      id,
      type: 'box',
      color: '#ffffff',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    }
    dispatch(addObject(o))
  }

  function handleUpdateSelected(partial: Partial<Obj>) {
    if (!selectedId) return
    dispatch(updateObject({ id: selectedId, partial }))
  }

  function handleRemoveSelected() {
    if (!selectedId) return
    dispatch(removeObject(selectedId))
  }

  const selObj = objects.find((o) => o.id === selectedId) || null

  useEffect(() => {
    if (!selectedId && objects.length) dispatch(setSelectedId(objects[0].id))
  }, [objects, selectedId, dispatch])

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', p: 2, borderRadius: 1, width: 320, color: 'black' }}>
      <Stack spacing={1}>
        <Typography variant="h6">オブジェクト管理</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleAddObject}>追加</Button>
          <Button variant="outlined" color="error" onClick={handleRemoveSelected} disabled={!selObj}>削除</Button>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="select-obj-label">選択</InputLabel>
          <Select
            labelId="select-obj-label"
            value={selectedId ?? ''}
            label="選択"
            onChange={(e) => dispatch(setSelectedId((e.target.value as string) || null))}
          >
            {objects.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.id} - {o.type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selObj && (
          <>
            <TextField label="色" type="color" value={selObj.color} onChange={(e) => handleUpdateSelected({ color: e.target.value })} />
            <Stack direction="row" spacing={1}>
              <TextField label="X" type="number" value={selObj.position.x} onChange={(e) => handleUpdateSelected({ position: { ...selObj.position, x: Number(e.target.value) } })} />
              <TextField label="Y" type="number" value={selObj.position.y} onChange={(e) => handleUpdateSelected({ position: { ...selObj.position, y: Number(e.target.value) } })} />
              <TextField label="Z" type="number" value={selObj.position.z} onChange={(e) => handleUpdateSelected({ position: { ...selObj.position, z: Number(e.target.value) } })} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField label="Rot X" type="number" value={selObj.rotation.x} onChange={(e) => handleUpdateSelected({ rotation: { ...selObj.rotation, x: Number(e.target.value) } })} />
              <TextField label="Rot Y" type="number" value={selObj.rotation.y} onChange={(e) => handleUpdateSelected({ rotation: { ...selObj.rotation, y: Number(e.target.value) } })} />
              <TextField label="Rot Z" type="number" value={selObj.rotation.z} onChange={(e) => handleUpdateSelected({ rotation: { ...selObj.rotation, z: Number(e.target.value) } })} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField label="Scl X" type="number" value={selObj.scale.x} onChange={(e) => handleUpdateSelected({ scale: { ...selObj.scale, x: Number(e.target.value) } })} />
              <TextField label="Scl Y" type="number" value={selObj.scale.y} onChange={(e) => handleUpdateSelected({ scale: { ...selObj.scale, y: Number(e.target.value) } })} />
              <TextField label="Scl Z" type="number" value={selObj.scale.z} onChange={(e) => handleUpdateSelected({ scale: { ...selObj.scale, z: Number(e.target.value) } })} />
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="type-label">タイプ</InputLabel>
              <Select labelId="type-label" value={selObj.type} label="タイプ" onChange={(e) => handleUpdateSelected({ type: e.target.value as Obj['type'] })}>
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="sphere">Sphere</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="mode-label">操作モード</InputLabel>
              <Select labelId="mode-label" value={transformMode} label="操作モード" onChange={(e) => dispatch(setTransformMode(e.target.value as 'translate' | 'rotate' | 'scale'))}>
                <MenuItem value="translate">移動</MenuItem>
                <MenuItem value="rotate">回転</MenuItem>
                <MenuItem value="scale">拡縮</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Stack>
    </Box>
  )
}