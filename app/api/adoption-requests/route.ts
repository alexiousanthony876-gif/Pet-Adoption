import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase.from('adoption_requests').select(`
      *,
      pets (name, image_url),
      users (email, phone)
    `)

    // If admin, show all requests; otherwise show only user's requests
    if (user.user_metadata?.user_type !== 'admin') {
      query = query.eq('user_id', user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching adoption requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch adoption requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from('adoption_requests').insert([
      {
        ...body,
        user_id: user.id,
        status: 'pending',
      },
    ])

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating adoption request:', error)
    return NextResponse.json(
      { error: 'Failed to create adoption request' },
      { status: 500 }
    )
  }
}
