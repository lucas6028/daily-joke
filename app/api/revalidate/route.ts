import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const revalidatePathSchema = z.object({ path: z.string().min(1).optional() })

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // validate path param
  const rawPath = request.nextUrl.searchParams.get('path')
  let params
  try {
    params = revalidatePathSchema.parse({ path: rawPath ?? undefined })
  } catch {
    return NextResponse.json<{ message: string }>(
      { message: 'Invalid path parameter' },
      { status: 400 }
    )
  }
  const path = params.path ?? '/'

  try {
    await revalidatePath(path)
    return NextResponse.json<{ success: boolean; message: string }>({
      success: true,
      message: `Revalidated ${path}`,
    })
  } catch (error) {
    console.error('Error while revalidating page, ', error)
    return NextResponse.json<{ message: string }>(
      { message: 'Revalidate error occurred' },
      { status: 500 }
    )
  }
}
