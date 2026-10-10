/** ponytail: naive Lexical → plain text for hero titles (upgrade: @payloadcms/richtext-lexical/react) */

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

export function lexicalToPlainText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value

  const root = (value as { root?: LexicalNode }).root
  if (!root) return ''

  const walk = (node: LexicalNode): string => {
    if (node.text) return node.text
    return (node.children || []).map(walk).join('')
  }

  return walk(root).trim()
}
