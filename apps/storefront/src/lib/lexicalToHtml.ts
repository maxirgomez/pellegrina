/** ponytail: minimal Lexical JSON → HTML (paragraph, text, bold, italic, link, linebreak) */

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number
  url?: string
  newTab?: boolean
  children?: LexicalNode[]
  listType?: string
}

const IS_BOLD = 1
const IS_ITALIC = 2

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderInline(node: LexicalNode): string {
  if (node.type === 'linebreak') return '<br />'
  if (node.text != null) {
    let t = escapeHtml(node.text)
    const f = node.format ?? 0
    if (f & IS_BOLD) t = `<strong>${t}</strong>`
    if (f & IS_ITALIC) t = `<em>${t}</em>`
    return t
  }
  if (node.type === 'link' && node.url) {
    const inner = (node.children || []).map(renderInline).join('')
    const rel = node.newTab ? ' rel="noopener noreferrer"' : ''
    const target = node.newTab ? ' target="_blank"' : ''
    return `<a href="${escapeHtml(node.url)}"${target}${rel}>${inner}</a>`
  }
  return (node.children || []).map(renderInline).join('')
}

function renderBlock(node: LexicalNode): string {
  const type = node.type
  if (type === 'paragraph' || type === 'heading') {
    const tag = type === 'heading' ? node.tag || 'h3' : 'p'
    const inner = (node.children || []).map(renderInline).join('')
    if (!inner.trim()) return ''
    return `<${tag}>${inner}</${tag}>`
  }
  if (type === 'list') {
    const tag = node.listType === 'number' ? 'ol' : 'ul'
    const items = (node.children || [])
      .filter((c) => c.type === 'listitem')
      .map((li) => `<li>${(li.children || []).map(renderBlock).join('') || renderInline(li)}</li>`)
      .join('')
    return items ? `<${tag}>${items}</${tag}>` : ''
  }
  if (type === 'quote') {
    const inner = (node.children || []).map(renderBlock).join('')
    return inner ? `<blockquote>${inner}</blockquote>` : ''
  }
  return (node.children || []).map((c) => renderBlock(c) || renderInline(c)).join('')
}

export function lexicalToHtml(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return escapeHtml(value)
  const root = (value as { root?: LexicalNode }).root
  if (!root?.children?.length) return ''
  return root.children.map(renderBlock).filter(Boolean).join('')
}
