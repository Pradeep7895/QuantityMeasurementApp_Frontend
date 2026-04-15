import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getHistory, getHistoryCount } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StatCard from './StatCard'
import HistoryTable from './HistoryTable'
import styles from './History.module.scss'

const FILTERS = ['All', 'Convert', 'Add', 'Subtract', 'Divide']

function History() {
  const navigate             = useNavigate()
  const { isLoggedIn, jwt }  = useAuth()

  // Component state
  const [allRows,    setAllRows]    = useState([])
  const [filtered,   setFiltered]   = useState([])
  const [count,      setCount]      = useState('–')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  // Derived stats from history array
  const stats = {
    total:      count,
    conversions: allRows.filter(r => r.operationType === 'Convert').length,
    arithmetic:  allRows.filter(r => ['Add','Subtract','Divide'].includes(r.operationType)).length,
    categories:  new Set(allRows.map(r => r.category).filter(Boolean)).size,
  }

  // Fetch history from your backend — lifecycle: runs on mount + when JWT changes
  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return
    setLoading(true); setError('')
    try {
      const [histRes, countRes] = await Promise.all([
        getHistory(),
        getHistoryCount(),
      ])
      const rows = Array.isArray(histRes.data) ? histRes.data : []
      setAllRows(rows)
      setFiltered(rows)
      setCount(countRes.data ?? rows.length)
      setActiveFilter('All')
    } catch (e) {
      setError(`Failed to load history: ${e.response?.data || e.message}`)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  // Component lifecycle — fetch on mount
  useEffect(() => {
    if (isLoggedIn) fetchHistory()
  }, [fetchHistory, isLoggedIn])

  // Filter handler — dynamic class binding on chips
  const handleFilter = (f) => {
    setActiveFilter(f)
    setFiltered(f === 'All' ? allRows : allRows.filter(r => r.operationType === f))
  }

  // Conditional rendering — lock banner vs data
  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <div className="lock-banner">
          <span className="lock-banner__icon">🔐</span>
          <h3 className="lock-banner__title">Sign in to view history</h3>
          <p className="lock-banner__desc">
            Your operation history is stored against your account. Please sign in to access it.
          </p>
          <Button variant="contained"
            onClick={() => navigate('/auth?mode=login')}
            sx={{ textTransform: 'none', background: '#2563eb', '&:hover': { background: '#1d4ed8' } }}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">

      {/* Header row */}
      <div className={styles.header}>
        <div>
          <div className="page-title">Operation History</div>
          <div className="page-sub" style={{ marginBottom: 0 }}>
            Your personal operation log from the database
          </div>
        </div>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchHistory}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#444', '&:hover': { background: '#f5f5f5' } }}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      {/* Stat cards — props passing */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}><StatCard label="Total"       value={stats.total}       /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Conversions" value={stats.conversions} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Arithmetic"  value={stats.arithmetic}  /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Categories"  value={stats.categories}  /></Grid>
      </Grid>

      {/* Filter chips — dynamic class binding */}
      <div className={styles.chips}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.chip} ${activeFilter === f ? styles.chipActive : ''}`}
            onClick={() => handleFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="result-box result-box--error" style={{ marginBottom: 16 }}>
          <div className="result-box__value result-box__value--error">{error}</div>
        </div>
      )}

      {/* History table — passes rows as props */}
      <HistoryTable rows={filtered} loading={loading} />

    </div>
  )
}

export default History
