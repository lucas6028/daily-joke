'use client'

import { useJokeContext } from '@/context/joke-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export default function Categories() {
  const { jokes } = useJokeContext()

  // Extract unique categories and count jokes in each
  const categories = Array.from(new Set(jokes.map((joke) => joke.category)))
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category] = jokes.filter((joke) => joke.category === category).length
      return acc
    },
    {} as Record<string, number>
  )

  // Category icons/emojis
  const categoryEmojis: Record<string, string> = {
    technology: '📱',
    programming: '💻',
    animal: '🐾',
    food: '🍔',
    science: '🔬',
    pun: '😏',
    dad: '👨',
    math: '🧮',
    music: '🎵',
    sports: '⚽',
    office: '🏢',
    dirty: '🥵',
    absurd: '😑',
    misunderstanding: '😵‍💫',
    idiom: '🈸',
    jingle: '🔔',
    stock: '📉',
  }

  return (
    <div className="page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">笑話分類</h1>
        <p className="text-muted-foreground">按你最愛的主題瀏覽笑話，笑點隨你挑！</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/categories/${category}`}>
              <Card className="category-card hover:bg-accent/50">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" aria-hidden="true">
                      {categoryEmojis[category] ?? '😄'}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold capitalize">{category}</h2>
                      <Badge variant="secondary" className="mt-1">
                        {categoryCounts[category]} jokes
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
