"use client"

import { useEffect, useState } from "react"
import { useJokeContext } from "@/context/joke-context"
import type { Joke } from "@/types/joke"
import JokeCard from "@/components/joke-card"
import { motion } from "framer-motion"

export default function Favorites() {
  const { jokes, favorites } = useJokeContext()
  const [favoriteJokes, setFavoriteJokes] = useState<Joke[]>([])

  useEffect(() => {
    const favJokes = jokes.filter((joke) => favorites.includes(joke.id))
    setFavoriteJokes(favJokes)
  }, [jokes, favorites])

  return (
    <div className="p-4 page-transition">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center mb-2">Favorites</h1>
        <p className="text-center text-muted-foreground mb-6">Your collection of favorite jokes</p>
      </motion.div>

      {favoriteJokes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center p-8"
        >
          <p className="text-muted-foreground">You haven&#39;t added any favorites yet.</p>
          <p className="mt-2">Rate jokes and heart them to add to your favorites!</p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {favoriteJokes.map((joke, index) => (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <JokeCard joke={joke} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

