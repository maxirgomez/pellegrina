import type { ElementType } from 'react'

import { lexicalToHtml } from '@/lib/lexicalToHtml'

type Props = {
  value: unknown
  className?: string
  as?: ElementType
}

/** Tags that cannot legally wrap block HTML from Lexical (`<p>`, lists, etc.). */
function coerceWrapper(Tag: ElementType): ElementType {
  if (Tag === 'p' || Tag === 'span') return 'div'
  return Tag
}

export function RichText({ value, className, as: Tag = 'div' }: Props) {
  const html = lexicalToHtml(value)
  if (!html) return null
  // Nested <p> inside <p> is invalid HTML: the browser "fixes" the DOM and hydration fails.
  const Wrapper = coerceWrapper(Tag)
  return <Wrapper className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
