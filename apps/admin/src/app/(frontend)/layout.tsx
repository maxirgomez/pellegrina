import React from 'react'

export const metadata = {
  title: 'Tierra Noble Admin',
  description: 'Payload CMS admin for Tierra Noble',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
