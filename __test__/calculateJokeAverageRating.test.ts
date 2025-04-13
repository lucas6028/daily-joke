import { calculateJokeAverageRating } from '../utils/calculateAverage'
import { Joke } from '@/types/joke'
import { expect, it } from '@jest/globals'

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
  it.each([
    ['undefined', undefined],
    ['null', null],
  ])('should return 0 when joke is %s', (_, jokeValue) => {
    // @ts-expect-error - intentionally passing null/undefined for test
    expect(calculateJokeAverageRating(jokeValue)).toBe(0)
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

  it('should handle a large number of ratings correctly', () => {
    const manyRatings = Array.from({ length: 100 }, (_, i) => ({
      id: i.toString(),
      joke_id: '1',
      rating: 3,
    }))
    const joke = createTestJoke(manyRatings)
    expect(calculateJokeAverageRating(joke)).toBe(3)
  })

  it('should handle negative ratings correctly', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: -1 },
      { id: '2', joke_id: '1', rating: 1 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(0) // (-1 + 1) / 2 = 0
  })

  it('should handle extremely high ratings correctly', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: 1000 },
      { id: '2', joke_id: '1', rating: 2000 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(1500) // (1000 + 2000) / 2 = 1500
  })

  it('should handle boundary values (min/max ratings)', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: 0 },
      { id: '2', joke_id: '1', rating: 5 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(2.5) // (0 + 5) / 2 = 2.5
  })

  it('should handle mixed positive and negative ratings correctly', () => {
    const joke = createTestJoke([
      { id: '1', joke_id: '1', rating: -2 },
      { id: '2', joke_id: '1', rating: 4 },
    ])
    expect(calculateJokeAverageRating(joke)).toBe(1) // (-2 + 4) / 2 = 1
  })
})
