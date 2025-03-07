"use client"

import { useEffect, useState } from "react"
import type { Joke } from "@/types/joke"
import JokeCard from "@/components/joke-card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { getHashIndex } from "@/lib/getHashIndex"

export default function Home() {
  const [jokes, setJokes] = useState<Joke | null>(null)
  const [jokeOfTheDay, setJokeOfTheDay] = useState<Joke | null>(null)

  useEffect(() => {
    if (jokes) return

    const index = getHashIndex()

    const fetchJokes = async () => {
      try {
        // Fetch todays joke
        const res = await fetch(`/api/supabase/fetch-jokes?limit=${1}&id=${index}`, { next: { revalidate: 3600 } })
        const jokesFromDB = await res.json()
        if (Array.isArray(jokesFromDB) && jokesFromDB.length > 0) {
          setJokes({ ...jokesFromDB[0], ratings: [] })
        } else if (jokesFromDB && typeof jokesFromDB === "object") {
          setJokes({ ...jokesFromDB, ratings: [] })
        } else {
          console.error("Unexpected API response:", jokesFromDB)
        }
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
        const index = getHashIndex()

        // Fetch ratings of today joke
        const res = await fetch(`/api/supabase/fetch-ratings?id=${index}`, { next: { revalidate: 3600 } })
        const ratings = await res.json()
        setJokeOfTheDay({ ...jokes, ratings: Array.isArray(ratings) ? ratings : [] })
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
            transition={{ delay: 0.01, duration: 0.5 }}
          >
            <JokeCard joke={jokeOfTheDay} />
          </motion.div>
        )}
      </section>
    </div>
  )
}

