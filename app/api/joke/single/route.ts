import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paramID = searchParams.get('id')
  if (!paramID) {
    return NextResponse.json({ message: 'Invalid joke id', status: 400 })
  }
  const id = parseInt(paramID, 10)

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
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json(jokes)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: err, status: 401 })
  }
}
