import { client } from '../config/client'

/**
 * schema.org has concrete types for most trades. Keyed off config.trade so a new
 * client is still a data swap; anything unlisted falls back to LocalBusiness,
 * which is valid for every trade.
 */
const SCHEMA_TYPES: Record<string, string> = {
  plumber: 'Plumber',
  electrician: 'Electrician',
  roofer: 'RoofingContractor',
  builder: 'GeneralContractor',
  locksmith: 'Locksmith',
  'gas engineer': 'HVACBusiness',
  'heating engineer': 'HVACBusiness',
}

export function schemaType(trade: string): string {
  return SCHEMA_TYPES[trade.trim().toLowerCase()] ?? 'LocalBusiness'
}

export function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** ["Alpha", "Beta", "Gamma"] -> "Alpha, Beta and Gamma" */
export function joinNames(names: string[]): string {
  return new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(names)
}

/** Emergency work first — that's what someone standing in a puddle is scanning for. */
export function orderedServices(): string[] {
  const emergency = client.emergencyServices
  return [...emergency, ...client.services.filter((s) => !emergency.includes(s))]
}
