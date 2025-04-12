import { getHashIndex } from '../utils/getHashIndex'
import { expect } from '@jest/globals'

describe('getHashIndex', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return a number between 1 and 68', () => {
    jest.setSystemTime(new Date('2023-01-01'))
    const result = getHashIndex()
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(68)
  })

  it('should return consistent results for the same date', () => {
    jest.setSystemTime(new Date('2023-01-01'))
    const firstResult = getHashIndex()
    const secondResult = getHashIndex()
    expect(firstResult).toBe(secondResult)
  })

  it('should return different values for different dates', () => {
    jest.setSystemTime(new Date('2023-01-01'))
    const firstResult = getHashIndex()

    jest.setSystemTime(new Date('2023-01-02'))
    const secondResult = getHashIndex()

    expect(firstResult).not.toBe(secondResult)
  })

  it('should handle leap years correctly', () => {
    jest.setSystemTime(new Date('2020-02-29'))
    const leapDayResult = getHashIndex()
    expect(leapDayResult).toBeGreaterThanOrEqual(1)
    expect(leapDayResult).toBeLessThanOrEqual(68)

    jest.setSystemTime(new Date('2020-03-01'))
    const postLeapDayResult = getHashIndex()
    expect(postLeapDayResult).not.toBe(leapDayResult)
  })

  it('should handle year transitions correctly', () => {
    jest.setSystemTime(new Date('2022-12-31'))
    const decemberResult = getHashIndex()

    jest.setSystemTime(new Date('2023-01-01'))
    const januaryResult = getHashIndex()

    expect(januaryResult).not.toBe(decemberResult)
  })
})
