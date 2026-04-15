import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useAuth } from '../../context/AuthContext'

function Toast() {
  const { toastState, closeToast } = useAuth()

  return (
    <Snackbar
      open={toastState.open}
      autoHideDuration={3000}
      onClose={closeToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={closeToast}
        severity={toastState.severity}
        variant="filled"
        sx={{ width: '100%', fontSize: '0.84rem' }}
      >
        {toastState.message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
