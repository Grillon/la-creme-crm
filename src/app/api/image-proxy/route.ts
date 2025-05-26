import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  const token = req.nextUrl.searchParams.get('token')

  // Remplace ce token par un secret que toi seul connais
  if (token !== process.env.IMAGE_PROXY_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!url || !url.startsWith('https://drive.google.com/uc')) {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=0',
      },
    })
  } catch {
    return new NextResponse('Error fetching image', { status: 500 })
  }
}

