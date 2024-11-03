import { LoaderCircle } from 'lucide-react'

export default function Spinner({
  variant = 'light',
}: {
  variant?: 'light' | 'dark'
}) {
  return (
    <LoaderCircle
      className={`absolute left-4 top-4 z-10 h-6 w-6 animate-spin ${
        variant === 'light' ? 'text-white' : 'text-primary'
      }`}
    />
  )
}
