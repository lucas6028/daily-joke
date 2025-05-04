'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Copy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function JokeCardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Card className="joke-card overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 w-24 rounded-full bg-muted animate-pulse"></div>
            <div className="h-4 w-12 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-5 w-full rounded bg-muted animate-pulse"></div>
            <div className="h-5 w-full rounded bg-muted animate-pulse"></div>
            <div className="h-5 w-2/3 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-6 rounded-full bg-muted animate-pulse"></div>
              ))}
            </div>
            <div className="h-4 w-32 rounded bg-muted animate-pulse"></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 py-3">
          <Button variant="ghost" size="sm" disabled>
            <Share2 className="h-4 w-4 mr-2 text-muted" />
            Share
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Copy className="h-4 w-4 mr-2 text-muted" />
            Copy
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
