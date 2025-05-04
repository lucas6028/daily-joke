'use client'

import { useEffect, useState, useRef } from 'react'
import { useJokeContext } from '@/context/joke-context'
import type { Joke } from '@/types/joke'
import JokeCardSkeleton from '@/components/joke-card-skeleton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import JokeCardWrapper from '@/components/joke-card-wrapper'

export default function CategoryPage({
  params,
}: {
  readonly params: { readonly category: string }
}) {
  const { getJokesByCategory } = useJokeContext()
  const [categoryJokes, setCategoryJokes] = useState<Joke[]>([])
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
    // Reset fetched status when category changes
    fetchedRef.current = false
  }, [params.category])

  useEffect(() => {
    // Only fetch once for each category
    if (fetchedRef.current) return

    const fetchCategoryJokes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const jokes = await getJokesByCategory(params.category)
        setCategoryJokes(jokes)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching jokes for category:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryJokes()
    fetchedRef.current = true
  }, [getJokesByCategory, params.category])

  return (
    <div className="page-transition">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl" aria-hidden="true">
            {categoryEmojis[params.category] ?? '😄'}
          </span>
          <h1 className="text-3xl font-bold tracking-tight capitalize">{params.category} Jokes</h1>
        </motion.div>
      </div>

      {isLoading && (
        <div className="grid gap-6">
          {/* Display 3 skeleton cards while loading */}
          {[...Array(3)].map((_, i) => (
            <JokeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading jokes</p>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-6">
          {categoryJokes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No jokes found in this category.</p>
            </div>
          ) : (
            categoryJokes.map((joke, index) => (
              <motion.div
                key={joke.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <JokeCardWrapper joke={joke} />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
