import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-ink">
        404
      </h1>
      <p className="mt-4 text-muted">No encontramos esa página.</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
