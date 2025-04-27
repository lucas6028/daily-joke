import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Joke } from '@/types/joke'

const getCategoryParamsSchema = z.object({ category: z.string().min(1) })

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  // validate query params
  let params
  try {
    params = getCategoryParamsSchema.parse({ category: searchParams.get('category') ?? '' })
  } catch (err) {
    console.error('Error while validating query params', err)
    return NextResponse.json({ message: 'Invalid category parameter' }, { status: 400 })
  }
  const category = params.category
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
      .eq('category', category)

    if (error) {
      console.error(`Error while fetching ${category} jokes from supabase`, error)
      return NextResponse.json({ message: 'Database error occurred' }, { status: 500 })
    }

    return NextResponse.json<Joke[]>(jokes)
  } catch (err) {
    console.error(`Error while fetching ${category} jokes`, err)
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 })
  }
}
