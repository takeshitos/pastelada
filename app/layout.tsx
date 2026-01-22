import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NetworkStatus from '@/components/ui/NetworkStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema Pastelada',
  description: 'Sistema de vendas para pastelaria',
  keywords: ['pastel', 'vendas', 'sistema', 'pastelaria'],
  authors: [{ name: 'Sistema Pastelada' }],
  creator: 'Sistema Pastelada',
  publisher: 'Sistema Pastelada',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <NetworkStatus />
        <div id="root" className="min-h-screen bg-neutral-50 text-neutral-900">
          {children}
        </div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}