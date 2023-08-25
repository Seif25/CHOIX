import './globals.css'
import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'

const raleway = Raleway({ weight: ["300", "500", "700", "800", "900"], subsets: ['latin'], style: ["italic", 'normal'] })

export const metadata: Metadata = {
  title: 'CHOIX',
  description: 'An app to help you make decisions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
    </html>
  )
}
