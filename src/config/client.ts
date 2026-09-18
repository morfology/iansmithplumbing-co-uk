export interface Review {
  quote: string
  author: string   // "Sarah M." — first name + initial
  source?: string  // "Checkatrade"
}

export interface Area {
  slug: string     // "hook"
  name: string     // "Hook"
  blurb?: string   // optional one-liner for the area page
}

export interface ClientConfig {
  // identity
  businessName: string
  tagline: string
  trade: string                 // "plumber" — used in copy and schema
  owner: string

  // contact
  phone: string                 // display: "07977 097675"
  phoneE164: string             // tel: href, "+447977097675"
  whatsappNumber: string        // wa.me, no + and no spaces: "447977097675"
  email?: string

  // credentials
  gasSafeNumber?: string
  insured: boolean

  // coverage
  baseTown: string
  areas: Area[]

  // services — drives the list and the area-page copy
  services: string[]
  emergencyServices: string[]   // the urgent subset, surfaced above the fold

  // social proof
  reviews: Review[]
  reviewCount?: number
  googleReviewUrl?: string

  // look
  accent: string                // hex; wired to a CSS variable, see Tailwind below
  accentDark: string

  // tracking
  eventEndpoint?: string        // n8n webhook for click events
}

export const client: ClientConfig = {
  businessName: 'Ian Smith Plumbing',
  tagline: 'Leaks, burst pipes and emergency callouts',
  trade: 'plumber',
  owner: 'Ian',

  phone: 'TODO',
  phoneE164: 'TODO',
  whatsappNumber: 'TODO',        // same number as phoneE164, minus the +

  gasSafeNumber: 'TODO — confirm he does gas at all',
  insured: true,

  baseTown: 'Newnham',
  areas: [
    // TODO confirm the real radius with Ian — these are a first guess
    { slug: 'hook', name: 'Hook' },
    { slug: 'hartley-wintney', name: 'Hartley Wintney' },
    { slug: 'odiham', name: 'Odiham' },
    { slug: 'fleet', name: 'Fleet' },
    { slug: 'basingstoke', name: 'Basingstoke' },
  ],

  services: [
    'Leak repair', 'Burst pipes', 'Emergency callouts',
    'Taps and toilets', 'Radiators', 'Blocked drains',
  ],
  emergencyServices: ['Leak repair', 'Burst pipes', 'No water'],

  reviews: [],                   // TODO — pull 3–4 short ones off Checkatrade

  accent: '#1f4e79',
  accentDark: '#153854',
}
