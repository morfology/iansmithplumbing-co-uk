import { client } from '../config/client'

export function track(event: 'whatsapp_click' | 'call_click', source: string) {
  if (!client.eventEndpoint) return
  navigator.sendBeacon(client.eventEndpoint, JSON.stringify({
    event, source, page: location.pathname, ts: Date.now(),
  }))
}
