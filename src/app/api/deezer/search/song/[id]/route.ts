import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    const response = await axios.get(`https://api.deezer.com/track/${id}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Deezer API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Deezer API' },
      { status: 500 }
    )
  }
}
