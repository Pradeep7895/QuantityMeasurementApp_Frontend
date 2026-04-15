// Mirrors your C# enums exactly
export const UNITS = {
  Length:      ['FEET', 'INCH', 'YARD', 'CENTIMETERS'],
  Weight:      ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
  Volume:      ['LITRE', 'MILLILITRE', 'GALLON'],
  Temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
}

export const MEASUREMENT_TYPES = Object.keys(UNITS)

export const getUnitsForType = (type) => UNITS[type] || []
