import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyCSRFToken } from '@/utils/csrf'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = parseInt(searchParams.get('id') || '1', 10)
  const supabase = await createClient()

  try {
    const { data: ratings, error } = await supabase.from('ratings').select('*').eq('joke_id', id)

    if (error) {
      console.error('Error while fetching jokes from supabase', error)
      return NextResponse.json({ message: 'Database error occurred' }, { status: 500 })
    }

    return NextResponse.json(ratings)
  } catch (err) {
    console.error('Error while fetching jokes', err)
    return NextResponse.json({ message: 'Database error occurred.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check origin to ensure the request is from the same origin
  const origin = request.headers.get('origin')
  if (!origin?.startsWith(process.env.NEXT_PUBLIC_BASE_URL!)) {
    return NextResponse.json({ message: 'Unauthorized request origin' }, { status: 403 })
  }

  // Verify CSRF token
  const csrfToken = request.headers.get('x-csrf-token')
  if (!csrfToken || !verifyCSRFToken(csrfToken)) {
    return NextResponse.json(
      {
        message: !csrfToken ? 'Missing CSRF token' : 'Invalid CSRF token',
      },
      { status: 403 }
    )
  }

  const { joke_id, rating } = await request.json()

  if (rating < 0 || rating > 10) {
    return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 })
  }

  try {
    const { error } = await supabase.from('ratings').insert({ rating: rating, joke_id: joke_id })

    if (error) {
      console.error('Error while insert new rating from supabase', error)
      return NextResponse.json({ message: 'Database error occurred.' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Insert new rating successfuuly.',
      status: 200,
    })
  } catch (err) {
    console.error('Error while inserting new rating', err)
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 })
  }
}
