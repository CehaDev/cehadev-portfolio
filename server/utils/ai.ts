export interface GenerateOptions {
  json?: boolean
  temperature?: number
}

const override: { fn: ((opts: { system: string; prompt: string; json?: boolean; temperature?: number }) => Promise<{ text: string }>) | null } = { fn: null }

/**
 * Test seam — injeksi stub AI client agar pipeline bisa diuji tanpa jaringan.
 */
export function __setAiClientForTest(
  fn: ((opts: { system: string; prompt: string; json?: boolean; temperature?: number }) => Promise<{ text: string }>) | null
) {
  override.fn = fn
}

function parseJson(text: string): unknown {
  let t = text.trim()
  const fenced = t.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/)
  if (fenced) t = fenced[1].trim()
  try {
    return JSON.parse(t)
  } catch {
    const start = t.indexOf('{')
    const end = t.lastIndexOf('}')
    if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1))
    throw new Error('AI tidak mengembalikan JSON valid')
  }
}

/**
 * Memanggil Gemini (default) atau stub yang diinjeksi (test).
 * Selalu menormalkan ke objek { text } dengan JSON diparse bila json=true.
 */
export async function generateContent(opts: {
  system: string
  prompt: string
  json?: boolean
  temperature?: number
}): Promise<{ text: string; json?: unknown }> {
  if (override.fn) {
    const res = await override.fn(opts)
    if (opts.json) {
      return { text: res.text, json: parseJson(res.text) }
    }
    return { text: res.text }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum diatur')
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
      systemInstruction: { parts: [{ text: opts.system }] },
      generationConfig: {
        temperature: opts.temperature ?? 0.7,
        ...(opts.json ? { responseMimeType: 'application/json' } : {})
      }
    })
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${body.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  if (opts.json) return { text, json: parseJson(text) }
  return { text }
}
