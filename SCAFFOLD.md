# SCAFFOLD — Ian Smith Plumbing website

**Drop this in the repo root and point Claude Code at it.**

Astro + Tailwind. Static. Deploys to Cloudflare Pages at `iansmithplumbing.co.uk`. This is Ian's live site. It began as a reusable trade-site template, and it's still built so one config file drives everything; that's what keeps it cheap to change, and it means the code could seed another trade's site later.

---

## The one rule

**No client-specific string appears anywhere except `src/config/client.ts`.**

Not in a component, not in a page, not in a meta tag. Changing his phone number, his areas or his wording is an edit to one file, never a grep for "Ian".

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
  credentials?: Credential[]    // { text, icon? } — anything else worth stating plainly

  // who you're calling
  since?: number                // year the business started
  about?: string                // two or three sentences, owner's own voice
  aboutImage?: Photo            // a photograph of the owner

  // coverage
  baseTown: string
  areas: Area[]

  // services — one list, rendered in config order
  services: Service[]           // { name, emergency?, blurb?, icon? }

  // social proof
  reviews: Review[]
  rating?: Rating               // score, count, platform, profile link, asOf (year-month read)

  // look
  headline?: string             // the H1; omitted = "<Trade> in <baseTown>"
  accent: string                // hex; wired to a CSS variable, see Tailwind below
  accentDark: string            // currently unused — see note below
  logo?: Photo

  // tracking
  eventEndpoint?: string        // n8n webhook for click events
}
```

### Ian's config

`src/config/client.ts` holds Ian's real data: business name, his mobile (`07859 063383`, which is used for calls and WhatsApp alike), `siteUrl: 'https://iansmithplumbing.co.uk'`, his areas, services, reviews and Checkatrade rating. The comments beside each value say where it came from.

Anything not yet known stays as the literal `'TODO'` and renders as a visible placeholder, so a missing value is obvious on the page rather than silently blank. **A `TODO` badge on the live site is a bug.** Check for them before every deploy.

> **Phone note:** `phoneE164` and `whatsappNumber` are the same number in two formats. They only diverge if a call-tracking number is added later (Tier 2), at which point `phoneE164` changes and `whatsappNumber` stays on the mobile.

**The buttons ring Ian's real phone.** Test the tel: and wa.me links by reading the markup, not by tapping them, unless Ian knows to expect the call.

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
- Sub: *fully insured · covering {areas joined}* — each part drops when absent; a Gas Safe claim leads only when `gasSafe` is set
- **The button pair** (see below)
- Strap under the buttons: *Can't answer? Message me — I reply between jobs.*

**2 · Services** — a full-width accent band (see *Colour bands*). Cards from `config.services`, rendered in config order, each with an optional icon on a white tile. Everyday work leads and emergency jobs carry a badge: emergency callouts are a big part of the work, not the whole of it. Each carries an optional one-line `blurb` — a bare name doesn't tell someone whether their job is on the list.

*There was an emergency strip here ("Water coming through the ceiling?…"). It was dropped: it read as an alarm banner rather than help. The same advice lives in Ian's About text.*

**3a · About** — who you're actually calling. For a sole trader this is the highest-value section on the page after the buttons: two or three sentences in his own voice, the year he started, and a photograph of him. Drops entirely when `about` is unset.

**4 · Areas covered** — links to the generated area pages

**5 · Reviews** — three or four, short, with source

**6 · Credentials** — insured, then `config.credentials`, as a two-column list with an icon per line. Gas Safe leads only when `gasSafe` is set. Years trading lives in the About section instead, where it sits next to the face rather than in a dry list

**7 · Call band** — a full-width accent band: *Need a {trade} in {baseTown}?*, the away strap, and the button pair. Someone who reads to the bottom has decided; don't make them scroll back up.

**8 · Footer** — phone, areas, business name. No address (service-area business).

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

Fixed, not from `accent`. **Call is red**. **WhatsApp copies WhatsApp's own badge exactly**: `#25d366`, white logo, white text. A customer identifies both before reading either. White on that green is only 2:1, below the 4.5:1 text minimum. That was a deliberate choice: the logo and the colour carry the button, and it looks like WhatsApp rather than an imitation of it. It also has a darker edge, because the fill alone is too light to define the button against a white page. Both flip to brighter values in dark mode; see the comments in `global.css`.

---

## Photographs

`Photo` is `{ file, alt }` — the file sits in `src/assets/` and `resolvePhoto()` looks it up, so `client.ts` stays plain data and a filename typo drops the image instead of failing the build. Everything goes through `astro:assets`: WebP, a srcset, and explicit dimensions.

### The logo

`logo` renders as a **64px rounded tile (80px from `sm`) beside the business name**, not as a lockup replacing it. Two reasons, both from the asset: it is opaque (no alpha, so it cannot sit on a white header without a grey box), and its own wordmark is unreadable below about 150px. As a tile the baked-in background reads as deliberate, and the name stays as live, selectable, translatable text.

Swap to a proper lockup only when a transparent SVG or PNG arrives — a Google Business Profile export is a downscaled re-encode, never the original.

The hero ships with a stock placeholder. **The About portrait deliberately does not.** Free stock has no credible UK sole-trader portrait in it, and a stranger's face presented as the owner reads as fake — which costs more trust than an empty space does. It stays unset until the client sends a real one.

