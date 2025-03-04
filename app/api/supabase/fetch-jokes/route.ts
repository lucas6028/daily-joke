import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '1', 10)
  const id = parseInt(searchParams.get('id') || '1', 10)

  try {
    const {data: jokes, error } = await supabase
      .from('jokes')
      .select()
      .eq('id', id)
      .limit(limit)
      .single()

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json(jokes)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: err, status: 401})
  }
}
