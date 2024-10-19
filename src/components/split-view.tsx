import { Card } from './ui/card'
import { SquareLibrary } from 'lucide-react'

export const SplitView = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Mobile view */}
      <div className="container relative flex h-[100vh] max-h-[600px] flex-col items-center justify-center lg:hidden">
        {children}
      </div>

      {/* Desktop view */}
      <Card className="hidden h-full w-full flex-col justify-center overflow-hidden rounded-lg shadow-2xl lg:flex lg:h-[600px] lg:w-[1000px]">
        <div className="container relative grid h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <SquareLibrary className="mr-2 h-6 w-6" />
              Bookshelf Scanner API
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote>
            </div>
          </div>
          <div className="hidden h-full w-full flex-col justify-between p-4 lg:flex lg:p-10">
            {children}
          </div>
        </div>
      </Card>
    </div>
  )
}
