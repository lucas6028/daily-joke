"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Joke } from "@/types/joke"
import { supabase } from "@/lib/supabase"

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
      const { data: jokesFromDb, error: jokesError } = await supabase
        .from("jokes")
        .select();
      if (jokesError) {
        console.error("Error fetching jokes:", jokesError.message);
        return;
      }

      const jokesWithRatings = await Promise.all(
        jokesFromDb.map(async (joke) => {
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("ratings")
            .select("rating")
            .eq("joke_id", joke.id);
          if (ratingsError) {
            console.error("Error fetching ratings for joke", joke.id, ":", ratingsError.message);
            // Return the joke with empty ratings if an error occurs
            return { ...joke, ratings: [] };
          }

          const ratings = ratingsData.map((r: { rating: number }) => r.rating);
          const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

          return { ...joke, ratings, averageRating };
        })
      );

      setJokes(jokesWithRatings);
    };

    fetchJokesWithRatings();
  }, []);

  useEffect(() => {
    // Save jokes and ratings to localStorage whenever they change
    // localStorage.setItem("jokes", JSON.stringify(jokes))
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
    fetch('/api/supabase/insert-ratings', {
      method: 'POST',
      body: JSON.stringify({ joke_id: id, rating: rating }),
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to insert rating")
        console.log("Rating insert successfully!")
      })
      .catch((err) => {
        console.error("Error inserting new rating,", err)
      })
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

