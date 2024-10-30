'use server'

import { Book } from '@/types/books.types'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/demo`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
      },
      duplex: 'half',
    } as RequestInit
  )

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} - ${response.statusText}`)
  }
  const data: Book[] = await response.json()
  return NextResponse.json(data)
}
