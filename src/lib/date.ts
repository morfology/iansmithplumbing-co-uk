/**
 * '2026-09' -> 'September 2026'. Throws on anything else, so a malformed date
 * fails the build rather than rendering a rating with no date on it.
 */
export function formatYearMonth(value: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value)
  if (!match) throw new Error(`Expected a year-month like '2026-09', got '${value}'`)
  const [, year, month] = match
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1))
  )
}
