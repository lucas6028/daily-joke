import type { Rating } from '@/types/rating'
import { AlertCircle } from 'lucide-react'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import { Joke } from '@/types/joke'

const MAX_JOKE_ID = 75
const ERROR_MESSAGES = {
  INVALID_ID: '此 ID 未符合標準',
  OUT_OF_RANGE: '抱歉。沒有此 ID 的笑話',
  FETCH_FAILED: '無法獲取笑話，請稍後再試',
  UNKNOWN: '發生未知錯誤',
}

async function getJoke(index: number): Promise<Joke | null> {
  try {
    // Fetch joke directly during server render
    // Use absolute URL for server component
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      throw new Error('Server configuration error: Base URL not defined')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
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

export default async function Single({ params }: { params: { id: string } }) {
  const index = parseInt(params.id)
  let joke: Joke | null = null
  let errorMessage = null

  if (isNaN(index)) {
    errorMessage = ERROR_MESSAGES.INVALID_ID
  } else if (index < 1 || index > MAX_JOKE_ID) {
    errorMessage = ERROR_MESSAGES.OUT_OF_RANGE
  } else {
    try {
      joke = await getJoke(index)

      if (!joke) {
        throw new Error(ERROR_MESSAGES.FETCH_FAILED)
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN
      console.error('Error while fetching jokes:', error)
    }
  }

  // Calculate average rating on the server
  const jokes = joke
    ? {
        ...joke,
        averageRating:
          joke.ratings?.length > 0
            ? joke.ratings.reduce((prev: number, curr: Rating) => prev + curr.rating, 0) /
              joke.ratings.length
            : 0,
      }
    : null

  return (
    <div className="space-y-10">
      <section>
        {errorMessage ? (
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">笑話載入失敗</p>
            <p className="text-muted-foreground mt-2">{errorMessage}</p>
          </div>
        ) : jokes ? (
          <JokeCardWrapper joke={jokes} />
        ) : (
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        )}
      </section>
    </div>
  )
}
