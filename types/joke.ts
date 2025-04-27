import type { Rating } from '@/types/rating'

export interface Joke {
  id: number
  text: string
  category: string
  ratings: Rating[]
  averageRating: number
}
