import { Joke } from '@/types/joke'

const FETCH_TIMEOUT_MS = 5000

export async function getJokeById(index: number): Promise<Joke | null> {
  if (!Number.isInteger(index) || index <= 0) {
    throw new Error('Invalid index: must be a positive integer')
  }

  try {
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      throw new Error('Server configuration error: Base URL not defined')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    const response = await fetch(`${baseUrl}/api/joke/single?id=${index}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch joke: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Request timed out')
      return null
    }
    console.error('Error fetching joke:', error)
    return null
  }
}
