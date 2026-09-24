# Website — working todo

`trade-site-template` → `iansmithplumbing-site` · updated as we go

---

## 🔴 Blockers — resolve first

> **Decision: this repo is Ian's site.** Not maintaining a separate template for now — extract it later from something that works.
>
> **But keep the config discipline.** Every client-specific value stays in `client.ts`. It's free while you're building anyway, and it's the only thing that makes extraction a copy-and-swap rather than a rewrite. Scatter phone numbers and town names through components and client two costs a week.

### Real data in

- [x] `phone: '07859 063383'` · `phoneE164: '+447859063383'` · `whatsappNumber: '447859063383'`
- [x] Remove the remaining demo values (`Marlow & Sons`, `Middleford`, Ofcom numbers) — nothing should reference them now
- [x] `siteUrl: 'https://iansmithplumbing.co.uk'`
- [ ] `openingDate: 2010` → surface as "Serving Hook and North Hampshire since 2010"
- [ ] Rename the repo `iansmithplumbing-site` (GitHub redirects the old name, so nothing breaks)

### ⚠️ Check the demo flag can't noindex the live site

`isDemo` currently drives both the banner **and** `noindex`. If it's left true — or defaults truthy — Ian's site ships invisible to Google. Given his profile is already suspended, that would be quietly catastrophic and hard to spot.

- [x] `isDemo` removed or explicitly `false` in Ian's config
- [x] Demo banner gone
- [ ] **View source on the deployed site and confirm there is no `noindex`** — don't trust the config, check the output
- [x] `robots.txt` allows crawling *(`Allow: /` plus the sitemap line; the build output has no `noindex` anywhere, so the check below is only waiting on a deploy)*

---

## ⚠️ Verify with Ian before launch — claims we can't currently evidence

> These are factual assertions that would sit on a live page. Each is currently either wrong or unverified. **Nothing here ships unconfirmed.**

### 1 · Trading since — config says 2019, Google says 2010

- [ ] **Ask Ian what year he started.** Google Business Profile export gives **opening date 2010-06-07**. The `2019` in config is almost certainly the year the `.com` domain was registered, not the business
- [ ] Sixteen years vs seven is a material trust difference — and it's the asset nobody is using
- [ ] Once confirmed: `since: ____`, surfaced in the hero and used in the reinstatement appeal

### 2 · "Fully insured" — currently unevidenced

- [ ] **Ask Ian for his public liability certificate.** Checkatrade's *"Insurance Work Undertaken"* means he works on insurance claims — it is **not** a statement that he carries cover. The two got conflated
- [x] `insured: false` until the certificate is in hand
- [ ] He needs it for the LSA application anyway, so you're asking regardless
- [ ] Record provider and expiry in the Notion asset register

### 3 · Gas Safe and the scope of "heating"

- [ ] **Ask Ian exactly what he does and doesn't touch.** Wet underfloor and radiators aren't gas work; boilers are
- [ ] The tagline says "heating" and customers will ring about boilers — he needs a clear answer for them either way
- [ ] Gas Safe is a statutory registration, not a marketing claim. If he isn't on the register, nothing on the site may imply he is
- [ ] If he subcontracts gas work, the copy says so explicitly

### 4 · Logo provenance

- [ ] **Is `logo.webp` actually his, or generated?** A stock hero photo is a placeholder; an invented logo is a fabricated brand identity
- [ ] If invented: drop to a text-only header until he has a real one. Not a downgrade

### 5 · Area drive times and review postcodes

- [ ] Have Ian sanity-check the drive times in the area blurbs
- [ ] Confirm the outer edge of his patch — currently Hook, Basingstoke, Fleet, Odiham, Hartley Wintney, Alton, Aldershot
- [ ] "Reviews from customers in [postcode]" only where a review postcode genuinely appears on his listing *(CC has done this correctly — just spot-check one)*

---

## 📊 Stop the review rating drifting

**9.89 / 95 reviews** is the strongest thing on the page. It's also a factual claim that will be wrong in three months.

There's no public Checkatrade API and scraping it would be fragile and probably against their terms — so don't automate it. Date it instead, which is honest and ages gracefully.

- [x] Add to config *(landed as `rating.asOf`, required on the `Rating` type)*:
  ```ts
  reviews: {
    rating: 9.89,
    count: 95,
    source: 'Checkatrade',
    asOf: '2026-09',        // ← the fix
    url: 'https://...',     // his listing
  }
  ```
- [x] Render as: **9.89 / 10 · 95 reviews on Checkatrade, September 2026**
- [ ] Add "update review count and rating" to the **monthly report checklist** — a 30-second job inside a cadence that already exists
- [ ] Same treatment for **"established 2010"** — that one's safe, it never goes stale

