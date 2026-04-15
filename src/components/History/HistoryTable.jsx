import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Badge classes mapped to operation type — dynamic class binding
const BADGE_CLASS = {
  Convert:  'badge--convert',
  Add:      'badge--add',
  Subtract: 'badge--subtract',
  Divide:   'badge--divide',
}

function HistoryTable({ rows, loading }) {
  // Loading state rendering
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress size={28} sx={{ color: '#2563eb' }} />
      </Box>
    )
  }

  // Empty state rendering
  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Operation</th><th>Category</th>
              <th>Input</th><th>Result</th><th>Time</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={7} className="empty-row">No operations found.</td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Operation</th>
            <th>Category</th>
            <th>Input</th>
            <th>Result</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Rendering list — most recent first */}
          {[...rows].reverse().map(r => {
            const badgeCls  = BADGE_CLASS[r.operationType] || 'badge--unknown'
            const inputStr  = r.secondValue != null
              ? `${r.firstValue} ${r.firstUnit} & ${r.secondValue} ${r.secondUnit}`
              : `${r.firstValue ?? '–'} ${r.firstUnit ?? ''}`
            const dateStr   = r.createdAt
              ? new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
              : '–'

            return (
              <tr key={r.id}>
                <td style={{ color: '#aaa', fontSize: '0.78rem' }}>{r.id}</td>
                <td>
                  <span className={`badge ${badgeCls}`}>
                    {r.operationType || '–'}
                  </span>
                </td>
                <td style={{ color: '#888' }}>{r.category || '–'}</td>
                <td className="mono-val" style={{ fontSize: '0.8rem' }}>{inputStr}</td>
                <td>
                  {r.errorMessage
                    ? <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>{r.errorMessage}</span>
                    : <span className="mono-val">
                        {r.resultValue != null ? Number(r.resultValue).toFixed(4) : '–'} {r.resultUnit ?? ''}
                      </span>
                  }
                </td>
                <td style={{ color: '#aaa', fontSize: '0.78rem' }}>
                  {r.executionTimeMs != null ? `${r.executionTimeMs} ms` : '–'}
                </td>
                <td style={{ color: '#aaa', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>{dateStr}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
