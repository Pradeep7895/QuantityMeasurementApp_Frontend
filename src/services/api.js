import axios from 'axios'

// ── Axios instance pointing at your ASP.NET backend ──────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5142/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from sessionStorage on every request (if present)
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('qc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── AUTH ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login    — your controller reads email/password as query params
export const loginUser = (email, password) =>
  api.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)

// POST /api/auth/register
export const registerUser = (email, password) =>
  api.post(`/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)

// ── QUANTITIES ────────────────────────────────────────────────────────────────
// POST /api/quantities/convert  →  ConvertRequest body
export const convertUnits = (source, targetUnit) =>
  api.post('/quantities/convert', { source, targetUnit })

// POST /api/quantities/add  →  ArithmeticRequest body
export const addQuantities = (q1, q2, targetUnit) =>
  api.post('/quantities/add', { q1, q2, targetUnit })

// POST /api/quantities/subtract  →  ArithmeticRequest body
export const subtractQuantities = (q1, q2, targetUnit) =>
  api.post('/quantities/subtract', { q1, q2, targetUnit })

// POST /api/quantities/divide  →  ArithmeticRequest body (no targetUnit)
export const divideQuantities = (q1, q2) =>
  api.post('/quantities/divide', { q1, q2 })

// GET /api/quantities/history  →  QuantityHistoryRecord[]
export const getHistory = () =>
  api.get('/quantities/history')

// GET /api/quantities/HistoryCount  →  integer
export const getHistoryCount = () =>
  api.get('/quantities/HistoryCount')

export default api
