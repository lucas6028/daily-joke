import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { captureAPIError } from '@/utils/api-error-handler'
import { z } from 'zod'
import type { Joke } from '@/types/joke'

const getCategoryParamsSchema = z.object({ category: z.string().min(1) })

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  // validate query params
  let params
  try {
    params = getCategoryParamsSchema.parse({ category: searchParams.get('category') ?? '' })
  } catch (err) {
    return captureAPIError(err, 'Invalid category parameter', 400, {
      path: request.nextUrl.pathname,
      params: searchParams.toString(),
    })
  }
  const category = params.category
  const supabase = await createClient()

  try {
    const { data: jokes, error } = await supabase
      .from('jokes')
      .select(
        `
        *,
        ratings:ratings(*)
        `
      )
      .eq('category', category)

    if (error) {
      return captureAPIError(error, 'Database error occurred', 500, {
        path: request.nextUrl.pathname,
        category,
      })
    }

    return NextResponse.json<Joke[]>(jokes)
  } catch (err) {
    return captureAPIError(err, 'An unexpected error occurred', 500, {
      path: request.nextUrl.pathname,
      category,
    })
  }
}
