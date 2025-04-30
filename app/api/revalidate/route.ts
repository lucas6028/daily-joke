import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { captureAPIError } from '@/utils/api-error-handler'
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
  } catch (err) {
    return captureAPIError(err, 'Invalid path parameter', 400, {
      path: request.nextUrl.pathname,
      params: request.nextUrl.searchParams.toString(),
    })
  }
  const path = params.path ?? '/'

  try {
    await revalidatePath(path)
    return NextResponse.json<{ success: boolean; message: string }>({
      success: true,
      message: `Revalidated ${path}`,
    })
  } catch (error) {
    return captureAPIError(error, 'Revalidate error occurred', 500, {
      path: request.nextUrl.pathname,
      revalidatePath: path,
    })
  }
}
