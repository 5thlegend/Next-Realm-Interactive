import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Using Inter as display font for now, can swap for Cabinet Grotesk later
const cabinet = Inter({
  subsets: ['latin'],
  variable: '--font-cabinet',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Next Realm Interactive | Systems Built for Revenue',
    template: '%s | Next Realm',
  },
  description: 'We build systems that print revenue. Clients enter for results. Builders enter for assets. Operators enter for scale.',
  keywords: ['web development', 'digital systems', 'brand identity', 'launch execution', 'digital products'],
  authors: [{ name: 'Next Realm Interactive' }],
  creator: 'Next Realm Interactive',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nextrealm.io',
    siteName: 'Next Realm Interactive',
    title: 'Next Realm Interactive | Systems Built for Revenue',
    description: 'We build systems that print revenue. Clients enter for results. Builders enter for assets. Operators enter for scale.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next Realm Interactive',
    description: 'Systems built for operators, brands, and revenue.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cabinet.variable}`}>
      <body className="custom-scrollbar">
        {children}
      </body>
    </html>
  )
}
