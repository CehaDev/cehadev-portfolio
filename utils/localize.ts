export type LS = { id: string; en?: string }

export function isLS(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const o = value as Record<string, unknown>
  if (typeof o.id !== 'string') return false
  return Object.keys(o).every((k) => k === 'id' || k === 'en')
}

export function localize<T>(value: T, lang: 'id' | 'en'): T {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, lang)) as T
  }
  if (isLS(value)) {
    const o = value as Record<string, unknown>
    return ((lang === 'en' && typeof o.en === 'string' && o.en) || o.id) as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = localize(v, lang)
    }
    return out as T
  }
  return value
}
