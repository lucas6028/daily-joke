import { NextRequest, NextResponse } from 'next/server'
import { revalidate } from 'next/cache'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Path to revalidate (default to home page '/')
  const path = body.path || '/'

  try {
    await revalidate(path)
    return NextResponse.json({ success: true, message: `Revalidated ${path}` })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
