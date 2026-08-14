import { localize } from '~/utils/localize'

type LangRef = Ref<'id' | 'en'>

function localizedResult<T>(res: Awaited<ReturnType<typeof useAsyncData<T>>>, lang: LangRef) {
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
  return localizedResult(await useAsyncData('site-settings', () => queryCollection('site').first()), lang)
}

export async function useCvContent() {
  const { lang } = useLang()
  return localizedResult(await useAsyncData('cv-content', () => queryCollection('cv').first()), lang)
}

export async function useSkillsContent() {
  const { lang } = useLang()
  return localizedResult(await useAsyncData('skills-content', () => queryCollection('skills').first()), lang)
}

export async function useProjectsContent() {
  const { lang } = useLang()
  return localizedResult(
    await useAsyncData('projects-content', async () => {
      const all = await queryCollection('projects').all()
      return all.filter((p) => !(p as unknown as { archived?: boolean }).archived)
    }),
    lang
  )
}
