import { useState, useCallback } from 'react'

// Reusable hook: manages loading, result, error state for any async operation
export function useOperation() {
  const [loading, setLoading]   = useState(false)
  const [result,  setResult]    = useState(null)   // { value, unit, measurementType }
  const [error,   setError]     = useState(null)   // string message

  const run = useCallback(async (apiFn) => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await apiFn()
      setResult(res.data)
    } catch (err) {
      const msg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'An unexpected error occurred.'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { loading, result, error, run, reset }
}
