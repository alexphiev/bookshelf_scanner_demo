'use server'

import { Book } from '@/types/books.types'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/bookshelf/scan:
 *   post:
 *     summary: Scan bookshelf and identify books
 *     description: Processes an image of a bookshelf and returns identified books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image of the bookshelf
 *     responses:
 *       200:
 *         description: Successfully identified books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * components:
 *   schemas:
 *     BookData:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *           enum: [google, open_library, hybrid]
 *         source_id:
 *           type: string
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         authors:
 *           type: string
 *         publisher:
 *           type: string
 *         isbn_13:
 *           type: string
 *           nullable: true
 *         isbn_10:
 *           type: string
 *           nullable: true
 *         language:
 *           type: string
 *           nullable: true
 *         cover_url:
 *           type: string
 *           nullable: true
 *         relevance_score:
 *           type: number
 *           nullable: true
 *     Book:
 *       type: object
 *       properties:
 *         detectedTitle:
 *           type: string
 *         detectedAuthors:
 *           type: string
 *         detectedPublisher:
 *           type: string
 *         detectedLanguage:
 *           type: string
 *         booksFound:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookData'
 */
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
