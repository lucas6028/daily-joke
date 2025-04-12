import { Joke } from '@/types/joke'
import { Rating } from '@/types/rating'

export function calculateJokeAverageRating(joke: Joke): number {
  if (!joke?.ratings || joke.ratings.length === 0) {
    return 0
  }
  const totalRating = joke.ratings.reduce((acc: number, rating: Rating) => acc + rating.rating, 0)
  return totalRating / joke.ratings.length
}
