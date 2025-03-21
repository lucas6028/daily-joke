import crypto from 'crypto'
import { cookies } from 'next/headers';

// Generate a CSRF token
export async function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString('hex') as string
  const cookieStore = await cookies()

  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  return token
}

// Verify a CSRF token
export async function verifyCSRFToken(token: string) {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('csrf-token')?.value
  return token === cookieToken
}
