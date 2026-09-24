import type { Photo } from '../config/client'

/**
 * Photos are referenced by filename in client.ts so the config stays plain data.
 * The glob is eager and build-time — the bundler still drops whatever isn't used.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
)

/** undefined when the config names a file that isn't there, so a typo drops the
    image rather than failing the build with a stack trace. */
export function resolvePhoto(photo: Photo | undefined): ImageMetadata | undefined {
  return photo ? files[`../assets/${photo.file}`]?.default : undefined
}
