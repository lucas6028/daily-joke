import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

interface ErrorResponse {
  message: string
  status?: number
}

/**
 * Captures API errors with Sentry and returns a standardized NextResponse
 *
 * @param error The error object
 * @param message User-friendly error message
 * @param status HTTP status code (defaults to 500)
 * @param context Additional context to include with the error
 * @returns NextResponse with error message and status
 */
export function captureAPIError(
  error: unknown,
  message: string = 'An unexpected error occurred',
  status: number = 500,
  context: Record<string, unknown> = {}
): NextResponse<ErrorResponse> {
  // Log to console (useful for local development)
  console.error(`API Error: ${message}`, error)

  // Capture the error in Sentry with additional context
  Sentry.captureException(error, {
    extra: {
      ...context,
      api_error: true,
    },
  })

  // Return standardized error response
  return NextResponse.json<ErrorResponse>({ message }, { status })
}
