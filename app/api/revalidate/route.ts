import { NextRequest, NextResponse } from 'next/server'
import { revalidate } from 'next/cache'

export async function POST(request: NextRequest) {
  const body = await request.body.json()
  const secret = body.secret

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthroized' }, { status: 401 })
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
