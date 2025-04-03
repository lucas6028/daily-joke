import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase/client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  if (!category) {
    return NextResponse.json({ message: 'Invalid category' }, { status: 400 })
  }

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

    return NextResponse.json(jokes)
  } catch (err) {
    console.error(`Error while fetching ${category} jokes`, err)
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 401 })
  }
}
