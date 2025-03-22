import type { Rating } from '@/types/rating'
import { Sparkles } from 'lucide-react'
import { getHashIndex } from '@/lib/getHashIndex'
import JokeCardWrapper from '@/components/joke-card-wrapper'

export default async function Home() {
  const index = getHashIndex()
  console.log('today index:', index)

  // Fetch joke directly during server render
  const data = await fetch(`/api/joke/single?id=${index}`, {
    next: { revalidate: 86400 },
  })
  const joke = await data.json()

  if (error) {
    console.error('Error while fetching jokes from supabase', error)
    // You could return an error state here
  }

  // Calculate average rating on the server
  const jokeOfTheDay = joke
    ? {
        ...joke,
        averageRating:
          joke.ratings.length > 0
            ? joke.ratings.reduce((prev: number, curr: Rating) => prev + curr.rating, 0) /
              joke.ratings.length
            : 0,
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

        {jokeOfTheDay && <JokeCardWrapper joke={jokeOfTheDay} />}
      </section>
    </div>
  )
}
