import React from 'react'

// Reusable UI component — accepts result or error as props
function ResultBox({ result, error }) {
  // Conditional rendering: show nothing if no result and no error
  if (!result && !error) return null

  if (error) {
    return (
      <div className="result-box result-box--error">
        <div className="result-box__label">Error</div>
        <div className="result-box__value result-box__value--error">{error}</div>
      </div>
    )
  }

  const value = result.value !== undefined
    ? Number(result.value).toFixed(4)
    : JSON.stringify(result)
  const unit  = result.unit || ''

  return (
    <div className="result-box">
      <div className="result-box__label">Result</div>
      <div className="result-box__value">
        {value}{unit ? ` ${unit}` : ''}
      </div>
      {result.measurementType && (
        <div className="result-box__meta">Type: {result.measurementType}</div>
      )}
    </div>
  )
}

export default ResultBox
