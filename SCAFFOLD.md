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
  gasSafe?: {                   // who holds the registration — see below
    who: 'self' | 'partner'
    number: string
    engineer?: string
  }
  insured: boolean

  // who you're calling
  since?: number                // year the business started
  about?: string                // two or three sentences, owner's own voice
  aboutImage?: Photo            // a photograph of the owner

  // coverage
  baseTown: string
  areas: Area[]

  // services — one list, rendered in config order
  services: Service[]           // { name, emergency?, blurb? }

  // social proof
  reviews: Review[]
  rating?: Rating               // score, count, platform and profile link

  // look
  headline?: string             // the H1; omitted = "<Trade> in <baseTown>"
  accent: string                // hex; wired to a CSS variable, see Tailwind below
  accentDark: string            // currently unused — see note below
  logo?: Photo

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

**1 · Hero** — on the dark band, with the header

- Eyebrow: `{Trade} in {baseTown}` — the trade-and-town string still leads, just above the H1
- H1: `{headline}` — a promise in the client's own voice, not the SEO string. Ian's is *Reliable, polite, and tidy*, taken from his Checkatrade blurb. **Local SEO is the area pages' job**, and the `<title>` keeps the town regardless. Clients without a headline fall back to the generated `{Trade} in {baseTown}`
- Sub: *Gas Safe registered · fully insured · covering {areas joined}*
- **The button pair** (see below)
- Strap under the buttons: *Can't answer? Message me — I reply between jobs.*

**2 · Emergency strip** — visually distinct, directly under the hero
> **Water coming through the ceiling?** Turn the stopcock off — usually under the kitchen sink — then call. Don't wait for a quote.

This does three jobs: it's genuinely useful, it builds trust before any sales copy, and it does the work the WhatsApp away message would do if the Business app isn't set up yet.

**3 · Services** — plain list from `config.services`, rendered in config order. Everyday work leads and emergency jobs carry a badge: emergency callouts are a big part of the work, not the whole of it. Each carries an optional one-line `blurb` — a bare name doesn't tell someone whether their job is on the list.

**3a · About** — who you're actually calling. For a sole trader this is the highest-value section on the page after the buttons: two or three sentences in his own voice, the year he started, and a photograph of him. Drops entirely when `about` is unset.

**4 · Areas covered** — links to the generated area pages

**5 · Reviews** — three or four, short, with source

**6 · Credentials** — Gas Safe number, insured. Years trading lives in the About section instead, where it sits next to the face rather than in a dry list

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

### Button colours

Fixed, not from `accent`. **Call is red**, WhatsApp is WhatsApp's own green (`#25d366`). A customer identifies both before reading either. The green takes dark ink — white on it is 2:1 — and a darker edge, because the fill alone is too light to define the button against a white page. Both flip to brighter values in dark mode; see the comments in `global.css`.

---

## Photographs

`Photo` is `{ file, alt }` — the file sits in `src/assets/` and `resolvePhoto()` looks it up, so `client.ts` stays plain data and a filename typo drops the image instead of failing the build. Everything goes through `astro:assets`: WebP, a srcset, and explicit dimensions.

### The logo

`logo` renders as a **40px rounded tile beside the business name**, not as a lockup replacing it. Two reasons, both from the asset: it is opaque (no alpha, so it cannot sit on a white header without a grey box), and its own wordmark is unreadable below about 150px. As a tile the baked-in background reads as deliberate, and the name stays as live, selectable, translatable text.

Swap to a proper lockup only when a transparent SVG or PNG arrives — a Google Business Profile export is a downscaled re-encode, never the original.

The hero ships with a stock placeholder. **The About portrait deliberately does not.** Free stock has no credible UK sole-trader portrait in it, and a stranger's face presented as the owner reads as fake — which costs more trust than an empty space does. It stays unset until the client sends a real one.

---

## The dark band

The header and hero carry `.on-dark`, which stays dark in both colour schemes. Colour photography reads against it rather than washing into a white page, and it matches the OG card.

It works by **redefining the tokens**, not by hardcoding colours, so everything nested inside adapts without knowing it is on a dark ground. That matters most for the CTA pair: the light-mode red only clears 2.7:1 against dark and stops reading as a button, so `.on-dark` swaps in the brighter one. Every pair is measured — see the comment in `global.css`, and re-check it if the values move.

---

## Accent colour

Take it from the logo, then check it before using it. Ian's droplet is `#1789eb`, which is only **3.6:1 on white** — fine as a large fill, fails as link text. The config carries the darkened `#0a63b2` (6.1:1) instead.

`accent` currently drives `--link` and the hero eyebrow only; the CTA pair is fixed red/green by design. **`accentDark` drives nothing at all** — either wire it to a link hover state or drop the field.

---

## The Gas Safe rule

A trade site is the one place a credential claim is checkable, and Gas Safe registration is statutory: only someone on the register may be described as Gas Safe registered.

`gasSafe.who` encodes it:

- `'self'` — the trader is on the register → *"Gas Safe registered — no. 123456"*
- `'partner'` — gas work is subbed to a registered engineer → *"Gas work is carried out by {name}, who is Gas Safe registered — no. 123456"*

The hero credential line shortens to *"Gas Safe engineer on gas work"* for `'partner'`, which is true without implying the trader holds the registration. Omit `gasSafe` entirely for a trader who does no gas work at all.

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

- `<title>`: `{businessName} — Plumber in {baseTown} & {area}`. Not "Emergency Plumber" — the trade and the town are the identity, and emergency work is carried by the strip, the service badges and the tagline instead.
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

Confirmed from his Checkatrade profile (`/trades/iansmithplumbing`): **sole trader, Hook, Hampshire. 9.89 from 95 reviews. Checkatrade member since January 2019. City & Guilds Level 2. Domestic work only.** No Gas Safe accreditation is listed, which matches gas going to his mate.

Blocking:

1. **Phone and WhatsApp number.** The config carries an Ofcom drama number (`07700 900123`) that never connects
2. **The gas engineer's name and registration number.** `gasSafe.number` is `'TODO'` and renders as a visible badge. Is the mate happy to be named?
3. **Is he actually insured?** `insured: true` is currently an assumption. Checkatrade lists "Insurance Work Undertaken", which means he takes insurance-claim work — it is *not* a statement that he carries public liability cover

Worth having:

4. **The service radius.** Review postcodes prove RG27, RG21, RG23, RG29, GU34 and GU12; the config adds Fleet and Hartley Wintney as adjacent. Confirm the outer edge before generating area pages
5. **Where he says he is based.** `baseTown` is `'Hook'`; he may prefer Newnham or "the Hook area". One-line change, but it feeds the H1 fallback, the `<title>`, the eyebrow and the schema
6. **When he actually started trading.** `since: 2019` is his Checkatrade join date, not necessarily his start date — he was at Harrods before plumbing
7. **A photograph of Ian**, ideally by the van. `aboutImage` stays unset until it arrives. There are 30+ job photos on his profile worth pulling too
8. **The logo original**, if one exists — SVG or transparent PNG

### Competition

`simonduffplumbing.co.uk` covers Woking, Guildford, Frimley, Camberley and Farnborough — overlapping patch. Weaker site (mailto as the primary CTA, "Reliable. Trusted. Local." as the H1) but it has the About section, per-service copy and "established 2014" that this template now has. Ian's 9.89 over 95 reviews is the thing they cannot match.
