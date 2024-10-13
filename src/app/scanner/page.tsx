'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { X, Camera, RotateCw } from 'lucide-react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scannerPosition, setScannerPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Set the original image for display
      const reader = new FileReader()
      reader.onload = (e) => setCapturedImage(e.target?.result as string)
      reader.readAsDataURL(file)

      // Compress the image
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)
        setCompressedFile(compressedFile)
      } catch (error) {
        console.error('Error compressing image:', error)
        setCompressedFile(file) // Fallback to original if compression fails
      }
    }
  }

  const retryCapture = () => {
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
      const formData = new FormData()
      formData.append('image', compressedFile)

      const response = await fetch('https://api.example.com/analyze', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      localStorage.setItem('scanResult', JSON.stringify(result))
      clearInterval(interval)
      router.push('/result')
    } catch (error) {
      console.error('Error analyzing image:', error)
      clearInterval(interval)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black">
      <Button
        className="absolute right-4 top-4 z-10"
        variant="default"
        onClick={() => router.push('/demo')}
      >
        <X className="h-6 w-6" />
      </Button>

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
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Camera className="mr-2 h-4 w-4" /> Take Photo
          </Button>
        </div>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative h-full w-full">
            <Image
              src={capturedImage}
              alt="Captured image"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          {isAnalyzing && (
            <div
              className="absolute left-0 top-0 h-1 w-full bg-blue-500 opacity-40"
              style={{
                transform: `translateY(${Math.min(scannerPosition, 100)}vh)`,
                width:
                  scannerPosition > 100 ? `${200 - scannerPosition}%` : '100%',
              }}
            />
          )}
          {!isAnalyzing && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
              <Button onClick={retryCapture}>
                <RotateCw className="mr-2 h-4 w-4" /> Retry
              </Button>
              <Button onClick={startAnalyzing}>Analyze</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
