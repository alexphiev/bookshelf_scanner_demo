'use client'

import { Book } from '@/types/books'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export const ScanResult = ({
  books,
  retry,
}: {
  books: Book[]
  retry: () => void
}) => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [foundIndices, setFoundIndices] = useState<number[]>(books.map(() => 0))
  const router = useRouter()

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = () => {
    if (x.get() < -100) {
      handleNext()
    } else if (x.get() > 100) {
      handlePrevious()
    }
    x.set(0)
  }

  const handleReject = () => {
    const currentBook = books[currentBookIndex]
    const currentFoundIndex = foundIndices[currentBookIndex]

    if (currentFoundIndex < currentBook.booksFound.length - 1) {
      const newFoundIndices = [...foundIndices]
      newFoundIndices[currentBookIndex] = currentFoundIndex + 1
      setFoundIndices(newFoundIndices)
    } else if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1)
    }
  }

  console.log(JSON.stringify(books, null, 2))

  const selectedBook = books[currentBookIndex]
  let displayedBook: {
    title: string
    authors: string | string[]
    publisher: string
    imageLinks?: {
      thumbnail: string
    }
  } = selectedBook.booksFound[foundIndices[currentBookIndex]]

  if (!displayedBook) {
    displayedBook = {
      title: selectedBook.detectedTitle,
      authors: selectedBook.detectedAuthors,
      publisher: selectedBook.detectedPublisher,
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between overflow-y-auto">
      <div className="flex h-full max-h-[90vh] w-full max-w-[600px] flex-col items-center p-2 lg:p-4">
        <Tabs
          defaultValue="ui"
          className="flex h-full w-full flex-col gap-2 lg:gap-4"
        >
          <TabsList className="grid w-full grid-cols-2 bg-primary text-primary-foreground">
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="ui" className="m-0 w-full flex-grow">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity }}
              dragElastic={0.5} // Add some elasticity for smoother drag
              dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} // Adjust bounce for smoother end
              onDragEnd={handleDragEnd}
              className="h-full w-full"
            >
              <Card className="h-full w-full overflow-hidden p-0">
                <CardContent className="h-full overflow-hidden p-0">
                  <div className="relative flex h-full flex-col items-center justify-between">
                    {books.length > 0 && (
                      <div className="relative h-full w-full cursor-grab">
                        <div className="absolute inset-0 overflow-hidden rounded-lg shadow-lg">
                          {displayedBook.imageLinks ? (
                            <Image
                              src={
                                displayedBook.imageLinks?.thumbnail ||
                                '/placeholder.svg?height=384&width=256'
                              }
                              fill
                              alt={displayedBook.title}
                              className="h-full w-full object-contain object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-orange-100">
                              No image available
                            </div>
                          )}
                          <div className="absolute bottom-0 flex w-full flex-col items-center justify-between gap-2">
                            {foundIndices[currentBookIndex] <
                              selectedBook.booksFound.length - 1 && (
                              <Button
                                variant="default"
                                size="sm"
                                className="w-fit rounded-sm"
                                onClick={handleReject}
                              >
                                Wrong guess? Try again...
                              </Button>
                            )}
                            <div className="w-full bg-gradient-to-t from-primary to-primary/30 p-4 text-white backdrop-blur-sm">
                              <h3 className="line-clamp-2 text-lg font-bold">
                                {displayedBook.title}
                              </h3>
                              <p className="line-clamp-2 text-sm">
                                {displayedBook.authors}
                              </p>
                              <p className="line-clamp-1 text-xs text-gray-300">
                                {displayedBook.publisher}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          className="absolute left-1 top-1/2 h-8 w-8 -translate-y-1/2 transform rounded-full bg-primary/50 p-1"
                          onClick={handlePrevious}
                          disabled={currentBookIndex === 0}
                        >
                          <ArrowLeft />
                        </Button>
                        <Button
                          variant="default"
                          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 transform rounded-full bg-primary/50 p-1"
                          onClick={handleNext}
                          disabled={currentBookIndex === books.length - 1}
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent
            value="json"
            className="m-0 w-full flex-grow overflow-hidden"
          >
            <Card className="flex h-full flex-col">
              <CardContent className="overflow-auto p-4">
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(books, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <div className="flex w-full justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-1/2"
            >
              Close
            </Button>
            <Button onClick={retry} className="w-1/2">
              Retry
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
