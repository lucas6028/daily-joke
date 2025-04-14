import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/utils/csrf'

export async function GET() {
  // Generate a new CSRF token and set it as a cookie
  const token = generateCSRFToken()

  // Return the token to the client
  return NextResponse.json({ csrfToken: token })
}
