<script setup lang="ts">
import { ArrowUp, Heart, Mail, Phone, MapPin, Github, Linkedin, Instagram, ArrowRight, MessageCircle, Eye, Users } from 'lucide-vue-next'

const route = useRoute()
const { data: site } = await useSiteSettings()
const { openChat } = useChatWidget()
const { data: stats, sourceOf, formatCount } = useStats()
const { t } = useI18n()
const year = new Date().getFullYear()

const isContact = computed(() => route.path.startsWith('/contact'))

const navItems = computed(() =>
  [
    { to: '/', key: 'home' },
    { to: '/about', key: 'about' },
    { to: '/projects', key: 'projects' },
    { to: '/articles', key: 'articles' },
    { to: '/contact', key: 'contact' }
  ].map(({ to, key }) => ({
    to,
    label: site.value?.headings?.nav?.[key] ?? t(`nav.${key}` as any)
  }))
)

const contactItems = computed(() => [
  { icon: Mail, label: t('footer.emailLabel'), value: site.value?.email ?? '', href: `mailto:${site.value?.email ?? ''}` },
  { icon: Phone, label: t('footer.phoneLabel'), value: site.value?.phone ?? '', href: `tel:${(site.value?.phone ?? '').replace(/[^+\d]/g, '')}` },
  { icon: MapPin, label: t('footer.locationLabel'), value: site.value?.location ?? '', href: `https://maps.google.com/?q=${encodeURIComponent(site.value?.location ?? '')}` }
])

const socials = computed(() => {
  const s = site.value?.socials ?? { github: '', linkedin: '', instagram: '' }
  return [
    { label: 'GitHub', icon: Github, href: s.github || '#' },
    { label: 'LinkedIn', icon: Linkedin, href: s.linkedin || '#' },
    { label: 'Instagram', icon: Instagram, href: s.instagram || '#' }
  ]
})
</script>

<template>
  <footer class="mt-24 print:hidden">
    <div class="container-site py-14 md:py-16">
      <!-- FAQ (hanya di halaman kontak) -->
      <div v-if="isContact" class="grid items-start gap-10 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <span class="section-label"><span class="dot" aria-hidden="true" /> {{ t('footer.faqTitle') }}</span>
          <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-3xl">
            {{ t('footer.faqHead') }}<span class="bg-gradient-brand bg-clip-text text-transparent">?</span>
          </h2>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            {{ t('footer.faqDesc') }}
          </p>
          <button type="button" class="btn-primary mt-6 !py-2.5" @click="openChat()">
            {{ t('footer.openChat') }}
            <MessageCircle :size="15" :stroke-width="2" />
          </button>
        </div>
        <ul class="space-y-2.5">
          <li v-for="(f, i) in site?.faqs ?? []" :key="i">
            <button
              type="button"
              class="group flex w-full items-center gap-3 rounded-card border border-border bg-card px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              @click="openChat(f.q)"
            >
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary" aria-hidden="true">
                <MessageCircle :size="15" :stroke-width="1.5" />
              </span>
              <span class="text-sm text-text-secondary transition-colors group-hover:text-text">{{ f.q }}</span>
              <ArrowRight
                :size="15"
                :stroke-width="2"
                class="ml-auto shrink-0 text-text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          </li>
        </ul>
      </div>

      <!-- KOLOM -->
      <div class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="text-xl font-extrabold tracking-tight">
            <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
          </NuxtLink>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            {{ t('footer.blurb', { role: site?.role ?? 'Web Developer & Tech Enthusiast' }) }}
          </p>
          <div v-if="stats" class="mt-4 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">
              <Eye :size="13" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              {{ formatCount(stats.total.views) }} {{ t('common.visits') }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">
              <Users :size="13" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              {{ formatCount(stats.total.visitors) }} {{ t('common.visitors') }}
            </span>
            <span v-if="sourceOf('Google') > 0" class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">
              {{ formatCount(sourceOf('Google')) }} {{ t('common.fromGoogle') }}
            </span>
          </div>
          <div class="mt-5 flex items-center gap-2.5">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-white"
              :aria-label="s.label"
            >
              <component :is="s.icon" :size="15" :stroke-width="1.5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-text">{{ t('footer.quickLinks') }}</h3>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in navItems" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-text-secondary transition-colors hover:text-primary">
                {{ link.label }}
              </NuxtLink>
            </li>
            <li>
              <a :href="site?.cvUrl ? `${site.cvUrl}?download=1` : '/cv?download=1'" class="text-sm text-text-secondary transition-colors hover:text-primary">
                {{ t('nav.downloadCv') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-text">{{ t('footer.contact') }}</h3>
          <ul class="mt-4 space-y-2.5">
            <li v-for="c in contactItems" :key="c.label">
              <a
                :href="c.href"
                :target="c.href.startsWith('http') ? '_blank' : undefined"
                :rel="c.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                class="group flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-primary"
              >
                <component :is="c.icon" :size="14" :stroke-width="1.5" class="shrink-0 text-primary" />
                <span class="truncate">{{ c.value }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="rounded-card border border-border bg-card p-6">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Mail :size="18" :stroke-width="1.75" />
          </span>
          <h3 class="mt-3 text-base font-bold text-text">{{ t('footer.letsWorkTogether') }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-text-secondary">{{ t('footer.ctaDesc') }}</p>
          <NuxtLink to="/contact" class="btn-primary mt-4 w-full !py-2.5">
            {{ t('footer.contactMe') }}
            <ArrowRight :size="15" :stroke-width="2" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div>
      <div class="container-site flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p class="text-sm text-text-muted">{{ t('common.rightsReserved', { year }) }}</p>
        <p class="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <Heart class="h-4 w-4 fill-red-500 text-red-500" aria-hidden="true" />
          {{ t('common.motto') }}
        </p>
        <a
          href="#top"
          class="group flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
        >
          {{ t('common.backToTop') }}
          <span class="flex items-center justify-center rounded-full border border-border p-2 transition-colors group-hover:border-primary/60">
            <ArrowUp :size="14" :stroke-width="2" />
          </span>
        </a>
      </div>
    </div>
  </footer>
</template>
