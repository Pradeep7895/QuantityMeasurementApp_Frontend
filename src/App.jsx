import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Operations from './components/Operations/Operations'
import Auth from './components/Auth/Auth'
import History from './components/History/History'
import Toast from './components/common/Toast'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/auth"       element={<Auth />} />
        <Route path="/history"    element={<History />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </AuthProvider>
  )
}

export default App
