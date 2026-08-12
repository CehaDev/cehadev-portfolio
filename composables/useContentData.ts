export function useSiteSettings() {
  return useAsyncData('site-settings', () => queryCollection('site').first())
}

export function useCvContent() {
  return useAsyncData('cv-content', () => queryCollection('cv').first())
}

export function useSkillsContent() {
  return useAsyncData('skills-content', () => queryCollection('skills').first())
}

export function useProjectsContent() {
  return useAsyncData('projects-content', () => queryCollection('projects').all())
}
