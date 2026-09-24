import type { IconName } from '../lib/icons'

export interface Review {
  quote: string
  author: string   // "Sarah M." — first name + initial
  source?: string  // "Checkatrade"
}

export interface Photo {
  file: string   // a file in src/assets/ — swap the file, keep the key
  alt: string
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
  icon?: IconName
  /** One line on what the job actually covers. A bare name doesn't tell
      someone whether their job is on the list. */
  blurb?: string
}

export interface Credential {
  text: string
  icon?: IconName
}

export interface ClientConfig {
  // identity
  businessName: string
  tagline: string
  trade: string                 // "plumber" — used in copy and schema
  owner: string
  /** First person singular or plural — drives every voice-dependent string in copy.ts. */
  voice: 'i' | 'we'
  /** The H1: a promise in the client's own voice. Omitted = the generated
      "<Trade> in <baseTown>", which is the safer default for a new client. */
  headline?: string

  // site
  siteUrl: string               // 'https://tradedemo.mpconsult.uk' — no trailing slash
  ogImage?: string              // '/og.jpg' — 1200×630; omitted = no og:image tags
  /** Hero photograph. Omitted = text-only hero. */
  heroImage?: Photo
  /** Business logo, shown as a tile beside the name in the header.
      Omitted = the header runs as text, which is not a downgrade. */
  logo?: Photo

  // contact
  phone: string                 // display: "07700 900123"
  phoneE164: string             // tel: href, "+447700900123"
  whatsappNumber: string        // wa.me, no + and no spaces: "447700900123"
  email?: string

  // credentials
  /**
   * Omitted = no gas work at all.
   *
   * `who` is a legal distinction, not a wording preference. Only someone on the
   * register may be described as Gas Safe registered, so a trader who subs gas
   * work out to a registered mate is 'partner' and the copy says so. Getting
   * this wrong misrepresents a statutory registration.
   */
  gasSafe?: {
    who: 'self' | 'partner'
    number: string    // whoever actually holds the registration
    engineer?: string // the partner's name, when who is 'partner'
  }
  insured: boolean
  /** Anything else worth stating plainly — qualifications, vetting, terms. */
  credentials?: Credential[]

  // who you're calling
  /** Year the business started. Omitted = the line is dropped. */
  since?: number
  /** Two or three sentences in the owner's own voice. Omitted = no About section. */
  about?: string
  /** A photograph of the owner. The single most valuable photo on the site —
      a real face beats any stock image. Omitted = the About section runs as text. */
  aboutImage?: Photo

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
  businessName: 'Ian Smith Plumbing',
  tagline: 'Bathrooms, heating, leaks and emergency callouts',
  // His own words on Checkatrade: "I am reliable, polite and work to a high
  // standard" and "considerate, tidy and courteous". The trade-and-town string
  // moves to the eyebrow above it, and the local SEO sits on the area pages.
  headline: 'Reliable, polite, and tidy',
  trade: 'plumber',
  owner: 'Ian',
  voice: 'i',

  siteUrl: 'https://tradedemo.mpconsult.uk',
  ogImage: '/og.jpg',

  // Placeholder stock, free under the Pexels licence, no attribution required:
  // https://www.pexels.com/photo/29226620/ — replace with the client's own work photos.
  // Square, opaque, 320px — a Google Business Profile export, not an original.
  // Rendered as a tile for that reason; see SCAFFOLD.
  logo: { file: 'logo.webp', alt: 'Ian Smith Plumbing' },

  heroImage: {
    file: 'hero-plumbing.jpg',
    alt: 'Plumber fitting a radiator valve, pipe wrenches laid out beside them',
  },

  // Ofcom's reserved drama range — never a real subscriber
  phone: '07700 900123',
  phoneE164: '+447700900123',
  whatsappNumber: '447700900123',

  // No gasSafe: he can take on gas jobs through a registered engineer, but the
  // site doesn't advertise gas work for now.
  // TODO: confirm. Checkatrade lists "Insurance Work Undertaken", which means he
  // works on insurance claims — it is not a statement that he carries cover.
  insured: true,
  credentials: [
    { text: 'City & Guilds Level 2 qualified', icon: 'qualified' },
    { text: 'Checkatrade vetted — 12 checks passed', icon: 'vetted' },
    { text: 'Free estimates', icon: 'estimate' },
    { text: 'Insurance work undertaken', icon: 'insurance' },
    { text: 'Cards accepted', icon: 'card' },
  ],

