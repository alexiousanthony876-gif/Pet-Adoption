import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pawternity Hub - Find Your Perfect Pet Companion',
  description: 'Discover loving pets waiting for their forever homes. Browse dogs, cats, and more at Pawternity Hub - your trusted pet adoption platform.',
  keywords: ['pet adoption', 'adopt a pet', 'dogs', 'cats', 'animal shelter', 'rescue pets'],
  openGraph: {
    title: 'Pawternity Hub - Find Your Perfect Pet Companion',
    description: 'Discover loving pets waiting for their forever homes.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#E87A3C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
