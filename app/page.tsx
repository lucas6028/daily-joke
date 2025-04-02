import { Sparkles, AlertCircle } from 'lucide-react'
import { getHashIndex } from '@/lib/getHashIndex'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import { calculateJokeAverageRating } from '@/lib/calculateAverage'
import { Joke } from '@/types/joke'

async function getJoke(): Promise<Joke | null> {
  try {
    const index = getHashIndex()
    console.log('today index:', index)

    // Fetch joke directly during server render
    // Use absolute URL for server component
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      throw new Error('Server configuration error: Base URL not defined')
    }

    const response = await fetch(`${baseUrl}/api/joke/single?id=${index}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch joke: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching joke:', error)
    return null
  }
}

export default async function Home() {
  let joke: Joke | null = null
  let errorMessage = null

  try {
    joke = await getJoke()

    if (!joke) {
      throw new Error('無法獲取笑話，請稍後再試')
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : '發生未知錯誤'
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
