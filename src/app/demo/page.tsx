'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Code, Database, ScanText } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DemoLimitReached = dynamic(
  () => import('@/components/demo-limit-reached'),
  {
    loading: () => <p>Loading...</p>,
  }
)

export default function DemoPage() {
  const router = useRouter()
  const [limitReached, setLimitReached] = useState(false)

  const handleDemoClick = () => {
    const usageCount = parseInt(localStorage.getItem('usageCount') || '0', 10)
    const demoLimit = parseInt(process.env.NEXT_PUBLIC_DEMO_LIMIT || '0', 10)

    if (usageCount >= demoLimit) {
      setLimitReached(true)
    } else {
      router.push('/scanner')
    }
  }

  return (
    <>
      <Card className="h-full w-full border-none shadow-none">
        <div className="flex h-full w-full flex-col justify-between">
          <CardHeader className="py-0">
            <h1 className="text-center text-2xl font-semibold tracking-tight text-primary">
              Experience the power of the Booshelf Scanner API
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col space-y-8">
            <p className="text-muted-foreground">
              This app demonstrates the capabilities of the Booshelf Scanner API
              and also serves as an example of implementation. It is using the
              production API, so you see the real results.
            </p>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">What&apos;s included</h2>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <ScanText className="h-4 w-4" />
                  <span>10 Free Scans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Real Production Data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Open Source Code</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" onClick={handleDemoClick}>
              Try the demo
            </Button>
            <p className="text-center text-xs text-gray-500">
              By using this demo, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardFooter>
        </div>
      </Card>
      {limitReached && (
        <DemoLimitReached
          isOpen={limitReached}
          onOpenChange={setLimitReached}
        />
      )}
    </>
  )
}
