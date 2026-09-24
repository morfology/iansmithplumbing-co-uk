# SCAFFOLD — Local trade site template

**Drop this in the repo root and point Claude Code at it.**

Astro + Tailwind. Static. Deploys to Cloudflare Pages. One config file drives everything so a new client is a data swap, not a rebuild.

---

## The one rule

**No client-specific string appears anywhere except `src/config/client.ts`.**

Not in a component, not in a page, not in a meta tag. If onboarding client two means editing one file and dropping in new photos, the template works. If it means grepping for "Ian", it doesn't.

---

## Why Astro and not a single HTML file

The homepage is the smallest part. The reason for a framework here is **generated location pages** — one page per town from a config array, which is the main organic lever available to a service-area business with no physical address to rank on.

Ship the homepage first. The area pages come from the same data with no extra content work.

---

## Config

`src/config/client.ts` — the entire per-client surface.

```ts
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
  rating?: Rating               // score, count, platform and profile link

  // look
  accent: string                // hex; wired to a CSS variable, see Tailwind below
  accentDark: string

  // tracking
  eventEndpoint?: string        // n8n webhook for click events
}
```

### The template must run standalone

**The template ships with a complete demo config — never a client's.** `npm install && npm run dev` on a fresh clone must produce a finished-looking site with no edits.

Three reasons this matters:

1. You can run the template itself to check nothing broke after a change
2. Deployed, it's a **live demo for prospects** — "here's what you'd get" beats any mockup
3. A complete demo config proves the optional paths render (no reviews, no Gas Safe number)

**Client data never enters the template repo.** A client repo is generated from the template, and `client.ts` is overwritten there with real values. Ian's site is `iansmithplumbing-site`, not a branch of the template.

```ts
// src/config/client.ts — DEMO DATA. Overwrite in each client repo.
export const client: ClientConfig = {
  businessName: 'Marlow & Sons Plumbing',
  tagline: 'Leaks, burst pipes and emergency callouts',
  trade: 'plumber',
  owner: 'Dave',

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
    'Leak repair', 'Burst pipes', 'Emergency callouts',
    'Taps and toilets', 'Radiators', 'Blocked drains',
  ],
  emergencyServices: ['Leak repair', 'Burst pipes', 'No water'],

  reviews: [
    { quote: 'Came out the same evening for a burst pipe. Sorted in an hour.', author: 'Sarah M.', source: 'Checkatrade' },
    { quote: 'Honest, tidy, and told me what I did not need doing.', author: 'James P.', source: 'Checkatrade' },
    { quote: 'Quoted on the Monday, done by Wednesday. No fuss.', author: 'Angela R.', source: 'Google' },
  ],

  accent: '#1f4e79',
  accentDark: '#153854',
  isDemo: true,
}
```

**Keep the demo obviously fictional.** Invented business name, invented towns, and phone numbers from Ofcom's reserved `07700 900xxx` drama range so no real person ever gets called. Add `isDemo?: boolean` to the interface and render a small persistent banner — *"Demo site — example business, not a real trader"* — whenever it's true. Client configs omit it and the banner disappears.

### Per-client values

These go in the **client repo**, not here. Anything not yet known stays as the literal `'TODO'` and renders as a visible placeholder, so a missing phone number is obvious on the page rather than silently blank.

Ian's, for reference when you generate his repo:

| Field | Value |
|---|---|
| `businessName` | Ian Smith Plumbing |
| `baseTown` | Newnham (Hampshire, RG27) |
| `areas` | TODO — confirm radius. First guess: Hook, Hartley Wintney, Odiham, Fleet, Basingstoke |
| `phone` / `phoneE164` / `whatsappNumber` | TODO |
| `gasSafeNumber` | TODO — confirm he does gas at all |
| `reviews` | TODO — 3–4 short quotes from his Checkatrade listing |

> **Phone note:** `phoneE164` and `whatsappNumber` are the same number in two formats. They only diverge if a call-tracking number is added later (Tier 2), at which point `phoneE164` changes and `whatsappNumber` stays on the mobile.

---

## Routes

```
/                      homepage
/areas/[slug]          generated from config.areas via getStaticPaths
/services/[slug]       optional, phase 2 — markdown content collection
```

Markdown content collections under `src/content/` with file paths mirroring URL paths, as in your other sites.

**Area pages** are near-duplicates by design — same structure, town swapped, plus an optional blurb. Keep them genuinely useful (travel time, a line about the area) rather than spun text, and don't generate fifty of them. Five to eight real towns beats a long thin list.

---

## Homepage — content, in order

Copy is written. Take it as-is unless Ian objects.

**1 · Hero**
- H1: `{businessName}` — `{tagline}`
- Sub: *Gas Safe registered · fully insured · covering {areas joined}*
- **The button pair** (see below)
- Strap under the buttons: *Can't answer? Message me — I reply between jobs.*

**2 · Emergency strip** — visually distinct, directly under the hero
> **Water coming through the ceiling?** Turn the stopcock off — usually under the kitchen sink — then call. Don't wait for a quote.

This does three jobs: it's genuinely useful, it builds trust before any sales copy, and it does the work the WhatsApp away message would do if the Business app isn't set up yet.

