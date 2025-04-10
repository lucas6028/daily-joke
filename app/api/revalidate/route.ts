import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Path to revalidate (default to home page '/')
  const path = request.nextUrl.searchParams.get('path') ?? '/'

  try {
    await revalidatePath(path)
    return NextResponse.json({ success: true, message: `Revalidated ${path}` })
  } catch (error) {
    console.error('Error while revalidating page, ', error)
    return NextResponse.json({ message: 'Revalidate error occurred' }, { status: 500 })
  }
}
