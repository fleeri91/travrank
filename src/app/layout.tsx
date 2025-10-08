import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import '@radix-ui/themes/styles.css'
import './globals.css'

import { SWRProvider } from '@/providers/SWRProvider'
import { Theme } from '@radix-ui/themes'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Travdata',
  description: '',
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
        <main className="flex justify-center">
          <Theme
            appearance="dark"
            accentColor="blue"
            grayColor="gray"
            panelBackground="solid"
            className="w-full"
          >
            <SWRProvider>{children}</SWRProvider>
          </Theme>
        </main>
      </body>
    </html>
  )
}
