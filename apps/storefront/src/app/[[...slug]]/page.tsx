import type { LayoutBlock, PellegrinaSiteContact } from '@tn/core'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PellegrinaChrome } from '@/components/pellegrina/PellegrinaChrome'
import { getPageBySlug, getSiteSettings, mediaUrl } from '@/lib/payload'

type Props = {
  params: Promise<{ slug?: string[] }>
}

function slugFromParams(slug?: string[]) {
  if (!slug || slug.length === 0) return 'home'
  return slug.join('/')
}

function contactFromSettings(settings: Awaited<ReturnType<typeof getSiteSettings>>): PellegrinaSiteContact {
  const instagram = settings?.socialLinks?.find((l) => /instagram/i.test(l.platform))?.url
  return {
    siteName: settings?.siteName || 'Pellegrina Viajes',
    whatsappNumber: settings?.whatsappNumber,
    whatsappDefaultMessage: settings?.whatsappDefaultMessage,
    contactEmail: settings?.contactEmail,
    instagramUrl: instagram,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slugFromParams(slug)
  const [page, settings] = await Promise.all([
    getPageBySlug(pageSlug).catch(() => null),
    getSiteSettings().catch(() => null),
  ])

  if (!page) {
    return { title: 'No encontrado' }
  }

  return {
    title: page.meta?.title || page.title || settings?.siteName || 'Pellegrina Viajes',
    description:
      page.meta?.description ||
      settings?.defaultSeo?.description ||
      'Pellegrina Viajes — viajes a tu medida',
  }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const pageSlug = slugFromParams(slug)
  const [page, settings] = await Promise.all([
    getPageBySlug(pageSlug).catch(() => null),
    getSiteSettings().catch(() => null),
  ])

  if (!page) notFound()

  const layout = page.layout || []
  const showBagbar = layout.some((b: LayoutBlock) => b.blockType === 'pellegrinaSuitcase')
  const contact = contactFromSettings(settings)
  const logoUrl = mediaUrl(settings?.logo)

  return (
    <PellegrinaChrome {...contact} logoUrl={logoUrl} showBagbar={showBagbar}>
      <BlockRenderer blocks={layout} contact={contact} />
    </PellegrinaChrome>
  )
}