**3 · Services** — plain list from `config.services`, emergency ones first

**4 · Areas covered** — links to the generated area pages

**5 · Reviews** — three or four, short, with source

**6 · Credentials** — Gas Safe number, insured, years trading

**7 · Footer** — phone, areas, business name. No address (service-area business).

**Sticky bottom bar on mobile** — the button pair, always visible. Don't make someone hunt for a number while a ceiling drips.

---

## The button pair

Two buttons, side by side, equal weight. **Call stays primary** — an emergency at 7am is a phone call. WhatsApp is the net for people who won't ring and for the ones who ring and get nothing.

```html
<a href="tel:{phoneE164}">Call now</a>
<a href="https://wa.me/{whatsappNumber}?text={encoded prefill}">WhatsApp me</a>
```

### Prefill per placement — free source attribution

The customer's own first message tells you where they came from. No tracking number, nothing to configure.

| Placement | Prefill |
|---|---|
| Website hero | `Hi Ian — I found you on your website. I need a plumber:` |
| Google listing | `Hi Ian — I found you on Google. I need a plumber:` |
| Van QR | `Hi Ian — I got your details off your van. I need a plumber:` |
| Facebook | `Hi Ian — I saw you on Facebook. I need a plumber:` |

Keep prefills **short**. A panicking customer won't complete a form. The away message asks the qualifying questions, not the prefill.

Build a `waLink(source)` helper that encodes properly — spaces to `%20`, em-dash to `%E2%80%94`, colon to `%3A`.

**Never WhatsApp alone.** Someone without it installed lands on a download page, which is a lost job.

---

## Click tracking

Fire on both buttons. The page is about to navigate away, so `sendBeacon` — a plain `fetch` gets cancelled mid-flight.

```ts
export function track(event: 'whatsapp_click' | 'call_click', source: string) {
  if (!client.eventEndpoint) return
  navigator.sendBeacon(client.eventEndpoint, JSON.stringify({
    event, source, page: location.pathname, ts: Date.now(),
  }))
}
```

No cookie, no personal data, first-party — so no consent banner. A click is intent, not a booked job; treat it as an upper bound.

---

## Tailwind

Accent via CSS variable so the swap is one config value:

```css
:root {
  --accent: theme(colors.slate.800);   /* overridden inline from config */
  --accent-dark: ...;
}
```

Set it from `client.accent` in the base layout's inline style, then reference `var(--accent)` in components. Avoids rebuilding the Tailwind config per client.

**Also required:**
- Dark mode via `prefers-color-scheme`, tokens defined on `:root` first
- Minimum 48px tap targets on the CTAs
- Body must never scroll horizontally

---

## Performance — this is a hard requirement, not a nice-to-have

Someone with a leak, on 4G, standing in a puddle. **Under 2 seconds.**

- No JS beyond the tracking beacon and the sticky bar
- Images: local, optimised via `astro:assets`, correct dimensions to avoid layout shift
- Self-host any font, or use a system stack
- Lighthouse mobile before deploy — if it isn't near 100, fix it before adding anything

---

## SEO

- `<title>`: `{businessName} — Emergency Plumber in {baseTown} & {area}`
- `LocalBusiness` / `Plumber` JSON-LD with `areaServed` from config, **no `address`** — he's a service-area business and the address is deliberately hidden
- Business name **identical** to the Google Business Profile, character for character
- Phone number identical everywhere — website, GBP, Facebook, Checkatrade. Inconsistent numbers across citations quietly damage local ranking
- `sitemap` and `robots.txt` via the Astro integration
- **No `aggregateRating` in the JSON-LD.** The Checkatrade score is shown on the page but deliberately not marked up: Google treats a business marking up its own aggregate rating as self-serving, and the risk of a manual action outweighs a star snippet that may never appear. Revisit only if Checkatrade publishes an official badge/widget.

---

## Deploy

Cloudflare Pages, connected to the repo. Domain, DNS and hosting in one account.

- Build: `npm run build` · output `dist`
- Custom domain `iansmithplumbing.co.uk` via the Pages project
- Preview deploys on branches for showing Ian before it goes live

---

## Definition of done for the template

- [ ] **`git clone && npm install && npm run dev` produces a complete, good-looking demo site with zero edits**
- [ ] Onboarding a new client = edit `client.ts`, replace photos, deploy
- [ ] No client name appears outside `client.ts` and `/public`
- [ ] The demo banner shows when `isDemo: true` and vanishes when omitted
- [ ] Lighthouse mobile ≥ 95 across the board
- [ ] Button pair works on a real phone — call dials, WhatsApp opens with the prefill
- [ ] Renders correctly with `reviews: []` and `gasSafeNumber: undefined` — not every client will have them

---

## Open TODOs before building

1. Ian's phone number
2. Confirm service-area towns and radius
3. Three or four short Checkatrade review quotes — profile is **9.89 from 95 reviews**, goes in his repo's `client.ts` as `rating` (the template ships fictional demo numbers)
4. Does he do boilers/heating? Changes the services list and possibly the business name
5. Photos — 20+ of completed work, van, tools