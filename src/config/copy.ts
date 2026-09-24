import { client } from './client'
import { joinNames, sentenceCase } from '../lib/seo'

/**
 * Every user-facing string lives here. Components hold no literal copy, so a
 * change of wording — or of voice — is one file, not a hunt through the markup.
 *
 * `v` picks between first-person singular and plural. A sole trader is "I", a
 * "& Sons" is "we"; anything that reads wrong in the other voice goes through
 * it. This is a copy file, deliberately not a pluralising grammar engine.
 */
const v = (i: string, we: string) => (client.voice === 'i' ? i : we)

const areaNames = client.areas.map((a) => a.name)
// baseTown is often also listed in areas — don't title it "X & X"
const nearby = areaNames.find((name) => name !== client.baseTown)

export const copy = {
  // head
  title: [
    `${client.businessName} — ${sentenceCase(client.trade)} in ${client.baseTown}`,
    nearby ? ` & ${nearby}` : '',
  ].join(''),
  description: `${client.tagline}. ${sentenceCase(client.trade)} covering ${joinNames(areaNames)}.`,

  // header
  headerCallLabel: (phone: string) => `Call ${phone}`,

  // hero
  heroHeading: `${sentenceCase(client.trade)} in ${client.baseTown}`,
  /** "Gas Safe registered · Fully insured · covering <areas>" — each part drops when absent. */
  heroCredentials: (areaList: string) =>
    [
      client.gasSafe
        ? client.gasSafe.who === 'self'
          ? 'Gas Safe registered'
          : 'Gas Safe engineer on gas work'
        : '',
      client.insured ? 'Fully insured' : '',
      areaList ? `covering ${areaList}` : '',
    ]
      .filter(Boolean)
      .join(' · '),
  awayStrap: v(
    "Can't answer? Message me — I reply between jobs.",
    "Can't answer? Message us — we reply between jobs."
  ),

  // calls to action
  ctaCall: 'Call now',
  ctaWhatsApp: v('WhatsApp me', 'WhatsApp us'),

  // emergency strip
  emergencyStrip:
    "Water coming through the ceiling? Turn the stopcock off — usually under the kitchen sink — then call. Don't wait for a quote.",

  // services
  servicesHeading: v('What I do', 'What we do'),
  emergencyBadge: 'Emergency',

  // areas
  areasHeading: 'Areas covered',
  areasIntro: (town: string) =>
    v(`I'm based in ${town} and cover the surrounding towns and villages.`,
      `We're based in ${town} and cover the surrounding towns and villages.`),

  // rating badge
  rating: {
    outOf: (outOf: number) => `/ ${outOf}`,
    summary: (count: number, source: string) => `${count} reviews on ${source}`,
    /** Read aloud in place of the badge's split-up numbers. */
    label: (score: number, outOf: number, count: number, source: string) =>
      `Rated ${score} out of ${outOf} from ${count} reviews on ${source}`,
  },

  // reviews
  reviewsHeading: 'What people say',
  reviewAttribution: (author: string, source?: string) => `— ${author}${source ? `, ${source}` : ''}`,
  moreReviews: (source: string) => `Read more reviews on ${source}`,

  // credentials
  credentialsHeading: 'Credentials',
  /**
   * 'self' is the only case that may claim registration. For 'partner' the
   * sentence has to make clear the registration is the engineer's, not the
   * trader's — the register is statutory and the claim is checkable.
   */
  gasSafe: (who: 'self' | 'partner', engineer?: string) => {
    if (who === 'self') return 'Gas Safe registered'
    return engineer
      ? `Gas work is carried out by ${engineer}, who is Gas Safe registered`
      : v(
          'Gas work is carried out by a Gas Safe registered engineer I work with',
          'Gas work is carried out by a Gas Safe registered engineer we work with'
        )
  },
  gasSafeNumber: (number: string) => `— no. ${number}`,
  insured: 'Fully insured',

  // footer
  footerCoverage: (areaList: string) => `${sentenceCase(client.trade)} covering ${areaList}.`,
  copyright: (year: number) => `© ${year} ${client.businessName}`,

  // demo banner
  demoNotice: 'Demo site — example business, not a real trader',

  // TODO placeholders — labels for values this client hasn't given us yet
  todo: {
    prefix: 'TODO',
    phoneDisplay: 'phone number (display)',
    phoneLink: 'phone number (tel: link)',
    phone: 'phone number',
    whatsapp: 'whatsapp number',
    gasSafeNumber: 'gas safe number',
  },
}
