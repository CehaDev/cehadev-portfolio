export function useLang() {
  const lang = useCookie<'id' | 'en'>('cehadev-lang', {
    default: () => 'id' as const,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/'
  })

  const isEn = computed(() => lang.value === 'en')

  function setLang(value: 'id' | 'en') {
    lang.value = value
  }

  function toggleLang() {
    lang.value = lang.value === 'id' ? 'en' : 'id'
  }

  return { lang, isEn, setLang, toggleLang }
}
