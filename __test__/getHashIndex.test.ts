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

  it('should handle edge dates correctly', () => {
    // Test with minimum date value that JS can reliably handle
    jest.setSystemTime(new Date('1900-01-01'))
    const minDateResult = getHashIndex()
    expect(minDateResult).toBeGreaterThanOrEqual(1)
    expect(minDateResult).toBeLessThanOrEqual(68)

    // Test with far future date
    jest.setSystemTime(new Date('2100-12-31'))
    const futureDateResult = getHashIndex()
    expect(futureDateResult).toBeGreaterThanOrEqual(1)
    expect(futureDateResult).toBeLessThanOrEqual(68)
  })

  it('should handle time zone differences correctly', () => {
    // Set the system time to a specific date in UTC
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
    const utcResult = getHashIndex()

    // Set the system time to the same date in a different time zone
    jest.setSystemTime(new Date('2023-01-01T00:00:00-0500')) // UTC-5
    const estResult = getHashIndex()

    expect(utcResult).toBe(estResult)
  })

  it('should handle daylight saving time changes correctly', () => {
    // Set the system time to a date before the DST change
    jest.setSystemTime(new Date('2023-03-12T01:00:00-0500')) // Before DST change
    const preDstResult = getHashIndex()

    // Set the system time to a date after the DST change
    jest.setSystemTime(new Date('2023-03-12T03:00:00-0400')) // After DST change
    const postDstResult = getHashIndex()

    expect(preDstResult).toBe(postDstResult)
  })

  it('should handle edge cases with time zones correctly', () => {
    // Set the system time to a date in UTC
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
    const utcResult = getHashIndex()

    // Set the system time to the same date in a different time zone
    jest.setSystemTime(new Date('2023-01-01T00:00:00+0200')) // UTC+2
    const cetResult = getHashIndex()

    expect(utcResult).toBe(cetResult)
  })

  it('should handle extreme future dates correctly', () => {
    // Set the system time to a far future date
    jest.setSystemTime(new Date('9999-12-31'))
    const futureDateResult = getHashIndex()
    expect(futureDateResult).toBeGreaterThanOrEqual(1)
    expect(futureDateResult).toBeLessThanOrEqual(68)
  })

  it('should handle extreme past dates correctly', () => {
    // Set the system time to a far past date
    jest.setSystemTime(new Date('0001-01-01'))
    const pastDateResult = getHashIndex()
    expect(pastDateResult).toBeGreaterThanOrEqual(1)
    expect(pastDateResult).toBeLessThanOrEqual(68)
  })
})
