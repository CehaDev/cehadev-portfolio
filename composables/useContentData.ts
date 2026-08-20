import { localize } from '~/utils/localize'

type LangRef = Ref<'id' | 'en'>

interface AsyncDataShape<T> {
  data: Ref<T>
  pending: Ref<boolean>
  error: Ref<any>
  status: Ref<any>
  refresh: () => Promise<void>
  execute: () => Promise<void>
  clear: () => void
}

function localizedResult<T>(res: AsyncDataShape<T>, lang: LangRef) {
  return {
    data: computed(() => localize(res.data.value, lang.value)),
    pending: res.pending,
    error: res.error,
    status: res.status,
    refresh: res.refresh,
    execute: res.execute,
    clear: res.clear
  }
}

export async function useSiteSettings() {
  const { lang } = useLang()
  return localizedResult(await useAsyncData('site-settings', () => $fetch('/api/content/site')), lang)
}

export async function useCvContent() {
  const { lang } = useLang()
  return localizedResult(await useAsyncData('cv-content', () => $fetch('/api/content/cv')), lang)
}

export async function useSkillsContent() {
  const { lang } = useLang()
  return localizedResult(await useAsyncData('skills-content', () => $fetch('/api/content/skills')), lang)
}

export async function useProjectsContent() {
  const { lang } = useLang()
  return localizedResult(
    await useAsyncData('projects-content', () => $fetch<Array<{ archived?: boolean }>>('/api/content/projects')),
    lang
  )
}
