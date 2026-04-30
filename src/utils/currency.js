/**
 * Shared currency formatting utilities — import from here, not per-page.
 */

export const formatRupiah = (n) => 'Rp ' + (n ?? 0).toLocaleString('id-ID')

export const formatCompact = (n) => {
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + 'jt'
  if (n >= 1_000)     return 'Rp ' + (n / 1_000).toFixed(0) + 'rb'
  return 'Rp ' + (n ?? 0)
}
