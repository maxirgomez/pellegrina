import type { CmsPage, MediaRef } from '@tn/core'

import { getPayloadBaseUrl } from '../env'

type Paginated<T> = {
  docs: T[]
  totalDocs: number
}

type SiteSettings = {
  siteName?: string | null
  logo?: MediaRef | number | string | null
  whatsappNumber?: string | null
  whatsappDefaultMessage?: string | null
  contactEmail?: string | null
  socialLinks?: { platform: string; url: string }[] | null
  defaultSeo?: { title?: string | null; description?: string | null } | null
}

async function payloadFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getPayloadBaseUrl()
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    throw new Error(`Payload ${path} failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/** CMS may store home as "home" or "/"; URLs use "" | "home". */
function slugCandidates(slug: string): string[] {
  const trimmed = (slug || '').replace(/^\/+|\/+$/g, '')
  const isHome = trimmed === '' || trimmed === 'home'
  if (isHome) return ['home', '/']
  return [trimmed, `/${trimmed}`]
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  for (const candidate of slugCandidates(slug)) {
    const data = await payloadFetch<Paginated<CmsPage>>(
      `/api/pages?where[slug][equals]=${encodeURIComponent(candidate)}&depth=2&limit=1`,
    )
    if (data.docs[0]) return data.docs[0]
  }
  return null
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await payloadFetch<SiteSettings>('/api/globals/site-settings?depth=1')
  } catch {
    return null
  }
}

export function mediaUrl(media: MediaRef | number | string | null | undefined): string | null {
  if (!media || typeof media === 'number' || typeof media === 'string') return null
  if (!media.url) return null
  if (media.url.startsWith('http')) return media.url
  return `${getPayloadBaseUrl()}${media.url}`
}
