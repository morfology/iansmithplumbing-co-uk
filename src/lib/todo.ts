/**
 * Two different kinds of "missing", deliberately kept apart:
 *
 *   'TODO'     — we don't know this yet. Renders as a visible placeholder so it
 *                can't ship unnoticed, and is never used as a real href.
 *   undefined  — this client genuinely doesn't have one (no Gas Safe number,
 *                no reviews). Omitted from the page entirely.
 */
export function isTodo(value: string | undefined): boolean {
  return typeof value === 'string' && value.trimStart().toUpperCase().startsWith('TODO')
}

/** The value only if it is present, known, and safe to render or link to. */
export function known(value: string | undefined): string | undefined {
  return value !== undefined && !isTodo(value) ? value : undefined
}
