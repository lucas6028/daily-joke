"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Joke } from "@/types/joke"
import { mockJokes } from "@/data/mock-jokes"

interface JokeContextType {
  jokes: Joke[]
  getRandomJoke: () => Joke
  rateJoke: (id: string, rating: number) => void
}

const JokeContext = createContext<JokeContextType | undefined>(undefined)

export function JokeProvider({ children }: { children: ReactNode }) {
  const [jokes, setJokes] = useState<Joke[]>([])

  useEffect(() => {
    // Load jokes and ratings from localStorage
    const storedJokes = localStorage.getItem("jokes")
    if (storedJokes) {
      setJokes(JSON.parse(storedJokes))
    } else {
      setJokes(mockJokes)
    }
  }, [])

  useEffect(() => {
    // Save jokes and ratings to localStorage whenever they change
    localStorage.setItem("jokes", JSON.stringify(jokes))
  }, [jokes])

  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length)
    return jokes[randomIndex]
  }

  const rateJoke = (id: string, rating: number) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke.id === id
          ? {
              ...joke,
              ratings: [...joke.ratings, rating],
              averageRating: (joke.ratings.reduce((a, b) => a + b, 0) + rating) / (joke.ratings.length + 1),
            }
          : joke,
      ),
    )
  }

  return <JokeContext.Provider value={{ jokes, getRandomJoke, rateJoke }}>{children}</JokeContext.Provider>
}

export function useJokeContext() {
  const context = useContext(JokeContext)
  if (context === undefined) {
    throw new Error("useJokeContext must be used within a JokeProvider")
  }
  return context
}

