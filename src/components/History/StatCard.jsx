import React from 'react'
import styles from './History.module.scss'

// Simple presentational component — receives label + value as props
function StatCard({ label, value }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  )
}

export default StatCard
