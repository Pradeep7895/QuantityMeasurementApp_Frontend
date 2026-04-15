import React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

// Reusable component: value input + unit dropdown for Q1/Q2
// Demonstrates: props passing, controlled inputs, component composition
function QuantityInput({ label, value, unit, units, onValueChange, onUnitChange }) {
  return (
    <div className="qty-block">
      <div className="qty-block__label">{label}</div>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <TextField
            label="Value"
            type="number"
            value={value}
            onChange={e => onValueChange(e.target.value)}
            size="small"
            fullWidth
            inputProps={{ step: 'any' }}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Unit"
            select
            value={unit}
            onChange={e => onUnitChange(e.target.value)}
            size="small"
            fullWidth
          >
            {units.map(u => (
              <MenuItem key={u} value={u}>{u}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </div>
  )
}

export default QuantityInput
