"use client"

import { useEffect, useState } from "react"
import type { Joke } from "@/types/joke"
import type { Rating } from "@/types/rating"
import JokeCard from "@/components/joke-card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { getHashIndex } from "@/lib/getHashIndex"

export default function Home() {
  // const [jokes, setJokes] = useState<Joke | null>(null)
  const [jokeOfTheDay, setJokeOfTheDay] = useState<Joke | null>(null)

  const refreshRatings = async (rating: number) => {
    if (!jokeOfTheDay) return;

    const newRating = {
      rating,
      joke_id: jokeOfTheDay.id,
    }

    setJokeOfTheDay({
      ...jokeOfTheDay,
      ratings: [...jokeOfTheDay.ratings, newRating],
      averageRating: (jokeOfTheDay.ratings.reduce((prev, curr) => prev + curr.rating, 0) + rating) / (jokeOfTheDay.ratings.length + 1),
    })
  }

  useEffect(() => {
    if (jokeOfTheDay) return;

    const index = getHashIndex()

    const fetchJokes = async () => {
      try {
        // Fetch todays joke
        const res = await fetch(`/api/joke/single?&id=${index}`, {
          next: { revalidate: 3600 }
        })

        const jokesFromDB = await res.json()
        const jokesWithAverageRatings = {
          ...jokesFromDB,
          averageRating: jokesFromDB.ratings.length > 0
            ? jokesFromDB.ratings.reduce((prev: number, curr: Rating) => prev + curr.rating, 0) / jokesFromDB.ratings.length
            : 0
        };

        setJokeOfTheDay(jokesWithAverageRatings)
      } catch (err) {
        console.error(err)
      }
    }

    fetchJokes()
  }, [jokeOfTheDay])

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
            每天一則精選笑話
          </h1>
          <p className="text-muted-foreground">帶給您歡樂與放鬆。讓您的一天從微笑開始！</p>
        </motion.div>

        {jokeOfTheDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.01, duration: 0.5 }}
          >
            <JokeCard joke={jokeOfTheDay} onRatingSubmitted={refreshRatings} />
          </motion.div>
        )}
      </section>
    </div>
  )
}

