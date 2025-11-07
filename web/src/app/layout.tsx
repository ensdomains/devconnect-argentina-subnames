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
  title: "ENS · Ethereum World's Fair",
  description: 'The most human layer of Ethereum',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Temporarily scope it down to mobile only */}
        <div className="sm:border-brand-blue-dark mx-auto overflow-x-hidden sm:max-w-lg sm:border-x">
          {children}
        </div>
      </body>
    </html>
  )
}
