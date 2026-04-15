import { useState, useCallback } from 'react'
import { UNITS, MEASUREMENT_TYPES, getUnitsForType } from '../services/units'

// Reusable hook: controlled measurement-type + unit dropdowns
export function useUnitSelects(defaultType = 'Length') {
  const [measurementType, setMeasurementType] = useState(defaultType)
  const [units, setUnits] = useState(getUnitsForType(defaultType))

  const handleTypeChange = useCallback((newType) => {
    setMeasurementType(newType)
    setUnits(getUnitsForType(newType))
  }, [])

  return { measurementType, units, handleTypeChange, MEASUREMENT_TYPES }
}
