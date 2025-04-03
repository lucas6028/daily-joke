'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Joke } from '@/types/joke'
import type { Rating } from '@/types/rating'
import { supabase } from '@/libs/supabase/client'

interface JokeContextType {
  jokes: Joke[]
  getRandomJoke: () => Joke
  rateJoke: (id: string, rating: number) => void
}

const JokeContext = createContext<JokeContextType | undefined>(undefined)

export function JokeProvider({ children }: { children: ReactNode }) {
  const [jokes, setJokes] = useState<Joke[]>([])

  useEffect(() => {
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
        averageRating:
          joke.ratings.length > 0
            ? joke.ratings.reduce((prev: number, curr: Rating) => prev + curr.rating, 0) /
              joke.ratings.length
            : 0,
      }))

      setJokes(jokesWithAverageRatings)
    }

    fetchJokesWithRatings()
  }, [])

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

    fetch('/api/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  return (
    <JokeContext.Provider value={{ jokes, getRandomJoke, rateJoke }}>
      {children}
    </JokeContext.Provider>
  )
}

export function useJokeContext() {
  const context = useContext(JokeContext)
  if (context === undefined) {
    throw new Error('useJokeContext must be used within a JokeProvider')
  }
  return context
}
