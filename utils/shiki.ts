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

export function isShikiLang(lang: string): boolean {
  return lang in shikiLangs
}

export async function codeToHtml(code: string, lang: string, theme = 'github-dark') {
  const hl = await getHighlighter()
  const safeLang = isShikiLang(lang) ? lang : 'text'
  return hl.codeToHtml(code, { lang: safeLang, theme })
}
