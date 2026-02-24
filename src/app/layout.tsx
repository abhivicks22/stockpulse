import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'StockPulse — AI-Powered Market Intelligence for Smarter Trading',
  description:
    'Track stocks, crypto, and forex with real-time charts, AI sentiment analysis, and smart watchlists. Free for everyday traders.',
  openGraph: {
    title: 'StockPulse — AI-Powered Market Intelligence',
    description:
      'Track stocks, crypto, and forex with real-time charts, AI sentiment analysis, and smart watchlists.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockPulse — AI-Powered Market Intelligence',
    description:
      'Track stocks, crypto, and forex with real-time charts, AI sentiment analysis, and smart watchlists.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-white`}
      >
        {children}
      </body>
    </html>
  )
}
