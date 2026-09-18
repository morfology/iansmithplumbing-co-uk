import { client } from '../config/client'
import { known } from './todo'

/** Where the customer came from. Their own first message carries the attribution. */
export type Source = 'website' | 'google' | 'van' | 'facebook'

const PHRASES: Record<Source, string> = {
  website: 'I found you on your website',
  google: 'I found you on Google',
  van: 'I got your details off your van',
  facebook: 'I saw you on Facebook',
}

export function prefill(source: Source): string {
  return `Hi ${client.owner} — ${PHRASES[source]}. I need a ${client.trade}:`
}

/** undefined when the number isn't known yet — callers render a placeholder. */
export function waLink(source: Source): string | undefined {
  const number = known(client.whatsappNumber)
  if (!number) return undefined
  // encodeURIComponent handles the em-dash (%E2%80%94), spaces (%20) and colon (%3A)
  return `https://wa.me/${number}?text=${encodeURIComponent(prefill(source))}`
}

/** undefined when the number isn't known yet. */
export function telLink(): string | undefined {
  const number = known(client.phoneE164)
  return number ? `tel:${number}` : undefined
}
