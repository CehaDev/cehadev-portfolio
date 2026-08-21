export function useCanonical(path: string) {
  const origin = useRequestURL().origin
  const url = `${origin}${path}`
  useHead({
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${origin}/ch.png` }
    ]
  })
}