---

## Colour bands

The page alternates full-width bands so the colour isn't confined to buttons:

| Band | Class |
|---|---|
| Header | `.on-accent` |
| Hero | `.on-dark` |
| Services | `.on-accent` |
| About → Credentials | page background / `--surface` |
| Call band | `.on-accent` |

`.on-dark` stays dark in both colour schemes. Colour photography reads against it rather than washing into a white page, and it matches the OG card. `.on-accent` fills with the client's `accent` and turns text white, muted text 88% white, and cards and borders into white washes — so it tints with whatever accent a client has.

Both work by **redefining the tokens**, not by hardcoding colours, so everything nested inside adapts without knowing what ground it is on. That matters most for the CTA pair: the light-mode red only clears 2.7:1 against dark and stops reading as a button, so `.on-dark` swaps in the brighter one. Every pair is measured — see the comment in `global.css`, and re-check it if the values move.

---

## Icons

Font Awesome Free (solid), from `@fortawesome/free-solid-svg-icons`, rendered as inline SVG at build time by `Icon.astro` — no icon font, no runtime JS. `client.ts` names icons by key (`icon: 'bath'`) so the config stays plain data; the keys live in `src/lib/icons.ts`, which is the one place to add another FA icon. Icons are decorative (`aria-hidden`) — the text beside each one already says what it means.

FA Free icons are CC BY 4.0. Inlining drops the attribution comments the package files carry, so a strict reading wants a credit somewhere (footer or page source).

---

## Accent colour

Take it from the logo, then check it before using it. Ian's droplet is `#1789eb`, which is only **3.6:1 on white** — fine as a large fill, fails as link text. The config carries the darkened `#0a63b2` (6.1:1) instead.

`accent` drives `--link`, the hero eyebrow, and the fill of every `.on-accent` band — so it **must carry white text at 4.5:1**. The CTA pair is fixed red/green by design. **`accentDark` drives nothing at all** — either wire it to a link hover state or drop the field.

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
- `sitemap` via `@astrojs/sitemap`; `robots.txt` generated by `src/pages/robots.txt.ts`. Both take their origin from `client.siteUrl` through `site` in `astro.config.mjs`. Internal links carry the trailing slash so they match the canonical and sitemap URLs
- **No `aggregateRating` in the JSON-LD.** The Checkatrade score is shown on the page but deliberately not marked up: Google treats a business marking up its own aggregate rating as self-serving, and the risk of a manual action outweighs a star snippet that may never appear. Revisit only if Checkatrade publishes an official badge/widget.

---

## Deploy

Cloudflare Pages, connected to the repo. Domain, DNS and hosting in one account.

- Build: `npm run build` · output `dist`
- Custom domain `iansmithplumbing.co.uk` via the Pages project
- Preview deploys on branches for showing Ian before it goes live

---

## Definition of done for launch

- [ ] No `TODO` badge renders anywhere on the site
- [ ] No business-specific string appears outside `client.ts` and `/public`
- [ ] Lighthouse mobile ≥ 95 across the board
- [ ] Button pair works on a real phone — call dials, WhatsApp opens with the prefill
- [ ] `public/og.jpg` matches the config: name, number, areas. It's a static image, so a phone or area change in `client.ts` doesn't update it
- [ ] Link preview checks out: paste the live URL into WhatsApp and confirm the card renders

---

## Open TODOs before launch

Confirmed from his Checkatrade profile (`/trades/iansmithplumbing`): **sole trader, Hook, Hampshire. 9.89 from 95 reviews. Checkatrade member since January 2019. City & Guilds Level 2. Domestic work only.** No Gas Safe accreditation is listed, which matches gas going to his mate.

Blocking:

1. **Gas work.** `gasSafe` is omitted for now, so the site says nothing about gas. If it comes back: the engineer's name and registration number, and whether the mate is happy to be named
2. **Is he actually insured?** `insured` is `false` until he shows a public liability certificate, so the site makes no insurance claim. Checkatrade lists "Insurance Work Undertaken", which means he takes insurance-claim work — it is *not* a statement that he carries public liability cover

Worth having:

3. **The service radius.** Review postcodes prove RG27, RG21, RG23, RG29, GU34 and GU12; the config adds Fleet and Hartley Wintney as adjacent. Confirm the outer edge before generating area pages
4. **Where he says he is based.** `baseTown` is `'Hook'`; he may prefer Newnham or "the Hook area". One-line change, but it feeds the H1 fallback, the `<title>`, the eyebrow and the schema
5. **When he actually started trading.** `since: 2019` is his Checkatrade join date, not necessarily his start date — he was at Harrods before plumbing
6. **A photograph of Ian**, ideally by the van. `aboutImage` stays unset until it arrives. There are 30+ job photos on his profile worth pulling too
7. **The logo original**, if one exists — SVG or transparent PNG

### Competition

`simonduffplumbing.co.uk` covers Woking, Guildford, Frimley, Camberley and Farnborough — overlapping patch. Weaker site (mailto as the primary CTA, "Reliable. Trusted. Local." as the H1) but it has the About section, per-service copy and "established 2014" that this site now has. Ian's 9.89 over 95 reviews is the thing they cannot match.
