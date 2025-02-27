"use client"

import { useEffect, useState } from "react"
import { useJokeContext } from "@/context/joke-context"
import type { Joke } from "@/types/joke"
import JokeCard from "@/components/joke-card"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { jokes } = useJokeContext()
  const [categoryJokes, setCategoryJokes] = useState<Joke[]>([])

  // Category icons/emojis
  const categoryEmojis: Record<string, string> = {
    programming: "💻",
    animal: "🐾",
    food: "🍔",
    science: "🔬",
    pun: "😏",
    dad: "👨",
    math: "🧮",
    music: "🎵",
    sports: "⚽",
    office: "🏢",
  }

  useEffect(() => {
    if (jokes.length > 0) {
      const filtered = jokes.filter((joke) => joke.category.toLowerCase() === params.category.toLowerCase())
      setCategoryJokes(filtered)
    }
  }, [jokes, params.category])

  return (
    <div className="page-transition">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl" aria-hidden="true">
            {categoryEmojis[params.category] || "😄"}
          </span>
          <h1 className="text-3xl font-bold tracking-tight capitalize">{params.category} Jokes</h1>
        </motion.div>
      </div>

      <div className="grid gap-6">
        {categoryJokes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jokes found in this category.</p>
          </div>
        ) : (
          categoryJokes.map((joke, index) => (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <JokeCard joke={joke} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

