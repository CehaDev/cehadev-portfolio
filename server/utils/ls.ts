export function normalizeLS(v: unknown): { id: string; en: string } {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const o = v as Record<string, unknown>
    const id = typeof o.id === 'string' ? o.id.trim() : ''
    const en = typeof o.en === 'string' ? o.en.trim() : ''
    return { id, en }
  }
  if (typeof v === 'string') {
    const s = v.trim()
    return { id: s, en: s }
  }
  return { id: '', en: '' }
}

export function normalizeLSArray(v: unknown) {
  if (!Array.isArray(v)) return []
  return v.map((x) => normalizeLS(x)).filter((i) => i.id)
}

export function normalizeLSObject(v: unknown, keys: string[]) {
  if (!Array.isArray(v)) return []
  return v.map((x) => {
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
    const out: Record<string, { id: string; en: string }> = {}
    for (const k of keys) out[k] = normalizeLS(o[k])
    return out
  })
}

function isLSPair(v: unknown): v is { id: string } {
  return Boolean(v && typeof v === 'object' && !Array.isArray(v) && typeof (v as { id?: unknown }).id === 'string')
}

export function deepLS(v: unknown): unknown {
  if (isLSPair(v)) return normalizeLS(v)
  if (typeof v === 'string') return normalizeLS(v)
  if (Array.isArray(v)) return v.map(deepLS)
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(o)) out[k] = deepLS(val)
    return out
  }
  return v
}
