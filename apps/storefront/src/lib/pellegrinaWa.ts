export function buildWaLink(
  number: string | null | undefined,
  message: string | null | undefined,
  override?: string | null,
): string {
  const n = (number || '').replace(/\D/g, '')
  const text = override || message || 'Hola! Quiero planear mi próximo viaje'
  if (!n) return '#'
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`
}
