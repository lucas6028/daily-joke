import type { Rating } from "@/types/rating"
import JokeCard from "@/components/joke-card"
import { Sparkles } from "lucide-react"
import { getHashIndex } from "@/lib/getHashIndex"
import { supabase } from "@/lib/supabase"
import JokeCardWrapper from "@/components/joke-card-wrapper"

// Server component - data is fetched during page rendering
export default async function Home() {
  const index = getHashIndex();

  // Server-side data fetching
  const { data: jokes, error } = await supabase
    .from("jokes")
    .select(`
      *,
      ratings:ratings(*)
    `)
    .eq("id", index)
    .limit(1)
    .single();

  if (error) {
    console.error("Error while fetching jokes from supabase", error);
    // Could render an error state here
    return <div>Failed to load joke</div>;
  }

  const jokeOfTheDay = {
    ...jokes,
    averageRating: jokes.ratings.length > 0
      ? jokes.ratings.reduce((prev: number, curr: Rating) => prev + curr.rating, 0) / jokes.ratings.length
      : 0
  };

  return (
    <div className="page-transition space-y-10">
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

        <JokeCardWrapper>
          <JokeCard joke={jokeOfTheDay} />
        </JokeCardWrapper>
      </section>
    </div>
  )
}