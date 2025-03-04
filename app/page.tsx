"use client"

import { useEffect, useState } from "react"
import { useJokeContext } from "@/context/joke-context"
import type { Joke } from "@/types/joke"
import JokeCard from "@/components/joke-card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [jokes, setJokes] = useState()
  const [jokeOfTheDay, setJokeOfTheDay] = useState<Joke | null>(null)

  // Simple hash function for consistent random selection based on date
  const hashCode = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  // Get the hash index of today
  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const seed = hashCode(dateString)
  const index = Math.abs(seed % 20) + 1

  useEffect(() => {
    if (jokes)
      return

    const fetchJokes = async () => {
      try {

        // Fetch todays joke
        const res = await fetch(`http://localhost:3000/api/supabase/fetch-jokes?limit=${1}&id=${index}`)
        const jokesFromDB = await res.json()
        setJokes({...jokesFromDB, ratings: []})
      } catch (err) {
        console.error(err)
      }
    }

    fetchJokes()
  }, [])

  // Get joke of the day based on current date
  useEffect(() => {
    if (!jokes) return

    const fetchRatings = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/supabase/fetch-ratings?id=${index}`)
        const ratings = await res.json()
        setJokeOfTheDay( {...jokes, ratings: ratings} )
      } catch (err) {
        console.error(err)
      }
    } 

    fetchRatings()
  }, [jokes])

  return (
    <div className="page-transition space-y-10">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="inline-block">
              <Sparkles className="h-8 w-8 inline-block mr-2 text-primary" />
            </span>
            Joke of the Day
          </h1>
          <p className="text-muted-foreground">Start your day with a laugh!</p>
        </motion.div>

        {jokeOfTheDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <JokeCard joke={jokeOfTheDay} />
          </motion.div>
        )}
      </section>
    </div>
  )
}

