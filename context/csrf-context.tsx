'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface CSRFContextType {
  csrfToken: string | null
  loading: boolean
}

const CSRFContext = createContext<CSRFContextType>({ csrfToken: null, loading: true })

export function useCSRF() {
  return useContext(CSRFContext)
}

export function CSRFProvider({ children }: { readonly children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCSRFToken() {
      try {
        const response = await fetch('/api/csrf')
        const data = await response.json()
        setCsrfToken(data.csrfToken)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
        setLoading(false)
      }
    }

    fetchCSRFToken()
  }, [])

  return <CSRFContext.Provider value={{ csrfToken, loading }}>{children}</CSRFContext.Provider>
}
