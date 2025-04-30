import { NextRequest, NextResponse } from 'next/server'
import type { Joke } from '@/types/joke'
import { createClient } from '@/lib/supabase/server'
import { captureAPIError } from '@/utils/api-error-handler'
import { z } from 'zod'

const getSingleJokeParamsSchema = z.object({
  id: z.preprocess((val) => parseInt(val as string, 10), z.number().int().positive()),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  // validate query params
  let params
  try {
    params = getSingleJokeParamsSchema.parse({ id: searchParams.get('id') ?? '' })
  } catch (err) {
    return captureAPIError(err, 'Invalid id parameter', 400, {
      path: request.nextUrl.pathname,
      params: searchParams.toString(),
    })
  }
  const id = params.id
  const supabase = await createClient()

  try {
    const { data: joke, error } = await supabase
      .from('jokes')
      .select(
        `
        *,
        ratings:ratings(*)
        `
      )
      .eq('id', id)
      .limit(1)
      .single()

    if (error || !joke) {
      return captureAPIError(error, 'Database error occurred', 500, {
        path: request.nextUrl.pathname,
        jokeId: id,
      })
    }

    return NextResponse.json<Joke>(joke)
  } catch (err) {
    return captureAPIError(err, 'An unexpected error occurred', 500, {
      path: request.nextUrl.pathname,
      jokeId: id,
    })
  }
}
