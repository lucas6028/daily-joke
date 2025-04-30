import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/utils/csrf'
import { captureAPIError } from '@/utils/api-error-handler'

export async function GET() {
  // Generate a new CSRF token and set it as a cookie
  try {
    const token = generateCSRFToken()

    // Return the token to the client
    return NextResponse.json({ csrfToken: token })
  } catch (error) {
    return captureAPIError(error, 'Failed to generate CSRF token', 500, {
      path: '/api/csrf',
    })
  }
}
