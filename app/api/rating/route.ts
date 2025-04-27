import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyCSRFToken } from '@/utils/csrf'
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
    console.error('Error while validating query params', err)
    return NextResponse.json<{ message: string }>(
      { message: 'Invalid id parameter' },
      { status: 400 }
    )
  }
  const id = params.id
  const supabase = await createClient()

  try {
    const { data: ratings, error } = await supabase.from('ratings').select('*').eq('joke_id', id)

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json<{ message: string }>(
        { message: 'Database error occurred' },
        { status: 500 }
      )
    }

    return NextResponse.json<Rating[]>(ratings)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json<{ message: string }>(
      { message: 'Database error occurred.' },
      { status: 500 }
    )
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
    console.error('Error while normalizing origins', err)
    return NextResponse.json<{ message: string }>(
      { message: 'Invalid origin header' },
      { status: 400 }
    )
  }

  // Verify CSRF token
  const csrfToken = request.headers.get('x-csrf-token')
  if (!csrfToken || !verifyCSRFToken(csrfToken)) {
    return NextResponse.json<{ message: string }>(
      { message: !csrfToken ? 'Missing CSRF token' : 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // validate body
  let data
  try {
    const json = await request.json()
    data = postRatingBodySchema.parse(json)
  } catch (err) {
    console.error('Error while validating request body', err)
    return NextResponse.json<{ message: string }>(
      { message: 'Invalid request body' },
      { status: 400 }
    )
  }
  const { joke_id, rating } = data

  try {
    const { error } = await supabase.from('ratings').insert({ rating: rating, joke_id: joke_id })

    if (error) {
      console.error('Error while insert new rating from supabase', error)
      return NextResponse.json<{ message: string }>(
        { message: 'Database error occurred.' },
        { status: 500 }
      )
    }

    return NextResponse.json<{ message: string; status: number }>({
      message: 'Insert new rating successfully.',
      status: 200,
    })
  } catch (err) {
    console.error('Error while inserting new rating', err)
    return NextResponse.json<{ message: string }>(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
