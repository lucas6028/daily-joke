import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyCSRFToken } from '@/utils/csrf'
import { captureAPIError } from '@/utils/api-error-handler'
import type { Rating } from '@/types/rating'
import { z } from 'zod'

const getRatingParamsSchema = z.object({
  id: z.preprocess((val) => parseInt(val as string, 10), z.number().int().positive()),
})
const postRatingBodySchema = z.object({
  joke_id: z.number().int().positive(),
  rating: z.number().int().min(0).max(10),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  // validate query params
  let params
  try {
    params = getRatingParamsSchema.parse({ id: searchParams.get('id') ?? '' })
  } catch (err) {
    return captureAPIError(err, 'Invalid id parameter', 400, {
      path: request.nextUrl.pathname,
      params: searchParams.toString(),
    })
  }
  const id = params.id
  const supabase = await createClient()

  try {
    const { data: ratings, error } = await supabase.from('ratings').select('*').eq('joke_id', id)

    if (error) {
      return captureAPIError(error, 'Database error occurred', 500, {
        path: request.nextUrl.pathname,
        jokeId: id,
      })
    }

    return NextResponse.json<Rating[]>(ratings)
  } catch (err) {
    return captureAPIError(err, 'Database error occurred', 500, {
      path: request.nextUrl.pathname,
      jokeId: id,
    })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Determine the expected origin based on Vercel environment variables or fallback
  const expectedOrigin = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000')

  // Check origin to ensure the request is from the expected origin
  const origin = request.headers.get('origin')
  try {
    const normalizedOrigin = origin ? new URL(origin).origin : null
    const normalizedExpectedOrigin = expectedOrigin ? new URL(expectedOrigin).origin : null
    const normalizedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL).origin
      : null
    if (
      !normalizedOrigin ||
      (normalizedOrigin !== normalizedExpectedOrigin && normalizedOrigin !== normalizedBaseUrl)
    ) {
      console.warn(
        `Origin mismatch: received '${normalizedOrigin}', expected '${normalizedExpectedOrigin}'`
      )
      return NextResponse.json<{ message: string }>(
        { message: 'Unauthorized request origin' },
        { status: 403 }
      )
    }
  } catch (err) {
    return captureAPIError(err, 'Invalid origin header', 400, {
      path: request.nextUrl.pathname,
      origin,
    })
  }

  // Verify CSRF token
  const csrfToken = request.headers.get('x-csrf-token')
  if (!csrfToken || !verifyCSRFToken(csrfToken)) {
    return captureAPIError(
      new Error(!csrfToken ? 'Missing CSRF token' : 'Invalid CSRF token'),
      !csrfToken ? 'Missing CSRF token' : 'Invalid CSRF token',
      403,
      {
        path: request.nextUrl.pathname,
        csrfError: !csrfToken ? 'missing' : 'invalid',
      }
    )
  }

  // validate body
  let data
  try {
    const json = await request.json()
    data = postRatingBodySchema.parse(json)
  } catch (err) {
    return captureAPIError(err, 'Invalid request body', 400, {
      path: request.nextUrl.pathname,
    })
  }
  const { joke_id, rating } = data

  try {
    const { error } = await supabase.from('ratings').insert({ rating: rating, joke_id: joke_id })

    if (error) {
      return captureAPIError(error, 'Database error occurred', 500, {
        path: request.nextUrl.pathname,
        jokeId: joke_id,
        rating,
      })
    }

    return NextResponse.json<{ message: string; status: number }>({
      message: 'Insert new rating successfully.',
      status: 200,
    })
  } catch (err) {
    return captureAPIError(err, 'An unexpected error occurred', 500, {
      path: request.nextUrl.pathname,
      jokeId: joke_id,
      rating,
    })
  }
}
