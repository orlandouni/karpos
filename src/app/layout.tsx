import type {Metadata} from 'next'
import {Cormorant_Garamond, Nunito_Sans} from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
})

const sans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'KARPOS · Cocina casera saludable',
  description: 'Menú semanal de comida casera saludable, hecha con amor para tu bienestar.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
