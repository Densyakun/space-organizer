import { useState } from 'react'
import { Box, Button, TextField, Typography, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useObjects, type Obj } from '../contexts/ObjectsContext'

export default function ObjectManager() {
  const { objects, setObjects } = useObjects()
  const [selection, setSelection] = useState<string | null>(objects[0]?.id ?? null)

  function addObject() {
    const id = `obj-${Date.now()}`
    const o: Obj = { id, type: 'box', color: '#ffffff', x: 0, y: 0, z: 0 }
    setObjects((s) => [...s, o])
    setSelection(id)
  }

  function updateSelected(partial: Partial<Obj>) {
    if (!selection) return
    setObjects((list) => list.map((o) => (o.id === selection ? { ...o, ...partial } : o)))
  }

  function removeSelected() {
    if (!selection) return
    setObjects((list) => list.filter((o) => o.id !== selection))
    setSelection((prev) => {
      const remaining = objects.filter((o) => o.id !== prev)
      return remaining.length ? remaining[0].id : null
    })
  }

  const selObj = objects.find((o) => o.id === selection) || null

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
            value={selection ?? ''}
            label="選択"
            onChange={(e) => setSelection(e.target.value as string)}
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
              <TextField label="X" type="number" value={selObj.x} onChange={(e) => updateSelected({ x: Number(e.target.value) })} />
              <TextField label="Y" type="number" value={selObj.y} onChange={(e) => updateSelected({ y: Number(e.target.value) })} />
              <TextField label="Z" type="number" value={selObj.z} onChange={(e) => updateSelected({ z: Number(e.target.value) })} />
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="type-label">タイプ</InputLabel>
              <Select labelId="type-label" value={selObj.type} label="タイプ" onChange={(e) => updateSelected({ type: e.target.value as Obj['type'] })}>
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="sphere">Sphere</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Stack>
    </Box>
  )
}
