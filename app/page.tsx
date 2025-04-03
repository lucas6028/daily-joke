import { Sparkles, AlertCircle } from 'lucide-react'
import { getHashIndex } from '@/utils/getHashIndex'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import { calculateJokeAverageRating } from '@/lib/calculateAverage'
import { Joke } from '@/types/joke'
import { getJokeById } from '@/lib/getJoke'

const ERROR_MESSAGES = {
  FETCH_FAILED: '無法獲取笑話，請稍後再試',
  UNKNOWN: '發生未知錯誤',
}

async function getJoke(): Promise<Joke | null> {
  const index = getHashIndex()
  return getJokeById(index)
}

export default async function Home() {
  let joke: Joke | null = null
  let errorMessage = null

  try {
    joke = await getJoke()

    if (!joke) {
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN
    console.error('Error while fetching jokes:', error)
  }

  // Calculate average rating on the server
  const jokeOfTheDay = joke
    ? {
        ...joke,
        averageRating: calculateJokeAverageRating(joke),
      }
    : null

  return (
    <div className="space-y-10">
      <section>
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="inline-block">
              <Sparkles className="h-8 w-8 inline-block mr-2 text-primary" />
            </span>
            每天一則精選笑話
          </h1>
          <p className="text-muted-foreground">帶給您歡樂與放鬆。讓您的一天從微笑開始！</p>
        </div>

        {errorMessage ? (
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">笑話載入失敗</p>
            <p className="text-muted-foreground mt-2">{errorMessage}</p>
          </div>
        ) : jokeOfTheDay ? (
          <JokeCardWrapper joke={jokeOfTheDay} />
        ) : (
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        )}
      </section>
    </div>
  )
}
