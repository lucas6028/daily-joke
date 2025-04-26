import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const getSingleJokeParamsSchema = z.object({
  id: z.preprocess((val) => parseInt(val as string, 10), z.number().int().positive()),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  // validate query params
  let params
  try {
    params = getSingleJokeParamsSchema.parse({ id: searchParams.get('id') ?? '' })
  } catch (err) {
    console.error('Error while validating query params', err)
    return NextResponse.json({ message: 'Invalid id parameter' }, { status: 400 })
  }
  const id = params.id
  const supabase = await createClient()

  try {
    const { data: jokes, error } = await supabase
      .from('jokes')
      .select(
        `
        *,
        ratings:ratings(*)
        `
      )
      .eq('id', id)
      .limit(1)
      .single()

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json({ message: 'Database error occurred.' }, { status: 500 })
    }

    return NextResponse.json(jokes)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 })
  }
}
