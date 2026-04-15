import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { convertUnits } from '../../services/api'
import { useOperation } from '../../hooks/useOperation'
import { useUnitSelects } from '../../hooks/useUnitSelects'
import { getUnitsForType } from '../../services/units'
import ResultBox from '../common/ResultBox'

function ConvertPanel() {
  // Controlled inputs — state and controlled inputs
  const [value,      setValue]      = useState('')
  const [fromUnit,   setFromUnit]   = useState('FEET')
  const [toUnit,     setToUnit]     = useState('INCH')

  // Custom hooks — reusable UI logic
  const { measurementType, units, handleTypeChange, MEASUREMENT_TYPES } = useUnitSelects('Length')
  const { loading, result, error, run, reset } = useOperation()

  // Event handler — calls backend via Axios service
  const handleConvert = async () => {
    if (!value) return
    reset()
    await run(() =>
      convertUnits(
        { value: parseFloat(value), unit: fromUnit, measurementType },
        toUnit
      )
    )
  }

  // Sync unit dropdowns when type changes
  const onTypeChange = (newType) => {
    handleTypeChange(newType)
    const first = getUnitsForType(newType)[0] || ''
    setFromUnit(first)
    setToUnit(first)
    reset()
  }

  return (
    <div className="card">
      <div className="card-title">🔄 Unit Conversion</div>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Measurement Type"
            select
            value={measurementType}
            onChange={e => onTypeChange(e.target.value)}
            size="small"
            fullWidth
          >
            {MEASUREMENT_TYPES.map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Value"
            type="number"
            value={value}
            onChange={e => { setValue(e.target.value); reset() }}
            size="small"
            fullWidth
            placeholder="e.g. 12"
            inputProps={{ step: 'any' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <TextField
            label="From Unit"
            select
            value={fromUnit}
            onChange={e => { setFromUnit(e.target.value); reset() }}
            size="small"
            fullWidth
          >
            {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <TextField
            label="To Unit"
            select
            value={toUnit}
            onChange={e => { setToUnit(e.target.value); reset() }}
            size="small"
            fullWidth
          >
            {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        onClick={handleConvert}
        disabled={loading || !value}
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        sx={{ textTransform: 'none', background: '#2563eb', '&:hover': { background: '#1d4ed8' }, py: 1.2 }}
      >
        {loading ? 'Converting…' : 'Convert'}
      </Button>

      <ResultBox result={result} error={error} />
    </div>
  )
}

export default ConvertPanel
