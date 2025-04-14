'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

interface CSRFContextType {
  csrfToken: string | null
  loading: boolean
  refreshToken: () => void
}

const CSRFContext = createContext<CSRFContextType>({
  csrfToken: null,
  loading: true,
  refreshToken: () => {},
})

export function useCSRF() {
  return useContext(CSRFContext)
}

export function CSRFProvider({ children }: { readonly children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch the CSRF token
  const fetchCSRFToken = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/csrf')
      const data = await response.json()
      setCsrfToken(data.csrfToken)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error)
      // Retry after a delay if fetch fails
      const retryTimer = setTimeout(() => {
        fetchCSRFToken()
      }, 3000) // Retry after 3 seconds

      // Clean up timer if component unmounts
      return () => clearTimeout(retryTimer)
    }
  }, [])

  useEffect(() => {
    fetchCSRFToken()
  }, [fetchCSRFToken])

  // Use useMemo to prevent the context value from being recreated on every render
  const contextValue = useMemo(() => {
    // Add a function to refresh the token that can be exposed if needed
    const refreshToken = () => {
      fetchCSRFToken()
    }
    return { csrfToken, loading, refreshToken }
  }, [csrfToken, loading, fetchCSRFToken])

  return <CSRFContext.Provider value={contextValue}>{children}</CSRFContext.Provider>
}
