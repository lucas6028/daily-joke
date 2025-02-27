"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface RatingProps {
  initialRating: number
  onRate: (rating: number) => void
}

export default function Rating({ initialRating, onRate }: RatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  const handleRate = (value: number) => {
    setRating(value)
    onRate(value)
  }

  return (
    <div className="flex items-center space-x-1">
      {[...Array(10)].map((_, index) => {
        const ratingValue = index + 1
        return (
          <motion.button
            key={index}
            className={`text-2xl focus:outline-none ${
              ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleRate(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="w-6 h-6" fill={ratingValue <= (hover || rating) ? "currentColor" : "none"} />
          </motion.button>
        )
      })}
    </div>
  )
}


