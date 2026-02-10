export function isNonEmptyString(value: unknown, maxLen: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLen
}

export function isOptionalString(value: unknown, maxLen: number) {
  return value == null || (typeof value === 'string' && value.trim().length <= maxLen)
}

export function isSafeId(value: unknown, maxLen = 32) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLen
}

export function isScore(value: unknown) {
  if (value == null || value === '') return false
  const score = Number(value)
  return Number.isFinite(score) && score >= 1 && score <= 5
}

export function isOptionalScore(value: unknown) {
  if (value == null || value === '') return true
  const score = Number(value)
  return Number.isFinite(score) && score >= 1 && score <= 5
}

export function isValidUrl(value: unknown, maxLen = 255) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLen) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
