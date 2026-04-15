import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import styles from './Home.module.scss'

// Operation cards data — props-driven, reusable
const OP_CARDS = [
  { icon: '🔄', title: 'Convert',  desc: 'Convert a value from one unit to another.',              tab: 'convert'  },
  { icon: '➕', title: 'Add',      desc: 'Add two quantities and get the result in any unit.',      tab: 'add'      },
  { icon: '➖', title: 'Subtract', desc: 'Subtract one quantity from another.',                     tab: 'subtract' },
  { icon: '➗', title: 'Divide',   desc: 'Divide one quantity by another.',                         tab: 'divide'   },
]

// Reusable OpCard component — demonstrates props passing & component composition
function OpCard({ icon, title, desc, onClick }) {
  return (
    <div className={styles.opCard} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className={styles.opIcon}>{icon}</div>
      <h3 className={styles.opTitle}>{title}</h3>
      <p className={styles.opDesc}>{desc}</p>
    </div>
  )
}

function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-container">

      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>⚖ Quantity Measurement Calculator</h1>
        <p className={styles.heroDesc}>
          Convert units, add, subtract, and divide quantities across Length, Weight,
          Volume &amp; Temperature. Free to use — no account needed.
        </p>
        <div className={styles.heroBtns}>
          <Button variant="contained" onClick={() => navigate('/operations')}
            sx={{ textTransform: 'none', background: '#2563eb', '&:hover': { background: '#1d4ed8' } }}>
            Start an Operation
          </Button>
          <Button variant="outlined" onClick={() => navigate('/auth?mode=register')}
            sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#1a1a2e', '&:hover': { background: '#f5f5f5' } }}>
            Create Account
          </Button>
        </div>
      </div>

      {/* Operation Cards Grid */}
      <p className="page-sub">Choose what you'd like to do:</p>
      <Grid container spacing={1.5}>
        {OP_CARDS.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.tab}>
            <OpCard
              icon={card.icon}
              title={card.title}
              desc={card.desc}
              onClick={() => navigate(`/operations?tab=${card.tab}`)}
            />
          </Grid>
        ))}
      </Grid>

    </div>
  )
}

export default Home
