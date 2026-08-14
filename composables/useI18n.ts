import { dict, type DictKey } from '~/utils/dict'

export function useI18n() {
  const { lang, isEn, toggleLang, setLang } = useLang()

  function t(key: DictKey, vars?: Record<string, string | number>): string {
    const entry = dict[key]
    const text = entry ? (lang.value === 'en' && entry.en ? entry.en : entry.id) : key
    if (!vars) return text
    return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(vars[k] ?? `{{${k}}}`))
  }

  return { t, lang, isEn, toggleLang, setLang }
}
