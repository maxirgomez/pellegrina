import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/payload'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  return {
    title: settings?.defaultSeo?.title || settings?.siteName || 'Pellegrina Viajes',
    description:
      settings?.defaultSeo?.description || 'Viajes a tu medida — Pellegrina Viajes',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Karla:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
