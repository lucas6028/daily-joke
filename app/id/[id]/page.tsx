import { AlertCircle } from 'lucide-react'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import { Joke } from '@/types/joke'
import { calculateJokeAverageRating } from '@/lib/calculateAverage'
import { getJokeById } from '@/lib/getJoke'

const MAX_JOKE_ID = 75
const ERROR_MESSAGES = {
  INVALID_ID: '此 ID 未符合標準',
  OUT_OF_RANGE: '抱歉。沒有此 ID 的笑話',
  FETCH_FAILED: '無法獲取笑話，請稍後再試',
  UNKNOWN: '發生未知錯誤',
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
      joke = await getJokeById(index)

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
        averageRating: calculateJokeAverageRating(joke),
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
