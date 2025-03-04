import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = parseInt(searchParams.get('id') || '1', 10)

  try {
    const {data: ratings, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('joke_id', id)

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json(ratings)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: err, status: 401})
  }
}
