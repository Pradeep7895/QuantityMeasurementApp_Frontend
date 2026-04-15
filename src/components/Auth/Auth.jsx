import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { loginUser, registerUser } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.scss'

function Auth() {
  const navigate         = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { login, showToast, isLoggedIn } = useAuth()

  // Read mode from URL query param: /auth?mode=login or /auth?mode=register
  const modeFromUrl = searchParams.get('mode') || 'login'
  const [mode, setMode] = useState(modeFromUrl === 'register' ? 'register' : 'login')

  // Controlled inputs
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn, navigate])

  // Sync mode state when URL changes
  useEffect(() => {
    const m = searchParams.get('mode')
    if (m === 'register' || m === 'login') setMode(m)
  }, [searchParams])

  const switchMode = (newMode) => {
    setMode(newMode)
    setSearchParams({ mode: newMode })
    setErrorMsg('')
    setSuccessMsg('')
    setEmail('')
    setPassword('')
  }

  // Login event handler
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setErrorMsg('Please fill in both fields.'); return }
    setLoading(true); setErrorMsg('')
    try {
      const res   = await loginUser(email, password)
      const token = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
      login(token, email)
      showToast('Signed in successfully!', 'success')
      navigate('/')
    } catch (err) {
      setErrorMsg(err.response?.status === 401 ? 'Invalid email or password.' : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Register event handler
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email || !password) { setErrorMsg('Please fill in both fields.'); return }
    setLoading(true); setErrorMsg('')
    try {
      await registerUser(email, password)
      setSuccessMsg('Account created! Signing you in…')
      // Auto-login after register
      setTimeout(async () => {
        try {
          const res   = await loginUser(email, password)
          const token = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
          login(token, email)
          showToast('Account created & signed in!', 'success')
          navigate('/')
        } catch {
          switchMode('login')
        }
      }, 900)
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Registration failed. Email may already be in use.'
      )
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>

        {/* Logo */}
        <div className={styles.authLogo}>
          <div className={styles.logoIcon}>⚖</div>
          <h2 className={styles.authTitle}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className={styles.authSub}>
            {isLogin ? 'Sign in to access your history' : 'Register to start tracking operations'}
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className={styles.modeSwitcher}>
          <button
            className={`${styles.modeBtn} ${isLogin ? styles.modeBtnActive : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            className={`${styles.modeBtn} ${!isLogin ? styles.modeBtnActive : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {/* Form — event handling in JSX */}
        <form
          className={styles.authForm}
          onSubmit={isLogin ? handleLogin : handleRegister}
          noValidate
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorMsg('') }}
            size="small"
            fullWidth
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrorMsg('') }}
            size="small"
            fullWidth
            required
            placeholder={isLogin ? 'Your password' : 'Create a password'}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          {/* Conditional rendering of messages */}
          {errorMsg   && <Alert severity="error"   sx={{ fontSize: '0.82rem', py: 0.5 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ fontSize: '0.82rem', py: 0.5 }}>{successMsg}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{
              textTransform: 'none',
              background: '#2563eb',
              py: 1.2,
              '&:hover': { background: '#1d4ed8' },
            }}
          >
            {loading
              ? (isLogin ? 'Signing in…' : 'Creating account…')
              : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        {/* Footer link — conditional rendering */}
        <div className={styles.authFooter}>
          {isLogin ? (
            <>No account?{' '}
              <span className={styles.authLink} onClick={() => switchMode('register')}>
                Register free →
              </span>
            </>
          ) : (
            <>Already registered?{' '}
              <span className={styles.authLink} onClick={() => switchMode('login')}>
                Sign in →
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Auth
