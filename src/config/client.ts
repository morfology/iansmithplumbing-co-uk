export interface Review {
  quote: string
  author: string   // "Sarah M." — first name + initial
  source?: string  // "Checkatrade"
}

export interface Rating {
  source: string   // 'Checkatrade' — rendered verbatim, so match the platform's own name
  score: number    // 9.89 — write it exactly as the profile shows it
  outOf: number    // 10 on Checkatrade, 5 on Google
  count: number    // 95
  url?: string     // public profile — doubles as the "read more reviews" link
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
  /** Hero photograph: a file in src/assets/, plus its alt text. Omitted = text-only hero. */
  heroImage?: { file: string; alt: string }

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
  /** Headline rating from a third-party platform. Omitted = no badge anywhere. */
  rating?: Rating

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

  // Placeholder stock, free under the Pexels licence, no attribution required:
  // https://www.pexels.com/photo/29226620/ — replace with the client's own work photos.
  heroImage: {
    file: 'hero-plumbing.jpg',
    alt: 'Plumber fitting a radiator valve, pipe wrenches laid out beside them',
  },

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

  rating: {
    source: 'Checkatrade',
    score: 9.71,
    outOf: 10,
    count: 48,
    url: 'https://www.checkatrade.com/',
  },

  accent: '#1f4e79',
  accentDark: '#153854',
  isDemo: true,
}
