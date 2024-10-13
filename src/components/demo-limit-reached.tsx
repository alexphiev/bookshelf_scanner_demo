import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExternalLink, Stars } from 'lucide-react'
import Link from 'next/link'
export default function DemoLimitReached({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stars className="h-4 w-4" />
            Demo completed! What&apos;s next?
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Thank you for trying out our demo! Your usage limit has been
            reached.
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Want to use the power of the Bookshelf Scanner API in your
            application?
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Explore our subscription plans</li>
            <li>
              More questions or feedback? We&apos;d love to hear from you!
            </li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`}
            target="_blank"
          >
            <Button className="w-full sm:w-auto" variant="outline">
              Contact Us
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/pricing`}
            target="_blank"
          >
            <Button className="w-full sm:w-auto">
              Check our plans
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
