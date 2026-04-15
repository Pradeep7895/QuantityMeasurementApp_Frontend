import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import BalanceIcon from '@mui/icons-material/Balance'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.scss'

// Nav link items — always visible
const NAV_ITEMS = [
  { label: 'Home',       path: '/' },
  { label: 'Operations', path: '/operations' },
  { label: 'History',    path: '/history' },
]

function Navbar() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const { isLoggedIn, userEmail, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Derive initials for avatar
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const shortName = userEmail ? userEmail.split('@')[0] : ''

  return (
    <AppBar position="sticky" elevation={1} className={styles.navbar}>
      <Toolbar className={styles.toolbar}>

        {/* Brand */}
        <Box className={styles.brand} onClick={() => navigate('/')}>
          <BalanceIcon fontSize="small" />
          <Typography variant="h6" className={styles.brandText}>
            QuantaCalc
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box className={styles.navLinks}>
          {NAV_ITEMS.map(item => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${styles.navBtn} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Auth area — conditional rendering based on login state */}
        <Box className={styles.authArea}>
          {isLoggedIn ? (
            <>
              {/* User chip with avatar */}
              <Chip
                avatar={<Avatar sx={{ bgcolor: '#2563eb', fontSize: '10px', width: 26, height: 26 }}>{initials}</Avatar>}
                label={shortName}
                variant="outlined"
                size="small"
                className={styles.userChip}
              />
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleLogout}
                className={styles.signOutBtn}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/auth?mode=login')}
                className={styles.loginBtn}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/auth?mode=register')}
                className={styles.signupBtn}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Navbar
