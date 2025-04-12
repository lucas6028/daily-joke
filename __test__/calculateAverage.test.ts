import { calculateJokeAverageRating } from '../utils/calculateAverage'
import { Joke } from '@/types/joke'
import { expect } from '@jest/globals'

// Add at the beginning of the file:
function createTestJoke(ratings: { id: string; joke_id: string; rating: number }[] = []): Joke {
  return {
    id: '1',
    text: 'Why did the chicken cross the road?',
    category: 'Animal',
    ratings,
    averageRating: 0,
  }
}

describe('calculateJokeAverageRating', () => {
  it('should return 0 when joke is undefined', () => {
    // @ts-expect-error - intentionally passing undefined for test
    expect(calculateJokeAverageRating(undefined)).toBe(0)
  })

  it('should return 0 when joke is null', () => {
    // @ts-expect-error - intentionally passing null for test
    expect(calculateJokeAverageRating(null)).toBe(0)
  })

  it('should return 0 when joke has no ratings', () => {
    const joke = createTestJoke([])
    expect(calculateJokeAverageRating(joke)).toBe(0)
  })

  it('should return the rating value when joke has one rating', () => {
    const joke = createTestJoke([{ id: '1', joke_id: '1', rating: 5 }])
    expect(calculateJokeAverageRating(joke)).toBe(5)
  })

  it('should calculate the average rating when joke has multiple ratings', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: 3 },
      { id: '2', joke_id: '1', rating: 5 },
      { id: '3', joke_id: '1', rating: 4 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(4) // (3 + 5 + 4) / 3 = 4
  })

  it('should handle decimal results correctly', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: 2 },
      { id: '2', joke_id: '1', rating: 3 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(2.5) // (2 + 3) / 2 = 2.5
  })
})
