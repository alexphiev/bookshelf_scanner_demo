'use client'

import { ScanResult } from '@/components/scan-result'
import { Button } from '@/components/ui/button'
import { cn, fileToBase64 } from '@/lib/utils'
import { Book } from '@/types/books'
import imageCompression from 'browser-image-compression'
import { Camera, LoaderCircle, RotateCw, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scannerPosition, setScannerPosition] = useState(0)
  const [scanResult, setScanResult] = useState<Book[] | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const usageCount = parseInt(localStorage.getItem('usageCount') || '0', 10)
    const demoLimit = parseInt(process.env.NEXT_PUBLIC_DEMO_LIMIT || '0', 10)

    if (usageCount >= demoLimit) {
      router.push('/')
    }
  }, [router])

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCapturing(true)
    const file = event.target.files?.[0]
    if (file) {
      console.log(`Original file size ${file.size / 1024 / 1024} MB`)

      // Compress the image
      try {
        const options = {
          maxSizeMB: parseInt(
            process.env.NEXT_PUBLIC_MAX_COMPRESSED_IMAGE_SIZE_MB || '1',
            10
          ),
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)
        setCompressedFile(compressedFile)
        console.log(
          `Compressed file size ${compressedFile.size / 1024 / 1024} MB`
        )

        // Set the original image for display
        const reader = new FileReader()
        reader.onload = (e) => setCapturedImage(e.target?.result as string)
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error('Error compressing image:', error)
        setCompressedFile(file) // Fallback to original if compression fails
      }
    }
    setIsCapturing(false)
  }

  const retryCapture = () => {
    setScanResult(null)
    setCapturedImage(null)
    setCompressedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startAnalyzing = async () => {
    if (!compressedFile) return

    setIsAnalyzing(true)
    const interval = setInterval(() => {
      setScannerPosition((prev) => (prev + 1) % 200)
    }, 10)

    try {
      const imageBase64 = await fileToBase64(compressedFile)
      const response = await fetch('/api/bookshelf/scan', {
        method: 'POST',
        body: JSON.stringify({
          image_base64: imageBase64,
        }),
      })

      console.log('response', response)

      if (!response.ok) {
        // Handle HTTP error response
        toast.error('Error analyzing the image', {
          description: response.statusText,
        })
      } else {
        const result: Book[] = await response.json()
        setScanResult(result)
        localStorage.setItem(
          'usageCount',
          (
            parseInt(localStorage.getItem('usageCount') || '0', 10) + 1
          ).toString()
        )
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
      clearInterval(interval)
    }
  }

  return (
    <div className="fixed inset-0">
      {isAnalyzing && (
        <LoaderCircle className="absolute left-4 top-4 z-10 h-6 w-6 animate-spin text-white" />
      )}
      {!scanResult && (
        <Button
          className="absolute right-2 top-2 z-10"
          variant="ghost"
          onClick={() => router.push('/')}
        >
          <X className="h-6 w-6 text-primary" />
        </Button>
      )}
      {isCapturing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {!capturedImage ? (
        <div className="flex h-full flex-col items-center justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            className="hidden"
          />
          {!isCapturing && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="default"
            >
              <Camera className="mr-2 h-4 w-4" /> Take Photo
            </Button>
          )}
        </div>
      ) : (
        <>
          {scanResult ? (
            <ScanResult books={scanResult} retry={retryCapture} />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src={capturedImage}
                  alt="Captured image"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  className={cn(
                    'transition-opacity duration-300',
                    isCapturing ? 'opacity-50' : 'opacity-100'
                  )}
                />
              </div>
              {isAnalyzing && (
                <div
                  className="absolute left-0 top-0 h-1 w-full bg-blue-500 opacity-40"
                  style={{
                    transform: `translateY(${Math.min(scannerPosition, 100)}vh)`,
                    width:
                      scannerPosition > 100
                        ? `${200 - scannerPosition}%`
                        : '100%',
                  }}
                />
              )}
              {!isAnalyzing && !isCapturing && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
                  <Button
                    onClick={retryCapture}
                    variant="outline"
                    className="w-[100px]"
                  >
                    <RotateCw className="mr-2 h-4 w-4" /> Retry
                  </Button>
                  <Button onClick={startAnalyzing} className="w-[100px]">
                    Analyze
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
