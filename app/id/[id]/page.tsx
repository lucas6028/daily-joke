import type { Rating } from '@/types/rating'
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
    return <div>Invalid joke ID</div>
  }
  if (index < 1 || index > 75) {
    return <h1>Sorry. There is no joke with is ID.</h1>
  }

  try {
    joke = await getJoke(index)

    if (!joke) {
      throw new Error('無法獲取笑話，請稍後再試')
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : '發生未知錯誤'
    console.error('Error while fetching jokes:', error)
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
      <section>{jokes && <JokeCardWrapper joke={jokes} />}</section>
    </div>
  )
}
