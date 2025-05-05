'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'
import JokeCardWrapper from '@/components/joke-card-wrapper'
import JokeCardSkeleton from '@/components/joke-card-skeleton'
import { Joke } from '@/types/joke'
import { useJokeContext } from '@/context/joke-context'

const MAX_JOKE_ID = 75
const ERROR_MESSAGES = {
  INVALID_ID: '此 ID 未符合標準',
  OUT_OF_RANGE: '抱歉。沒有此 ID 的笑話',
  FETCH_FAILED: '無法獲取笑話，請稍後再試',
  UNKNOWN: '發生未知錯誤',
  TITLE: '笑話載入失敗',
}

export default function Single({ params }: { readonly params: { readonly id: string } }) {
  const { getJokeById } = useJokeContext()
  const [joke, setJoke] = useState<Joke | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchJoke = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    const index = Number.parseInt(params.id, 10)
    // Reject non-integer strings like "12.3" or "1e2"
    if (!/^\d+$/.test(params.id)) {
      setErrorMessage(ERROR_MESSAGES.INVALID_ID)
      setIsLoading(false)
      return
    }

    if (index < 1 || index > MAX_JOKE_ID) {
      setErrorMessage(ERROR_MESSAGES.OUT_OF_RANGE)
      setIsLoading(false)
      return
    }

    try {
      const fetchedJoke = await getJokeById(index)

      if (!fetchedJoke) {
        throw new Error(ERROR_MESSAGES.FETCH_FAILED)
      }

      setJoke(fetchedJoke)
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN
      setErrorMessage(message)
      console.error('Error while fetching joke:', error)
    } finally {
      setIsLoading(false)
    }
  }, [getJokeById, params.id])

  useEffect(() => {
    fetchJoke()
  }, [fetchJoke])

  return (
    <div className="space-y-10">
      <section>
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
