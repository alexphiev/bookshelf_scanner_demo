'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1>An error occurred in the scanner page</h1>
      <NextError statusCode={0} />
    </div>
  )
}
