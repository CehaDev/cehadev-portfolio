import { Marked } from 'marked'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langJavascript from 'shiki/dist/langs/javascript.mjs'
import langTypeScript from 'shiki/dist/langs/typescript.mjs'
import langPython from 'shiki/dist/langs/python.mjs'
import langPhp from 'shiki/dist/langs/php.mjs'
import langSql from 'shiki/dist/langs/sql.mjs'
import langBash from 'shiki/dist/langs/bash.mjs'
import langJson from 'shiki/dist/langs/json.mjs'
import langHtml from 'shiki/dist/langs/html.mjs'
import langCss from 'shiki/dist/langs/css.mjs'
import langJava from 'shiki/dist/langs/java.mjs'
import langGo from 'shiki/dist/langs/go.mjs'
import langRust from 'shiki/dist/langs/rust.mjs'
import langRuby from 'shiki/dist/langs/ruby.mjs'
import langDart from 'shiki/dist/langs/dart.mjs'
import langYaml from 'shiki/dist/langs/yaml.mjs'
import langMarkdown from 'shiki/dist/langs/markdown.mjs'
import langGithubDark from 'shiki/dist/themes/github-dark.mjs'

type ShikiLang = typeof langJavascript

const shikiLangs: Record<string, ShikiLang> = {
  javascript: langJavascript,
  typescript: langTypeScript,
  python: langPython,
  php: langPhp,
  sql: langSql,
  bash: langBash,
  json: langJson,
  html: langHtml,
  css: langCss,
  java: langJava,
  go: langGo,
  rust: langRust,
  ruby: langRuby,
  dart: langDart,
  yaml: langYaml,
  markdown: langMarkdown
}

const engine = createJavaScriptRegexEngine()
let highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighterCore>>> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [langGithubDark],
      langs: Object.values(shikiLangs),
      engine
    })
  }
  return highlighterPromise
}

export function isServerShikiLang(lang: string): boolean {
  return lang in shikiLangs
}

export async function highlightCode(code: string, langRaw: string, theme = 'github-dark') {
  const hl = await getHighlighter()
  const safeLang = isServerShikiLang((langRaw || '').trim().split(/\s+/)[0] || '')
    ? (langRaw.trim().split(/\s+/)[0] as string)
    : 'text'
  return hl.codeToHtml(code, { lang: safeLang, theme })
}

export async function renderMarkdown(src: string): Promise<string> {
  if (!src.trim()) return ''

  const blocks: Array<{ text: string; lang: string }> = []
  const md = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }) {
        const i = blocks.length
        blocks.push({ text, lang: lang ?? '' })
        return `<span data-mdcode="${i}"></span>`
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        return `<a href="${href}"${title ? ` title="${title}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}` : ''}>${text}</a>`
      },
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens)
        const id = text
          .replace(/<[^>]*>/g, '')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .slice(0, 80) || `bagian-${depth}`
        return `<h${depth} id="${id}">${text}</h${depth}>`
      }
    }
  })

  let html = md.parse(src) as string

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    let codeHtml: string
    try {
      codeHtml = await highlightCode(block.text, block.lang)
    } catch {
      codeHtml = `<pre><code>${block.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    }
    html = html.replace(`<span data-mdcode="${i}"></span>`, () => codeHtml)
  }

  return html
}
