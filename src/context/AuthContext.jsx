import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Persist JWT in sessionStorage for session management
  const [jwt, setJwt] = useState(() => sessionStorage.getItem('qc_token') || null)
  const [userEmail, setUserEmail] = useState(() => sessionStorage.getItem('qc_email') || null)
  const [toastState, setToastState] = useState({ open: false, message: '', severity: 'success' })

  const login = useCallback((token, email) => {
    const clean = token.replace(/^"|"$/g, '') // strip JSON quotes if present
    setJwt(clean)
    setUserEmail(email)
    sessionStorage.setItem('qc_token', clean)
    sessionStorage.setItem('qc_email', email)
  }, [])

  const logout = useCallback(() => {
    setJwt(null)
    setUserEmail(null)
    sessionStorage.removeItem('qc_token')
    sessionStorage.removeItem('qc_email')
  }, [])

  const showToast = useCallback((message, severity = 'success') => {
    setToastState({ open: true, message, severity })
  }, [])

  const closeToast = useCallback(() => {
    setToastState(prev => ({ ...prev, open: false }))
  }, [])

  const isLoggedIn = Boolean(jwt)

  return (
    <AuthContext.Provider value={{ jwt, userEmail, isLoggedIn, login, logout, showToast, toastState, closeToast }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
