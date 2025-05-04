'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function CategoryCardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Card className="category-card">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-24 rounded bg-muted animate-pulse"></div>
              <div className="h-5 w-16 rounded-full bg-muted animate-pulse"></div>
            </div>
          </div>
          <div className="h-5 w-5 rounded bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
