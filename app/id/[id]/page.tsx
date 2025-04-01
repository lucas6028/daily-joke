import type { Rating } from '@/types/rating'
import { AlertCircle } from 'lucide-react'
import JokeCardWrapper from '@/components/joke-card-wrapper'

async function getJoke(index: number) {
  try {
    // Fetch joke directly during server render
    // Use absolute URL for server component
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
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

export default async function Single({ params }: { params: { id: string } }) {
  const index = parseInt(params.id)
  let joke
  let errorMessage = null

  if (isNaN(index)) {
    errorMessage = '此 ID 未符合標準'
  } else if (index < 1 || index > 75) {
    errorMessage = '抱歉。沒有此 ID 的笑話'
  } else {
    try {
      joke = await getJoke(index)

      if (!joke) {
        throw new Error('無法獲取笑話，請稍後再試')
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '發生未知錯誤'
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
