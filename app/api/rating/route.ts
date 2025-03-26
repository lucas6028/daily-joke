import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = parseInt(searchParams.get('id') || '1', 10)

  try {
    const { data: ratings, error } = await supabase.from('ratings').select('*').eq('joke_id', id)

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json(ratings)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: err, status: 401 })
  }
}

export async function POST(request: NextRequest) {
  // Check origin to ensure the request is from the same origin
  const origin = request.headers.get('origin')
  console.log('origin:', origin)
  if (!origin || !origin.startsWith(process.env.NEXT_PUBLIC_BASE_URL!)) {
    return NextResponse.json({ message: 'Unauthorized request origin', status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { joke_id, rating } = await request.json()

  if (rating < 0 || rating > 10) {
    return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 })
  }

  try {
    console.log('insert new rating, joke_id:', joke_id, ', new rating:', rating)
    const { error } = await supabase.from('ratings').insert({ rating: rating, joke_id: joke_id })

    if (error) {
      console.error('Error while insert new rating from supabase', error)
      return NextResponse.json({ message: error, statuts: 500 })
    }

    return NextResponse.json({
      message: 'Insert new rating successfuuly.',
      status: 200,
    })
  } catch (err) {
    console.error('Error while inserting new rating', err)
    return NextResponse.json({ message: err, status: 401 })
  }
}