### Also verify before launch

- [ ] **"I've got Checkatrade reviews from customers in RG29"** — is that true and checkable on his listing, or inferred? It's a specific claim on a live page. If it can't be verified per area, soften to something that's true everywhere

---

## 🌓 Theme — no toggle

**Short answer: yes, a toggle is too nerdy here.** It's a developer-audience feature. Someone with water coming through their ceiling should not be offered a colour-scheme control — it's a third button competing with the two that matter.

Different from the MP Consult site, where the audience *is* technical and a toggle signals craft.

### Decision: light is primary

**It may already be.** The accent `#0a63b2` was chosen and contrast-checked **against white** (6.1:1) — that's a light-first decision. What you were looking at was probably just dark mode firing because your Mac is set to dark.

- [ ] **Check first.** DevTools → Rendering → *Emulate prefers-color-scheme: light*. Or flip macOS appearance. If light already looks finished, there's nothing to do
- [ ] If it doesn't, light gets the design attention and dark follows

**Why light:** most visitors are on system default, which is light — especially the demographic buying plumbing. Light with a strong accent reads friendlier for a local trade and stays legible on a phone outdoors, which is exactly the situation someone's in. Dark reads premium and technical, which isn't the signal here.

- [ ] Check both themes across: buttons, rating badge, emergency strip, review cards, photos, header
- [x] **No toggle.** Developer-audience feature; a third control competing with the two that matter

---

## 📷 Photos — the biggest single improvement available

Current hero is stock. Nothing else will make the site feel like *his* business as cheaply as real photos.

### Shot list, best first

- [ ] **Ian himself.** Chest-up, outdoors or beside the van, natural light, no forced smile. This is the highest-trust image on the site and almost no trade has one — you're asking someone to let a stranger into their house
- [ ] **Arm-deep shots.** Hands under a sink, on a boiler, cutting pipe. Close, slightly messy, obviously real. These are the ones that say "this is a person who does this"
- [ ] **Before / after pairs.** The most persuasive thing a trade can show
- [ ] **Finished work** — a neat bathroom, a tidy boiler install
- [ ] **Tools / van interior** — texture shots, good for section breaks
- [ ] **The van** — once it's signwritten

**Eight to twelve is plenty.** Slightly imperfect real photos beat polished stock every time — that's the whole point of having them.

### Sources

- [ ] Ian's phone (originals — full resolution, and there'll be more than he uploaded anywhere)
- [ ] His Checkatrade listing (inventory of what exists, but compressed — use as a prompt, not a source)
- [ ] Old Wix media library if the account is recoverable

### Handling

- [ ] **Strip EXIF before anything is committed** — `exiftool -all= *.jpg`. Phone photos carry GPS, and these were taken at customers' houses and his own. Publishing them publishes those locations
- [ ] Landscape ≥1600px for hero, portrait fine for the photo of Ian
- [ ] Through `astro:assets` for sizing and format
- [ ] Nothing showing a recognisable room in a customer's home without a word from Ian. Pipework, boilers and bathrooms are fine; someone's kitchen is theirs as much as his

---

## ✅ Landed already

- [x] H1 leads with the promise, business name as an eyebrow
- [x] Header with name and tap-to-call number
- [x] Services with descriptions and emergency badges
- [x] Area pages generated, with a genuinely local line per town
- [x] Cross-links between areas
- [x] Closing CTA naming the town
- [x] Review quotes with attribution and an outbound link to Checkatrade
- [x] Rating badge surfaced in hero and reviews

---

## Before launch

- [ ] Real phone number everywhere — character-identical to the Google listing
- [ ] `og:image` renders — **paste the URL into WhatsApp and check the card**
- [ ] Buttons tested on a real phone: Call dials, WhatsApp opens with the prefill intact
- [ ] Light and dark both checked
- [x] Lighthouse mobile clean *(100 / 95 / 100 / 100 on `/` and an area page; the last accessibility points go to the WhatsApp button's 2:1 contrast, which is deliberate)*
- [ ] `siteUrl` correct, canonical resolving
- [ ] Deployed to Cloudflare Pages, custom domain live
- [ ] **Google listing website field pointed at `.co.uk`** — part of the reinstatement fixes, since the `.com` currently resolves to a dead Wix placeholder

---

## Later

- [ ] Google reviews alongside Checkatrade once the profile is reinstated — and eventually leading. The site currently advertises the platform he's trying to leave, which is right for now and shouldn't be permanent
- [ ] Presets (fonts / hero variants) — Phase 2 in `SCAFFOLD.md`
- [ ] Demo switcher for prospects
- [ ] Auto-generated OG images per client
