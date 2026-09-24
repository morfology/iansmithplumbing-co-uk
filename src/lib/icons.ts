import {
  faBath,
  faClipboardCheck,
  faCreditCard,
  faDroplet,
  faFileInvoice,
  faGaugeHigh,
  faGraduationCap,
  faHouseCircleCheck,
  faHouseFloodWater,
  faPhone,
  faArrowsRotate,
  faShieldHalved,
  faShower,
  faTemperatureArrowUp,
  faTemperatureHalf,
  faToilet,
  faWater,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

/**
 * Font Awesome Free (solid, plus the WhatsApp brand mark), rendered as inline
 * SVG at build time — no icon font, no runtime JS. client.ts names icons by these keys so the config stays
 * plain data; add a key here to make another FA icon available.
 */
export const icons = {
  bath: faBath,
  water: faWater,
  radiator: faTemperatureHalf,
  underfloor: faTemperatureArrowUp,
  shower: faShower,
  flush: faArrowsRotate,
  pump: faGaugeHigh,
  toilet: faToilet,
  leak: faHouseFloodWater,
  droplet: faDroplet,
  wrench: faWrench,
  insured: faShieldHalved,
  qualified: faGraduationCap,
  vetted: faClipboardCheck,
  estimate: faFileInvoice,
  insurance: faHouseCircleCheck,
  card: faCreditCard,
  phone: faPhone,
  whatsapp: faWhatsapp,
} satisfies Record<string, IconDefinition>

export type IconName = keyof typeof icons
