import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import styles from './Operations.module.scss'
import ConvertPanel from './ConvertPanel'
import AddPanel from './AddPanel'
import SubtractPanel from './SubtractPanel'
import DividePanel from './DividePanel'

const TABS = [
  { value: 'convert',  label: '🔄 Convert'  },
  { value: 'add',      label: '➕ Add'       },
  { value: 'subtract', label: '➖ Subtract'  },
  { value: 'divide',   label: '➗ Divide'    },
]

function Operations() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Read tab from URL query param (e.g. /operations?tab=add)
  const tabFromUrl = searchParams.get('tab') || 'convert'
  const [activeTab, setActiveTab] = useState(
    TABS.find(t => t.value === tabFromUrl) ? tabFromUrl : 'convert'
  )

  // Sync tab state if URL changes (e.g. navigated from Home cards)
  useEffect(() => {
    const t = searchParams.get('tab')
    if (t && TABS.find(tb => tb.value === t)) setActiveTab(t)
  }, [searchParams])

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue)
    setSearchParams({ tab: newValue })
  }

  return (
    <div className={`page-container page-container--narrow`}>
      <div className="page-title">Operations</div>
      <div className="page-sub">All operations are free — no login required.</div>

      {/* MUI Tabs for operation switching */}
      <Box className={styles.tabsBar}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{ minHeight: 40 }}
        >
          {TABS.map(tab => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              disableRipple
              className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Conditional rendering based on active tab */}
      {activeTab === 'convert'  && <ConvertPanel />}
      {activeTab === 'add'      && <AddPanel />}
      {activeTab === 'subtract' && <SubtractPanel />}
      {activeTab === 'divide'   && <DividePanel />}
    </div>
  )
}

export default Operations
