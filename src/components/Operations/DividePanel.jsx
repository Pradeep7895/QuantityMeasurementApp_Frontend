import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { divideQuantities } from '../../services/api'
import { useOperation } from '../../hooks/useOperation'
import { useUnitSelects } from '../../hooks/useUnitSelects'
import { getUnitsForType } from '../../services/units'
import QuantityInput from '../common/QuantityInput'
import ResultBox from '../common/ResultBox'

function DividePanel() {
  const [v1, setV1] = useState('')
  const [u1, setU1] = useState('FEET')
  const [v2, setV2] = useState('')
  const [u2, setU2] = useState('FEET')

  const { measurementType, units, handleTypeChange, MEASUREMENT_TYPES } = useUnitSelects('Length')
  const { loading, result, error, run, reset } = useOperation()

  const onTypeChange = (t) => {
    handleTypeChange(t)
    const first = getUnitsForType(t)[0] || ''
    setU1(first); setU2(first)
    reset()
  }

  // Normalize divide result — backend may return a plain number or object
  const normalizeDivideResult = (data) =>
    typeof data === 'object' ? data : { value: data, unit: '' }

  const handleDivide = async () => {
    if (!v1 || !v2) return
    reset()
    await run(async () => {
      const res = await divideQuantities(
        { value: parseFloat(v1), unit: u1, measurementType },
        { value: parseFloat(v2), unit: u2, measurementType }
      )
      // Wrap so useOperation can store it uniformly
      res.data = normalizeDivideResult(res.data)
      return res
    })
  }

  return (
    <div className="card">
      <div className="card-title">➗ Division</div>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField label="Measurement Type" select value={measurementType}
            onChange={e => onTypeChange(e.target.value)} size="small" fullWidth>
            {MEASUREMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <QuantityInput label="Dividend (Q1)" value={v1} unit={u1} units={units}
            onValueChange={v => { setV1(v); reset() }}
            onUnitChange={u => { setU1(u); reset() }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <QuantityInput label="Divisor (Q2)" value={v2} unit={u2} units={units}
            onValueChange={v => { setV2(v); reset() }}
            onUnitChange={u => { setU2(u); reset() }} />
        </Grid>
      </Grid>

      <Button variant="contained" fullWidth onClick={handleDivide}
        disabled={loading || !v1 || !v2}
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        sx={{ textTransform: 'none', background: '#2563eb', '&:hover': { background: '#1d4ed8' }, py: 1.2 }}>
        {loading ? 'Dividing…' : 'Divide'}
      </Button>

      <ResultBox result={result} error={error} />
    </div>
  )
}

export default DividePanel
