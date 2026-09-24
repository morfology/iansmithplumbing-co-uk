export interface Review {
  quote: string
  author: string   // "Sarah M." — first name + initial
  source?: string  // "Checkatrade"
}

export interface Area {
  slug: string     // "middleford"
  name: string     // "Middleford"
  blurb?: string   // optional one-liner for the area page
}

export interface Service {
  name: string
  emergency?: boolean
}

export interface ClientConfig {
  // identity
  businessName: string
  tagline: string
  trade: string                 // "plumber" — used in copy and schema
  owner: string
  /** First person singular or plural — drives every voice-dependent string in copy.ts. */
  voice: 'i' | 'we'

  // site
  siteUrl: string               // 'https://tradedemo.mpconsult.uk' — no trailing slash
  ogImage?: string              // '/og.jpg' — 1200×630; omitted = no og:image tags

  // contact
  phone: string                 // display: "07700 900123"
  phoneE164: string             // tel: href, "+447700900123"
  whatsappNumber: string        // wa.me, no + and no spaces: "447700900123"
  email?: string

  // credentials
  gasSafeNumber?: string
  insured: boolean

  // coverage
  baseTown: string
  areas: Area[]

  // services — one list, rendered in config order, badged where emergency
  services: Service[]

  // social proof
  reviews: Review[]
  reviewCount?: number
  googleReviewUrl?: string

  // look
  accent: string                // hex; wired to a CSS variable, see Tailwind below
  accentDark: string

  // tracking
  eventEndpoint?: string        // n8n webhook for click events

  // demo
  isDemo?: boolean              // true in the template, omitted in client repos
}

// src/config/client.ts — DEMO DATA. Overwrite in each client repo.
export const client: ClientConfig = {
  businessName: 'Marlow & Sons Plumbing',
  tagline: 'Leaks, burst pipes and emergency callouts',
  trade: 'plumber',
  owner: 'Dave',
  voice: 'we',

  siteUrl: 'https://tradedemo.mpconsult.uk',
  ogImage: '/og.jpg',

  // Ofcom's reserved drama range — never a real subscriber
  phone: '07700 900123',
  phoneE164: '+447700900123',
  whatsappNumber: '447700900123',

  gasSafeNumber: '123456',
  insured: true,

  baseTown: 'Middleford',
  areas: [
    { slug: 'middleford', name: 'Middleford' },
    { slug: 'ashcombe', name: 'Ashcombe' },
    { slug: 'netherby', name: 'Netherby' },
    { slug: 'stanton-green', name: 'Stanton Green' },
  ],

  services: [
    { name: 'Leak repair', emergency: true },
    { name: 'Burst pipes', emergency: true },
    { name: 'No water', emergency: true },
    { name: 'Emergency callouts', emergency: true },
    { name: 'Taps and toilets' },
    { name: 'Radiators' },
    { name: 'Blocked drains' },
  ],

  reviews: [
    { quote: 'Came out the same evening for a burst pipe. Sorted in an hour.', author: 'Sarah M.', source: 'Checkatrade' },
    { quote: 'Honest, tidy, and told me what I did not need doing.', author: 'James P.', source: 'Checkatrade' },
    { quote: 'Quoted on the Monday, done by Wednesday. No fuss.', author: 'Angela R.', source: 'Google' },
  ],

  accent: '#1f4e79',
  accentDark: '#153854',
  isDemo: true,
}
