import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/utils/csrf'

export async function GET() {
  // Generate a new CSRF token and set it as a cookie
  try {
    const token = generateCSRFToken()

    // Return the token to the client
    return NextResponse.json({ csrfToken: token })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json({ message: 'Failed to generate CSRF token' }, { status: 500 })
  }
}
