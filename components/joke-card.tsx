"use client"

import { useState } from "react"
import type { Joke } from "@/types/joke"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Share2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import Rating from "@/components/rating"
import { useJokeContext } from "@/context/joke-context"

interface JokeCardProps {
  joke: Joke
  onRatingSubmitted?: (rating: number) => void
}

export default function JokeCard({ joke, onRatingSubmitted }: JokeCardProps) {
  const [copied, setCopied] = useState(false)
  const { rateJoke } = useJokeContext()

  const handleCopy = () => {
    navigator.clipboard.writeText(joke.text)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Joke copied to clipboard successfully!",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this joke!",
          text: joke.text,
          url: window.location.href,
        })
        .catch(console.error)
    } else {
      handleCopy()
      toast({
        title: "Sharing not supported",
        description: "The joke has been copied to your clipboard instead.",
      })
    }
  }

  const handleRate = (rating: number) => {
    rateJoke(joke.id, rating)
    toast({
      title: "Thanks for rating!",
      description: `You rated this joke ${rating} out of 10.`,
    })

    if (onRatingSubmitted) {
      onRatingSubmitted(rating)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="joke-card overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="capitalize">
              {joke.category}
            </Badge>
            <div className="text-xs text-muted-foreground">ID: {joke.id}</div>
          </div>
          <pre className="text-lg leading-relaxed mb-4 whitespace-pre-wrap break-words">
            {joke.text}
          </pre>
          <div className="flex items-center justify-between">
            <Rating initialRating={joke.averageRating} onRate={handleRate} />
            <span className="text-sm text-muted-foreground">
              Average: {joke.averageRating.toFixed(1)} ({joke.ratings.length}{" "}
              {joke.ratings.length === 1 ? "rating" : "ratings"})
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 py-3">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

