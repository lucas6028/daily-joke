'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="page-transition container flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20 error-card">
          <CardHeader className="pb-3 text-center">
            <div className="error-icon-container bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mt-1">We encountered an unexpected error</p>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              We&apos;re sorry for the inconvenience. Our team has been notified and is working to
              fix the issue.
            </p>
            {error.digest && (
              <div className="mt-4 p-2 bg-muted rounded-md">
                <code className="text-xs">Error ID: {error.digest}</code>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={reset} className="gap-2 w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button className="gap-2 w-full">
                <Home className="h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
