import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { ClientProviders } from '@/components/ClientProviders'

import './globals.css'

const abcMarist = localFont({
  variable: '--font-abc-marist',
  src: './fonts/ABCMarist-Book.woff2',
  weight: '400',
  style: 'regular',
})

const abcMonumentGrotesk = localFont({
  variable: '--font-abc-monument-grotesk',
  src: [
    {
      path: './fonts/ABCMonumentGrotesk-Light.woff2',
      weight: '300',
      style: 'light',
    },
    {
      path: './fonts/ABCMonumentGrotesk-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
  ],
})

const abcMonumentGroteskMono = localFont({
  variable: '--font-abc-monument-grotesk-mono',
  src: './fonts/ABCMonumentGroteskSemi-Mono-Regular.woff2',
  weight: '400',
  style: 'regular',
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
    <html
      lang="en"
      className={`${abcMarist.variable} ${abcMonumentGrotesk.variable} ${abcMonumentGroteskMono.variable} antialiased`}
    >
      <body>
        <ClientProviders>
          {/* Temporarily scope it down to mobile only */}
          <div className="sm:border-brand-blue-dark mx-auto overflow-x-hidden sm:max-w-lg sm:border-x">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
