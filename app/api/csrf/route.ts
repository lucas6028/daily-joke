import { NextRequest, NextResponse } from 'next/server'

function generateCsrfToken() {
  return randomBytes(32).toString('hex')
}

export async function GET(request: NextRequest) {
  const csrfToken = generateCsrfToken()

  res.setHeader('Set-Cookie', `csrfToken=${csrfToken}; Path=/; SameSite=Strict`)

  return NextResponse.json({
    message: 'Save csrf token to cookies successfully!',
    status: 200,
  })
}
