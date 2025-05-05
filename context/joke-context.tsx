'use client'

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import type { Joke } from '@/types/joke'
import { createClient } from '@/lib/supabase/client'
import { calculateJokeAverageRating } from '@/utils/calculateAverage'
import { useCSRF } from '@/context/csrf-context'

interface JokeContextType {
  jokes: Joke[]
  getRandomJoke: () => Promise<Joke>
  getJokeById: (id: number) => Promise<Joke | null>
  getJokesByCategory: (category: string) => Promise<Joke[]>
  getAllCategories: () => Promise<string[]>
  rateJoke: (id: number, rating: number) => void
  loadingState: {
    isLoading: boolean
    error: string | null
  }
}

const JokeContext = createContext<JokeContextType | undefined>(undefined)

async function fetchJokeById(id: number): Promise<Joke | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jokes')
    .select(
      `
      *,
      ratings:ratings(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching joke by ID:', error?.message)
    return null
  }

  return {
    ...data,
    averageRating: calculateJokeAverageRating(data),
  }
}

async function fetchJokesByCategory(category: string): Promise<Joke[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jokes')
    .select(
      `
      *,
      ratings:ratings(*)
    `
    )
    .eq('category', category)

  if (error) {
    console.error('Error fetching jokes by category:', error.message)
    return []
  }

  return data.map((joke: Joke) => ({
    ...joke,
    averageRating: calculateJokeAverageRating(joke),
  }))
}

async function fetchAllCategories(): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('jokes').select('category').order('category')

  if (error) {
    console.error('Error fetching categories:', error.message)
    return []
  }

  // Extract unique categories
  const categories = new Set(data.map((item: { category: string }) => item.category))
  return Array.from(categories)
}

async function fetchRandomJoke(): Promise<Joke | null> {
  const supabase = createClient()

  // First get the count of all jokes to generate a random ID
  const { count, error: countError } = await supabase
    .from('jokes')
    .select('*', { count: 'exact', head: true })

  if (countError || !count) {
    console.error('Error getting joke count:', countError?.message)
    return null
  }

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * count) + 1

  // Fetch a joke at that random position
  const { data, error } = await supabase
    .from('jokes')
    .select(
      `
      *,
      ratings:ratings(*)
    `
    )
    .range(randomIndex - 1, randomIndex - 1)
    .single()

  if (error || !data) {
    console.error('Error fetching random joke:', error?.message)
    return null
  }

  return {
    ...data,
    averageRating: calculateJokeAverageRating(data),
  }
}

export function JokeProvider({ children }: { readonly children: ReactNode }) {
  // We no longer need a jokes array since we're fetching on-demand
  const [loading, setLoading] = useState({
    isLoading: false,
    error: null as string | null,
  })
  const { csrfToken } = useCSRF()

  // Cache for categories to avoid repeated fetching
  const [categoriesCache, setCategoriesCache] = useState<string[]>([])
  // Cache for jokes by ID to avoid repeated fetching
  const [jokesCache, setJokesCache] = useState<Record<number, Joke>>({})
  // Cache for jokes by category to avoid repeated fetching
  const [categoryJokesCache, setCategoryJokesCache] = useState<Record<string, Joke[]>>({})

  // Use useMemo to prevent the context value from being recreated on every render
  const contextValue = useMemo(() => {
    // For backward compatibility, provide an empty jokes array
    const jokes: Joke[] = Object.values(jokesCache)

    const getRandomJoke = async (): Promise<Joke> => {
      setLoading({ isLoading: true, error: null })
      try {
        const randomJoke = await fetchRandomJoke()
        if (!randomJoke) {
          throw new Error('Failed to fetch random joke')
        }

        // Update the cache
        setJokesCache((prev) => ({
          ...prev,
          [randomJoke.id]: randomJoke,
        }))

        setLoading({ isLoading: false, error: null })
        return randomJoke
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLoading({ isLoading: false, error: errorMessage })
        throw error
      }
    }

    const getJokeById = async (id: number): Promise<Joke | null> => {
      // Check cache first
      if (jokesCache[id]) {
        return jokesCache[id]
      }

      setLoading({ isLoading: true, error: null })
      try {
        const joke = await fetchJokeById(id)

        if (joke) {
          // Update the cache
          setJokesCache((prev) => ({
            ...prev,
            [id]: joke,
          }))
        }

        setLoading({ isLoading: false, error: null })
        return joke
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLoading({ isLoading: false, error: errorMessage })
        return null
      }
    }

    const getJokesByCategory = async (category: string): Promise<Joke[]> => {
      // Check cache first
      if (categoryJokesCache[category]) {
        return categoryJokesCache[category]
      }

      setLoading({ isLoading: true, error: null })
      try {
        const jokes = await fetchJokesByCategory(category)

        // Update the cache
        setCategoryJokesCache((prev) => ({
          ...prev,
          [category]: jokes,
        }))

        // Also update the individual jokes cache
        const jokesCacheUpdate: Record<number, Joke> = {}
        jokes.forEach((joke) => {
          jokesCacheUpdate[joke.id] = joke
        })
        setJokesCache((prev) => ({
          ...prev,
          ...jokesCacheUpdate,
        }))

        setLoading({ isLoading: false, error: null })
        return jokes
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLoading({ isLoading: false, error: errorMessage })
        return []
      }
    }

    const getAllCategories = async (): Promise<string[]> => {
      // Check cache first
      if (categoriesCache.length > 0) {
        return categoriesCache
      }

      setLoading({ isLoading: true, error: null })
      try {
        const categories = await fetchAllCategories()

        // Update the cache
        setCategoriesCache(categories)

        setLoading({ isLoading: false, error: null })
        return categories
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLoading({ isLoading: false, error: errorMessage })
        return []
      }
    }

    const rateJoke = (id: number, rating: number) => {
      if (!csrfToken) {
        console.error('Missing CSRF token, rating submission aborted')
        return
      }

      const newRating = {
        rating,
        joke_id: id,
      }

      // Update the cache if the joke exists
      if (jokesCache[id]) {
        const joke = jokesCache[id]
        const updatedRatings = [...joke.ratings, newRating]
        const ratingsTotal = joke.ratings.reduce((sum, r) => sum + r.rating, 0) + rating
        const newAverageRating = ratingsTotal / updatedRatings.length

        const updatedJoke = {
          ...joke,
          ratings: updatedRatings,
          averageRating: newAverageRating,
        }

        // Update the joke in the cache
        setJokesCache((prev) => ({
          ...prev,
          [id]: updatedJoke,
        }))

        // Update category caches if they contain this joke
        setCategoryJokesCache((prev) => {
          const newCache = { ...prev }
          for (const [category, jokes] of Object.entries(prev)) {
            const idx = jokes.findIndex((j) => j.id === id)
            if (idx >= 0) {
              newCache[category] = [...jokes.slice(0, idx), updatedJoke, ...jokes.slice(idx, 1)]
            }
          }
          return newCache
        })
      }

      // Send rating to the server
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
          console.log('Rating inserted successfully!')
        })
        .catch((err) => {
          console.error('Error inserting new rating,', err)
        })
    }

    return {
      jokes,
      getRandomJoke,
      getJokeById,
      getJokesByCategory,
      getAllCategories,
      rateJoke,
      loadingState: loading,
    }
  }, [csrfToken, jokesCache, categoryJokesCache, categoriesCache, loading])

  return <JokeContext.Provider value={contextValue}>{children}</JokeContext.Provider>
}

export function useJokeContext() {
  const context = useContext(JokeContext)
  if (context === undefined) {
    throw new Error('useJokeContext must be used within a JokeProvider')
  }
  return context
}
