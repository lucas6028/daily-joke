'use client'

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { Joke } from '@/types/joke'
import { createClient } from '@/lib/supabase/client'
import { calculateJokeAverageRating } from '@/utils/calculateAverage'
import { useCSRF } from '@/context/csrf-context'

interface JokeContextType {
  jokes: Joke[]
  getRandomJoke: () => Joke
  rateJoke: (id: string, rating: number) => void
}

const JokeContext = createContext<JokeContextType | undefined>(undefined)

export function JokeProvider({ children }: { readonly children: ReactNode }) {
  const [jokes, setJokes] = useState<Joke[]>([])
  const { csrfToken } = useCSRF()

  useEffect(() => {
    const supabase = createClient()
    const fetchJokesWithRatings = async () => {
      const { data: jokesWithRatings, error: jokesError } = await supabase.from('jokes').select(
        `
          *,
          ratings:ratings(*)
          `
      )
      if (jokesError) {
        console.error('Error fetching jokes:', jokesError.message)
        return
      }

      const jokesWithAverageRatings = jokesWithRatings.map((joke: Joke) => ({
        ...joke,
        averageRating: calculateJokeAverageRating(joke),
      }))

      setJokes(jokesWithAverageRatings)
    }

    fetchJokesWithRatings()
  }, [])

  // Use useMemo to prevent the context value from being recreated on every render
  const contextValue = useMemo(() => {
    const getRandomJoke = () => {
      const randomIndex = Math.floor(Math.random() * jokes.length)
      return jokes[randomIndex]
    }

    const rateJoke = (id: string, rating: number) => {
      const newRating = {
        rating,
        joke_id: id,
      }

      setJokes((prevJokes) =>
        prevJokes.map((joke) =>
          joke.id === id
            ? {
                ...joke,
                ratings: [...joke.ratings, newRating],
                averageRating:
                  (joke.ratings.reduce((prev, curr) => prev + curr.rating, 0) + rating) /
                  (joke.ratings.length + 1),
              }
            : joke
        )
      )

      if (!csrfToken) {
        console.error('Missing CSRF token, rating submission aborted')
        return
      }

      fetch('/api/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ joke_id: id, rating: rating }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to insert rating')
          console.log('Rating insert successfully!')
        })
        .catch((err) => {
          console.error('Error inserting new rating,', err)
        })
    }

    return { jokes, getRandomJoke, rateJoke }
  }, [jokes, csrfToken]) // Include csrfToken since rateJoke depends on it

  return <JokeContext.Provider value={contextValue}>{children}</JokeContext.Provider>
}

export function useJokeContext() {
  const context = useContext(JokeContext)
  if (context === undefined) {
    throw new Error('useJokeContext must be used within a JokeProvider')
  }
  return context
}
