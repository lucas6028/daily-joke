'use client'

import { useState, useEffect, useRef } from 'react'
import { useJokeContext } from '@/context/joke-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, AlertCircle } from 'lucide-react'
import CategoryCardSkeleton from '@/components/category-card-skeleton'

export default function Categories() {
  const { getAllCategories, getJokeCountByCategory } = useJokeContext()
  const [categories, setCategories] = useState<string[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

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

  useEffect(() => {
    // Only fetch once to prevent infinite loops
    if (fetchedRef.current) return

    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get all categories
        const allCategories = await getAllCategories()
        setCategories(allCategories)

        // Calculate counts for each category
        const counts: Record<string, number> = {}

        // Get joke counts for each category
        await Promise.all(
          allCategories.map(async (category) => {
            try {
              counts[category] = await getJokeCountByCategory(category)
            } catch (error) {
              console.error(`Error fetching jokes for category ${category}:`, error)
              counts[category] = 0
            }
          })
        )

        setCategoryCounts(counts)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
    fetchedRef.current = true
  }, [getAllCategories, getJokeCountByCategory])

  if (isLoading) {
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
          {/* Display 6 skeleton cards while loading */}
          {[...Array(6)].map((_, i: number) => (
            <CategoryCardSkeleton key={`skeleton-star-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-transition">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">笑話分類</h1>
          <div className="p-8 border rounded-lg shadow-sm text-center mt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">Error loading categories</p>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </motion.div>
      </div>
    )
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
                        {categoryCounts[category] ?? 0} jokes
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
