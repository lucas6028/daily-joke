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

// Helper function to safely get origin string
function getNormalizedOrigin(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).origin
  } catch {
    // Treat invalid URLs as null origin, could also throw or log
    console.warn(`Invalid URL format for origin: ${url}`)
    return null
  }
}

// Helper function to validate request origin
async function validateOrigin(request: NextRequest): Promise<NextResponse | null> {
  const requestOriginHeader = request.headers.get('origin')
  const requestPath = request.nextUrl.pathname

  // Determine expected origins
  // Use NEXT_PUBLIC_BASE_URL as the primary expected origin if available, otherwise fallback to VERCEL_URL or localhost
  const primaryExpectedOriginUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null)
  // Always allow localhost for local development
  const localhostOrigin = 'http://localhost:3000'

  const normalizedRequestOrigin = getNormalizedOrigin(requestOriginHeader)
  const normalizedPrimaryExpectedOrigin = getNormalizedOrigin(primaryExpectedOriginUrl)
  const normalizedLocalhostOrigin = getNormalizedOrigin(localhostOrigin) // Should always be valid

  if (!normalizedRequestOrigin) {
    // Origin header is missing or invalidly formatted
    return captureAPIError(
      new Error('Invalid or missing origin header'),
      'Invalid or missing origin header',
      400,
      {
        path: requestPath,
        origin: requestOriginHeader ?? 'missing',
      }
    )
  }

  // Check against allowed origins
  const isAllowed =
    normalizedRequestOrigin === normalizedPrimaryExpectedOrigin ||
    normalizedRequestOrigin === normalizedLocalhostOrigin

  if (!isAllowed) {
    console.warn(
      `Origin mismatch: received '${normalizedRequestOrigin}', expected '${normalizedPrimaryExpectedOrigin}' or '${normalizedLocalhostOrigin}'`
    )
    return NextResponse.json<{ message: string }>(
      { message: 'Unauthorized request origin' },
      { status: 403 }
    )
  }

  // Origin is valid
  return null
}

// Helper function to validate CSRF token
function validateCsrf(request: NextRequest): NextResponse | null {
  const csrfToken = request.headers.get('x-csrf-token')
  const requestPath = request.nextUrl.pathname

  if (!csrfToken) {
    return captureAPIError(new Error('Missing CSRF token'), 'Missing CSRF token', 403, {
      path: requestPath,
      csrfError: 'missing',
    })
  }
  if (!verifyCSRFToken(csrfToken)) {
    return captureAPIError(new Error('Invalid CSRF token'), 'Invalid CSRF token', 403, {
      path: requestPath,
      csrfError: 'invalid',
    })
  }
  // CSRF token is valid
  return null
}

// Helper function to parse and validate request body
async function parseAndValidateBody(
  request: NextRequest
): Promise<{
  data: z.infer<typeof postRatingBodySchema> | null
  errorResponse: NextResponse | null
}> {
  try {
    const json = await request.json()
    const data = postRatingBodySchema.parse(json)
    return { data, errorResponse: null }
  } catch (err) {
    const errorResponse = captureAPIError(err, 'Invalid request body', 400, {
      path: request.nextUrl.pathname,
    })
    return { data: null, errorResponse }
  }
}

export async function POST(request: NextRequest) {
  // Validate Origin
  const originErrorResponse = await validateOrigin(request)
  if (originErrorResponse) {
    return originErrorResponse
  }

  // Validate CSRF Token
  const csrfErrorResponse = validateCsrf(request)
  if (csrfErrorResponse) {
    return csrfErrorResponse
  }

  // Parse and Validate Body
  const { data, errorResponse: bodyErrorResponse } = await parseAndValidateBody(request)
  if (bodyErrorResponse) {
    return bodyErrorResponse
  }
  // We know data is not null here due to the check above
  const { joke_id, rating } = data!

  // Perform Database Operation
  const supabase = await createClient()
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
    // Catch unexpected errors during Supabase client interaction or insertion
    return captureAPIError(err, 'An unexpected error occurred during database operation', 500, {
      path: request.nextUrl.pathname,
      jokeId: joke_id,
      rating,
    })
  }
}
