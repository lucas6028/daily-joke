'use client'

import { useState, useEffect, useRef } from 'react'
import { useJokeContext } from '@/context/joke-context'
import JokeCard from '@/components/joke-card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Joke } from '@/types/joke'

export default function RandomJoke() {
  const { getRandomJoke, loadingState } = useJokeContext()
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fetchedRef = useRef(false)

  // Function to fetch a random joke
  const fetchRandomJoke = async () => {
    setIsLoading(true)
    try {
      const joke = await getRandomJoke()
      setCurrentJoke(joke)
    } catch (error) {
      console.error('Error fetching random joke:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load a random joke when the page loads only once
  useEffect(() => {
    if (fetchedRef.current) return

    fetchRandomJoke()
    fetchedRef.current = true
  }, [])

  return (
    <div className="page-transition space-y-10">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight">隨機笑話</h1>
          <p className="text-muted-foreground">點一下按鈕，獲取一個新的隨機笑話！</p>
          <Button size="lg" onClick={fetchRandomJoke} disabled={isLoading} className="mx-auto">
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            New Random Joke
          </Button>
        </motion.div>

        {loadingState.error && (
          <div className="p-8 border rounded-lg shadow-sm text-center mt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">Error loading joke</p>
            <p className="text-muted-foreground mt-2">{loadingState.error}</p>
          </div>
        )}

        {!loadingState.error && !currentJoke && isLoading && (
          <div className="p-8 border rounded-lg shadow-sm text-center mt-6">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        )}

        {currentJoke && (
          <motion.div
            key={currentJoke.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <JokeCard joke={currentJoke} />
          </motion.div>
        )}
      </section>
    </div>
  )
}
