/**
 * Speech-to-text abstraction (PRD Section 8). Default: tidak ada provider; bot
 * melempar error terarah bila belum dikonfigurasi. Provider (Gemini/Groq) dapat
 * di-set via env, dan stub dapat diinjeksi untuk test.
 */

const stub: { fn: ((audio: { data: Buffer; mimeType: string }) => Promise<string>) | null } = { fn: null }

export function __setTranscriberForTest(fn: ((audio: { data: Buffer; mimeType: string }) => Promise<string>) | null) {
  stub.fn = fn
}

export interface TranscribeResult {
  text: string
  provider: string
}

export async function transcribeAudio(audio: { data: Buffer; mimeType: string }): Promise<TranscribeResult> {
  if (stub.fn) {
    const text = await stub.fn(audio)
    return { text, provider: 'stub' }
  }
  if (process.env.STT_PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
    return transcribeWithGemini(audio)
  }
  throw new Error('Speech-to-text belum dikonfigurasi (set STT_PROVIDER=gemini + GEMINI_API_KEY)')
}

async function transcribeWithGemini(audio: { data: Buffer; mimeType: string }): Promise<TranscribeResult> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { inline_data: { mime_type: audio.mimeType || 'audio/ogg', data: audio.data.toString('base64') } },
          { text: 'Transkripsikan pesan suara ini ke teks bahasa Indonesia. Hanya kembalikan transkrip, tanpa komentar.' }
        ]
      }
    ],
    generationConfig: { temperature: 0.2 }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY! },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Gemini STT HTTP ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  if (!text.trim()) throw new Error('Transkrip kosong')
  return { text, provider: 'gemini' }
}
