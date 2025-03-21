'use client'

import { useState } from 'react'
import { useJokeContext } from '@/context/joke-context'
import JokeCard from '@/components/joke-card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RandomJoke() {
  const getRandomId = (prev: number): number => {
    if (jokes.length <= 1) return 0
    const index = Math.floor(Math.random() * (jokes.length - 1))
    return index >= prev ? index + 1 : index
  }

  const { jokes } = useJokeContext()
  const [jokeId, setJokeId] = useState(getRandomId(-1))
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRandomJoke = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setJokeId(getRandomId(jokeId))
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="page-transition space-y-10">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight">Random Joke</h1>
          <p className="text-muted-foreground">Click the button for a new random joke!</p>
          <Button size="lg" onClick={handleGetRandomJoke} disabled={isLoading} className="mx-auto">
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            New Random Joke
          </Button>
        </motion.div>

        {jokes[jokeId] && (
          <motion.div
            key={jokeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <JokeCard joke={jokes[jokeId]} />
          </motion.div>
        )}
      </section>
    </div>
  )
}