  // Drawn from his own Checkatrade blurb — the Harrods line is his, and it is
  // the most memorable thing on his profile.
  about:
    "I'm a sole trader based in Hook, covering a wide radius across Hampshire " +
    'and the neighbouring counties. Before plumbing I spent years at Harrods in ' +
    'Knightsbridge, which is where I learned what good service actually looks ' +
    'like — being considerate, tidy and courteous is as much part of the job as ' +
    "the plumbing itself. If you're in an emergency, ring me and I'll tell you " +
    'what to do before I arrive.',
  // No aboutImage in the demo on purpose: a stock portrait presented as the
  // owner reads as fake, which is worse than no photo. Clients supply their own.

  since: 2019,
  // Postcodes on his reviews: RG27 Hook, RG21/RG23 Basingstoke, RG29 Odiham,
  // GU34 Alton, GU12 Aldershot. Fleet and Hartley Wintney are adjacent and
  // inside the same patch. TODO: confirm the outer edge with Ian.
  baseTown: 'Hook',
  areas: [
    { slug: 'hook', name: 'Hook' },
    { slug: 'basingstoke', name: 'Basingstoke' },
    { slug: 'fleet', name: 'Fleet' },
    { slug: 'odiham', name: 'Odiham' },
    { slug: 'hartley-wintney', name: 'Hartley Wintney' },
    { slug: 'alton', name: 'Alton' },
    { slug: 'aldershot', name: 'Aldershot' },
  ],

  // Condensed from the 21 skills on his Checkatrade profile. Everyday work
  // leads, emergencies badged. Water mains/moling and power flushing are real
  // specialisms and most local plumbers don't list them.
  services: [
    { name: 'Bathroom and kitchen plumbing', icon: 'bath', blurb: 'Full refits and bath-to-shower conversions — suite, tiling and everything reconnected.' },
    { name: 'Water mains and lead pipes', icon: 'water', blurb: 'Supply pipe replacement and repair, including moling so the garden stays intact.' },
    { name: 'Radiators and valves', icon: 'radiator', blurb: 'Installation, repairs and thermostatic valves, plus balancing when the heat will not get round.' },
    { name: 'Underfloor heating', icon: 'underfloor', blurb: 'Wet systems installed and repaired, existing loops tested for blockages.' },
    { name: 'Showers and taps', icon: 'shower', blurb: 'From a dripping tap to a new shower that actually runs properly.' },
    { name: 'Power flushing', icon: 'flush', blurb: 'Sludge cleared out of the system so the radiators heat evenly again.' },
    { name: 'Water pumps', icon: 'pump', blurb: 'Installed and repaired where the mains pressure will not do the job on its own.' },
    { name: 'Blocked sinks, baths and toilets', icon: 'toilet', emergency: true, blurb: 'Cleared without digging anything up.' },
    { name: 'Leaks and plumbing repairs', icon: 'leak', emergency: true, blurb: 'Traced and fixed, from a weeping joint to a failed hot water cylinder.' },
  ],

  // Verbatim single sentences from his Checkatrade reviews — no splicing, no
  // ellipses. Three are named as the profile names them; the fourth is shown
  // there only as a verified reviewer, so it says that rather than inventing one.
  reviews: [
    { quote: 'Across the project, he has been responsive, supportive, honest, transparent and professional.', author: 'Kevin P.', source: 'Checkatrade' },
    { quote: 'The price was very competitive and agreed up front.', author: 'Kieran L.', source: 'Checkatrade' },
    { quote: 'The work area and access were kept clean.', author: 'Peter F.', source: 'Checkatrade' },
    { quote: 'He made the whole process easy and explained everything step by step.', author: 'Verified reviewer', source: 'Checkatrade' },
  ],

  rating: {
    source: 'Checkatrade',
    score: 9.89,
    outOf: 10,
    count: 95,
    url: 'https://www.checkatrade.com/trades/iansmithplumbing',
  },

  // Sampled from the logo's droplet (#1789eb) and darkened: the raw blue is
  // only 3.6:1 on white, which fails as link text. This clears 6.1:1.
  accent: '#0a63b2',
  accentDark: '#07477f',
  isDemo: true,
}
