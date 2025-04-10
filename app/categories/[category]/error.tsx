'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CategoryError({
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
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Category Error</h1>

        <p className="text-muted-foreground mb-6">
          We couldn&apos;t load jokes for this category. It might not exist or there could be a
          problem with our system.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/categories">
            <Button variant="outline" className="gap-2 w-full">
              <ArrowLeft className="h-4 w-4" />
              Back to categories
            </Button>
          </Link>

          <Button onClick={reset} className="gap-2">
            Try again
          </Button>
        </div>
      </Card>
    </div>
  )
}
