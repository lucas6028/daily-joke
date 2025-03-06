import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const searchParams = request.nextUrl.searchParams;
  const joke_id = parseInt(searchParams.get('joke_id') || '0', 10)
  const new_rating = parseInt(searchParams.get('rating') || '5', 10)

  try {
    console.log('insert new rating, joke_id:', joke_id, ', new rating:', new_rating)
    const { error } = await supabase
      .from('ratings')
      .insert({ rating: new_rating, joke_id: joke_id })

    if (error) {
      console.error('Error while insert new rating from supabase', error)
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json({ message: 'Insert new rating successfuuly.', status: 200 })
  } catch (err) {
    console.error('Error while inserting new rating', err)
    return NextResponse.json({ message: err, status: 401})
  }
}
