import { Marked } from 'marked'
import { codeToHtml } from '~/utils/shiki'

export async function renderMarkdown(src: string): Promise<string> {
  if (!src.trim()) return ''

  const blocks: Array<{ text: string; lang: string }> = []
  const md = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }) {
        const i = blocks.length
        blocks.push({ text, lang })
        return `<span data-mdcode="${i}"></span>`
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`
      }
    }
  })

  let html = md.parse(src) as string

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    let codeHtml: string
    try {
      codeHtml = await codeToHtml(block.text, (block.lang || '').trim().split(/\s+/)[0] || 'text')
    } catch {
      codeHtml = `<pre><code>${block.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    }
    html = html.replace(`<span data-mdcode="${i}"></span>`, () => codeHtml)
  }

  return html
}

export function countWords(src: string) {
  return src
    .replace(/```[\s\S]*?```/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}
