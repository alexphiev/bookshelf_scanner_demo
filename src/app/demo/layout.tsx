import type { Metadata } from 'next'
import { SplitView } from '@/components/split-view'

export const metadata: Metadata = {
  title: 'Booshelf Scanner API Demo',
  description: 'Demo for the Booshelf Scanner API and App',
}

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SplitView>{children}</SplitView>
}
