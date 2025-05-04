'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import { getHashIndex } from '@/utils/getHashIndex'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import JokeCardSkeleton from '@/components/joke-card-skeleton'
import { useJokeContext } from '@/context/joke-context'
import { Joke } from '@/types/joke'

const ERROR_MESSAGES = {
  FETCH_FAILED: '無法獲取笑話，請稍後再試',
  UNKNOWN: '發生未知錯誤',
  TITLE: '笑話載入失敗',
}

export default function Home() {
  const { getJokeById } = useJokeContext()
  const [joke, setJoke] = useState<Joke | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    // Only fetch once to prevent infinite loops
    if (fetchedRef.current) return

    const fetchJokeOfTheDay = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        // Get the joke of the day index using the date-based hash function
        const index = getHashIndex()
        const fetchedJoke = await getJokeById(index)

        if (!fetchedJoke) {
          throw new Error(ERROR_MESSAGES.FETCH_FAILED)
        }

        setJoke(fetchedJoke)
      } catch (error) {
        const message = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN
        setErrorMessage(message)
        console.error('Error while fetching joke of the day:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJokeOfTheDay()
    fetchedRef.current = true
  }, [getJokeById])

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
            <p className="text-lg font-semibold">{ERROR_MESSAGES.TITLE}</p>
            <p className="text-muted-foreground mt-2">{errorMessage}</p>
          </div>
        ) : isLoading ? (
          <JokeCardSkeleton />
        ) : joke ? (
          <JokeCardWrapper joke={joke} />
        ) : (
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <p className="text-muted-foreground">無法載入笑話</p>
          </div>
        )}
      </section>
    </div>
  )
}
