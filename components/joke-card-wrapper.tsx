'use client'

import { useState } from 'react'
import type { Joke } from '@/types/joke'
import JokeCard from '@/components/joke-card'
import { motion } from 'framer-motion'

export default function JokeCardWrapper({ joke }: { readonly joke: Joke }) {
  const [jokeState, setJokeState] = useState<Joke>(joke)

  const refreshRatings = async (rating: number) => {
    if (!jokeState) return

    const newRating = {
      rating,
      joke_id: jokeState.id,
    }

    setJokeState({
      ...jokeState,
      ratings: [...jokeState.ratings, newRating],
      averageRating:
        (jokeState.ratings.reduce((prev, curr) => prev + curr.rating, 0) + rating) /
        (jokeState.ratings.length + 1),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.01, duration: 0.5 }}
    >
      <JokeCard joke={jokeState} onRatingSubmitted={refreshRatings} />
    </motion.div>
  )
}
