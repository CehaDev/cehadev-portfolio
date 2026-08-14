const THEME_KEY = 'cehadev-theme'

export type Theme = 'light' | 'dark'

function themeFromClass(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function themeFromStorage(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* localStorage tidak tersedia */
  }
  return themeFromClass()
}

export function useTheme() {
  const theme = ref<Theme>('dark')

  function apply(next: Theme) {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        /* abaikan jika localStorage tidak tersedia */
      }
      const meta = document.querySelector('meta[name="theme-color"]')
      meta?.setAttribute('content', next === 'dark' ? '#0A0A0F' : '#F7F8FA')
    }
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  if (import.meta.client) {
    onMounted(() => {
      theme.value = themeFromStorage()
    })
  }

  return { theme, toggle, apply }
}
