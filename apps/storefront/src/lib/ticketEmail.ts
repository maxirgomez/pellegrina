export type TicketPayload = {
  nombre: string
  destino: string
  fechas?: string
  quienes?: string
  pref: string
  email?: string
  extra?: string
}

export function buildTicketMessage(p: TicketPayload): string {
  let out = `Hola Jaz! Soy ${p.nombre}. Estoy soñando con viajar a ${p.destino}`
  if (p.fechas) out += `, para ${p.fechas}`
  out += '.'
  if (p.quienes) out += ` Viajamos: ${p.quienes}.`
  out += ` Prefiero que me contactes por ${p.pref}`
  if (p.pref === 'email' && p.email) out += ` (${p.email})`
  out += '.'
  if (p.extra) out += `\n\n${p.extra}`
  return out
}

export function buildTicketSubject(p: TicketPayload): string {
  return `Nuevo pasaje: ${p.destino} — ${p.nombre}`
}
