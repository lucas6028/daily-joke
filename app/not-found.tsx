'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Search, Home, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="page-transition container flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="error-card">
          <CardHeader className="pb-3 text-center">
            <div className="error-icon-container bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">404</h1>
              <p className="text-xl font-medium">Page Not Found</p>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Try going back
              or visiting the home page.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
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
