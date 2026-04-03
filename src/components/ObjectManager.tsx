import { useEffect } from 'react'
import { Box, Button, TextField, Typography, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useObjects, type Obj } from '../contexts/ObjectsContext'

export default function ObjectManager() {
  const { objects, setObjects, selectedId, setSelectedId, transformMode, setTransformMode } = useObjects()

  function addObject() {
    const id = `obj-${Date.now()}`
    const o: Obj = {
      id,
      type: 'box',
      color: '#ffffff',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    }
    setObjects((s) => [...s, o])
    setSelectedId(id)
  }

  function updateSelected(partial: Partial<Obj>) {
    if (!selectedId) return
    setObjects((list) => list.map((o) => (o.id === selectedId ? { ...o, ...partial } : o)))
  }

  function removeSelected() {
    if (!selectedId) return
    setObjects((list) => list.filter((o) => o.id !== selectedId))
    const remaining = objects.filter((o) => o.id !== selectedId)
    setSelectedId(remaining.length ? remaining[0].id : null)
  }

  const selObj = objects.find((o) => o.id === selectedId) || null

  useEffect(() => {
    if (!selectedId && objects.length) setSelectedId(objects[0].id)
  }, [objects, selectedId, setSelectedId])

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', p: 2, borderRadius: 1, width: 320, color: 'black' }}>
      <Stack spacing={1}>
        <Typography variant="h6">オブジェクト管理</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={addObject}>追加</Button>
          <Button variant="outlined" color="error" onClick={removeSelected} disabled={!selObj}>削除</Button>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="select-obj-label">選択</InputLabel>
          <Select
            labelId="select-obj-label"
            value={selectedId ?? ''}
            label="選択"
            onChange={(e) => setSelectedId((e.target.value as string) || null)}
          >
            {objects.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.id} - {o.type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selObj && (
          <>
            <TextField label="色" type="color" value={selObj.color} onChange={(e) => updateSelected({ color: e.target.value })} />
            <Stack direction="row" spacing={1}>
              <TextField label="X" type="number" value={selObj.position.x} onChange={(e) => updateSelected({ position: { ...selObj.position, x: Number(e.target.value) } })} />
              <TextField label="Y" type="number" value={selObj.position.y} onChange={(e) => updateSelected({ position: { ...selObj.position, y: Number(e.target.value) } })} />
              <TextField label="Z" type="number" value={selObj.position.z} onChange={(e) => updateSelected({ position: { ...selObj.position, z: Number(e.target.value) } })} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField label="Rot X" type="number" value={selObj.rotation.x} onChange={(e) => updateSelected({ rotation: { ...selObj.rotation, x: Number(e.target.value) } })} />
              <TextField label="Rot Y" type="number" value={selObj.rotation.y} onChange={(e) => updateSelected({ rotation: { ...selObj.rotation, y: Number(e.target.value) } })} />
              <TextField label="Rot Z" type="number" value={selObj.rotation.z} onChange={(e) => updateSelected({ rotation: { ...selObj.rotation, z: Number(e.target.value) } })} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField label="Scl X" type="number" value={selObj.scale.x} onChange={(e) => updateSelected({ scale: { ...selObj.scale, x: Number(e.target.value) } })} />
              <TextField label="Scl Y" type="number" value={selObj.scale.y} onChange={(e) => updateSelected({ scale: { ...selObj.scale, y: Number(e.target.value) } })} />
              <TextField label="Scl Z" type="number" value={selObj.scale.z} onChange={(e) => updateSelected({ scale: { ...selObj.scale, z: Number(e.target.value) } })} />
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="type-label">タイプ</InputLabel>
              <Select labelId="type-label" value={selObj.type} label="タイプ" onChange={(e) => updateSelected({ type: e.target.value as Obj['type'] })}>
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="sphere">Sphere</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="mode-label">操作モード</InputLabel>
              <Select labelId="mode-label" value={transformMode} label="操作モード" onChange={(e) => setTransformMode(e.target.value as any)}>
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
