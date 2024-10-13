'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { X, Camera, RotateCw } from 'lucide-react'
import Image from 'next/image'

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scannerPosition, setScannerPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const compressImage = (
    base64Image: string,
    maxWidth = 1000,
    quality = 0.7
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        const scaleFactor = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleFactor

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = base64Image
    })
  }

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string
        setCapturedImage(base64Image)
        try {
          const compressed = await compressImage(base64Image)
          setCompressedImage(compressed)
        } catch (error) {
          console.error('Error compressing image:', error)
          setCompressedImage(base64Image) // Fallback to original if compression fails
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const retryCapture = () => {
    setCapturedImage(null)
    setCompressedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startAnalyzing = async () => {
    setIsAnalyzing(true)
    const interval = setInterval(() => {
      setScannerPosition((prev) => (prev + 1) % 200)
    }, 10)

    try {
      const response = await fetch('https://api.example.com/analyze', {
        method: 'POST',
        body: JSON.stringify({ image: compressedImage }),
        headers: { 'Content-Type': 'application/json' },
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
