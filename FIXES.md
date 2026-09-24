# FIXES — homepage review, round 1
 
Apply in order. Config first, then components. Re-run Lighthouse at the end.
 
---
 
## 1 · Config changes
 
### 1a · Services become objects, not two arrays
 
`emergencyServices` and `services` currently fight each other — "No water" gets badged, "Emergency callouts" doesn't, and the merged order is arbitrary.
 
**Delete `emergencyServices` entirely.** Replace with:
 
```ts
export interface Service {
  name: string
  emergency?: boolean
}
```
 
```ts
services: [
  { name: 'Leak repair', emergency: true },
  { name: 'Burst pipes', emergency: true },
  { name: 'No water', emergency: true },
  { name: 'Emergency callouts', emergency: true },
  { name: 'Taps and toilets' },
  { name: 'Radiators' },
  { name: 'Blocked drains' },
],
```
 
Render in config order, badge where `emergency`. One list, one source of truth.
 
### 1b · New required fields
 
```ts
siteUrl: string        // 'https://tradedemo.mpconsult.uk' — no trailing slash
ogImage?: string       // '/og.jpg' — 1200×630
voice: 'i' | 'we'
```
 
Demo values: `siteUrl: 'https://tradedemo.mpconsult.uk'`, `voice: 'we'` (it's "& Sons"). Ian's will be `voice: 'i'`.
 
---
 
## 2 · Voice — a copy file, not a grammar engine
 
The page says "What I do" while the business is "& Sons". Don't build a pluraliser; put the handful of voice-dependent strings in one place.
 
`src/config/copy.ts`:
 
```ts
import { client } from './client'
 
const v = (i: string, we: string) => (client.voice === 'i' ? i : we)
 
export const copy = {
  servicesHeading: v('What I do', 'What we do'),
  awayStrap: v(
    "Can't answer? Message me — I reply between jobs.",
    "Can't answer? Message us — we reply between jobs."
  ),
  areasIntro: (town: string) =>
    v(`Based in ${town}, covering the surrounding towns and villages.`,
      `Based in ${town}, covering the surrounding towns and villages.`),
  emergencyStrip:
    "Water coming through the ceiling? Turn the stopcock off — usually under the kitchen sink — then call. Don't wait for a quote.",
}
```
 
Every user-facing string in components comes from here. Components never hold literal copy.
 
---
 
## 3 · The H1 is doing the title tag's job
 
Currently: `Marlow & Sons Plumbing — Leaks, burst pipes and emergency callouts`
 
Too long, and it leads with the company rather than the promise. Someone with a leak wants to know they're in the right place in one glance.
 
**Replace the hero heading block with:**
 
```astro
<p class="text-sm font-semibold tracking-wide uppercase" style="color: var(--muted);">
  {client.businessName}
</p>
<h1 class="mt-1 text-3xl leading-tight font-extrabold sm:text-4xl">
  Emergency {client.trade} in {client.baseTown}
</h1>
<p class="mt-3 text-lg" style="color: var(--text);">
  {client.tagline}
</p>
<p class="mt-2 text-base" style="color: var(--muted);">
  {client.gasSafeNumber ? 'Gas Safe registered · ' : ''}{client.insured ? 'Fully insured · ' : ''}covering {areaList}
</p>
```
 
Business name stays on the page, just not eating the H1. Keep the `<title>` tag exactly as it is — that one's correct.
 
---
 
## 4 · Open Graph — the highest-value fix on this list
 
There's no `og:image`. When someone drops the link into a local Facebook recommendations thread — which is the whole channel strategy — a bare link converts far worse than a card with a picture.
 
**Add to the head:**
 
```astro
<meta property="og:url" content={client.siteUrl} />
<meta property="og:site_name" content={client.businessName} />
{client.ogImage && (
  <>
    <meta property="og:image" content={`${client.siteUrl}${client.ogImage}`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
  </>
)}
```
 
Omit the tags entirely when there's no image rather than shipping a broken URL.
 
**Also fix canonical** — currently hardcoded `https://example.com/`:
 
```astro
<link rel="canonical" href={new URL(Astro.url.pathname, client.siteUrl).href} />
```
 
Add a 1200×630 `public/og.jpg` for the demo. Auto-generating these per client is a phase-2 nicety, not now.
 
---
 
## 5 · Accent colour — one source of truth
 
`global.css` declares `--accent: #1f2937` on `:root`, while the layout sets `--accent: #1f4e79` inline on `<html>`. Inline wins, so it currently works — but if the inline ever fails you get a silently *different* colour rather than an obvious break.
 
**Remove `--accent` and `--accent-dark` from the `:root` block in `global.css`.** Keep them set inline from config only. Leave `--accent-ink` in `:root` — that isn't client-specific.
 
Failing loudly beats failing quietly.
 
---
 
## 6 · Reviews grid orphan
 
Three reviews in a two-column grid leaves a dangling card.
 
Make the last item span both columns when the count is odd:
 
```astro
<li class:list={[
  'rounded-lg border p-4',
  i === reviews.length - 1 && reviews.length % 2 === 1 && 'sm:col-span-2'
]}>
```
 
---
 
## 7 · Hardcoded year
 
`© 2026` in the footer. Use `{new Date().getFullYear()}` or you'll be fixing it across every client site in January.
 
---
 
## 8 · Small header
 
The page currently starts with the demo banner and goes straight into the hero — the business name appears only in the H1 and footer.
 
Add a minimal header above the hero: business name left, tap-to-call phone right. No nav, nothing else. It gives the page an anchor and puts the number in a second place without cost.
 
---
 
## Not in this round
 
Deliberately excluded, so don't let them creep in:
 
- Photography — needs Ian's real images, and it's the thing that will change the look most
- Preset / font / hero variants — Phase 2 in `SCAFFOLD.md`
- Area pages — separate build session
- Auto-generated OG images — phase 2
---
 
## Done when
 
- [ ] `grep -r "Marlow\|900123\|Middleford" src/` returns hits only in `src/config/client.ts`
- [ ] No literal user-facing copy in any component — it all comes from `copy.ts` or `client.ts`
- [ ] Page renders correctly with `reviews: []`, `gasSafeNumber: undefined`, `ogImage: undefined`
- [ ] Lighthouse mobile still clean
- [ ] Link preview checks out — paste the deployed URL into WhatsApp and confirm the card renders
 