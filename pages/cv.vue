<script setup lang="ts">
import { ArrowLeft, Download, Printer, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Wrench, Languages, Award, Sparkles } from 'lucide-vue-next'

const { data: cv } = await useCvContent()

useSeoMeta({
  title: 'CV | CehaDev',
  description: 'Curriculum Vitae CehaDev — Web Developer & Tech Enthusiast.'
})

const route = useRoute()

onMounted(() => {
  if (route.query.download) {
    setTimeout(() => window.print(), 600)
  }
})

function printCv() {
  window.print()
}
</script>

<template>
  <div class="container-site py-10 md:py-14 print:p-0">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text">
        <ArrowLeft :size="16" :stroke-width="2" />
        Kembali ke Beranda
      </NuxtLink>
      <div class="flex items-center gap-3">
        <button type="button" class="btn-outline !px-4 !py-2.5" @click="printCv">
          <Printer :size="16" :stroke-width="2" />
          Cetak / Simpan PDF
        </button>
        <a href="/cv?download=1" class="btn-primary !px-4 !py-2.5" @click.prevent="printCv">
          <Download :size="16" :stroke-width="2" />
          Download PDF
        </a>
      </div>
    </div>

    <div
      v-if="cv"
      class="cv-sheet mx-auto grid max-w-[210mm] overflow-hidden rounded-card border border-border bg-card shadow-card md:grid-cols-[300px_1fr] print:max-w-none print:grid-cols-[260px_1fr] print:rounded-none print:border-0 print:bg-white print:shadow-none"
    >
      <!-- SIDEBAR -->
      <aside class="bg-gradient-brand text-white">
        <div class="flex flex-col items-center px-8 py-10 text-center">
          <img
            v-if="cv.photo"
            :src="cv.photo"
            :alt="`Foto ${cv.fullName}`"
            class="h-32 w-32 rounded-full border-4 border-white/80 object-cover shadow-lg print:h-28 print:w-28 print:border-2"
          />
          <div v-else class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/80 bg-white/10 text-5xl font-extrabold">
            {{ (cv.fullName || '?').charAt(0) }}
          </div>
          <h1 class="mt-5 text-2xl font-extrabold leading-tight tracking-tight print:text-xl">{{ cv.fullName }}</h1>
          <p class="mt-1 text-sm font-medium text-white/85 print:text-xs">{{ cv.title }}</p>
        </div>

        <div class="space-y-8 border-t border-white/15 px-8 pb-10 pt-8">
          <section v-if="cv.email || cv.phone || cv.location || cv.website || cv.linkedin || cv.github">
            <h2 class="cv-sidebar-title">Kontak</h2>
            <ul class="mt-3 space-y-2.5">
              <li v-if="cv.location" class="cv-contact-row"><MapPin :size="15" class="shrink-0" /> <span class="break-words">{{ cv.location }}</span></li>
              <li v-if="cv.email" class="cv-contact-row"><Mail :size="15" class="shrink-0" /> <span class="break-all">{{ cv.email }}</span></li>
              <li v-if="cv.phone" class="cv-contact-row"><Phone :size="15" class="shrink-0" /> <span class="break-words">{{ cv.phone }}</span></li>
              <li v-if="cv.website" class="cv-contact-row"><Globe :size="15" class="shrink-0" /> <span class="break-all">{{ cv.website }}</span></li>
              <li v-if="cv.linkedin" class="cv-contact-row"><Linkedin :size="15" class="shrink-0" /> <span class="break-all">{{ cv.linkedin.replace(/^https?:\/\/(www\.)?/, '') }}</span></li>
              <li v-if="cv.github" class="cv-contact-row"><Github :size="15" class="shrink-0" /> <span class="break-all">{{ cv.github.replace(/^https?:\/\/(www\.)?/, '') }}</span></li>
            </ul>
          </section>

          <section v-if="cv.skills?.length">
            <h2 class="cv-sidebar-title">Keahlian</h2>
            <ul class="mt-3 space-y-2">
              <li v-for="s in cv.skills" :key="s" class="flex items-start gap-2 text-sm leading-snug text-white/95 print:text-xs">
                <span class="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white print:mt-[6px]" aria-hidden="true" />
                {{ s }}
              </li>
            </ul>
          </section>

          <section v-if="cv.languages?.length">
            <h2 class="cv-sidebar-title">Bahasa</h2>
            <ul class="mt-3 space-y-2.5">
              <li v-for="(l, i) in cv.languages" :key="i" class="flex items-center justify-between gap-3 text-sm print:text-xs">
                <span class="font-medium text-white">{{ l.name }}</span>
                <span class="text-white/75">{{ l.level }}</span>
              </li>
            </ul>
          </section>

          <section v-if="cv.certifications?.length">
            <h2 class="cv-sidebar-title">Sertifikasi</h2>
            <ul class="mt-3 space-y-3.5">
              <li v-for="(c, i) in cv.certifications" :key="i">
                <p class="text-sm font-semibold leading-snug text-white print:text-xs">{{ c.name }}</p>
                <p class="mt-0.5 text-xs text-white/75 print:text-[10px]">{{ c.issuer }} • {{ c.year }}</p>
              </li>
            </ul>
          </section>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="space-y-9 bg-white p-10 print:p-8 md:p-12">
        <section v-if="cv.summary">
          <h2 class="cv-section-title"><span class="cv-section-icon"><Sparkles :size="14" :stroke-width="2" /></span> Profil</h2>
          <p class="mt-3 text-sm leading-relaxed text-gray-700 print:text-[11px] print:leading-relaxed">{{ cv.summary }}</p>
        </section>

        <section v-if="cv.experiences?.length">
          <h2 class="cv-section-title"><span class="cv-section-icon"><Briefcase :size="14" :stroke-width="2" /></span> Pengalaman Kerja</h2>
          <div class="mt-5 space-y-7">
            <div v-for="(e, i) in cv.experiences" :key="i" class="relative border-l-2 border-violet-200 pl-5">
              <span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-violet-600" aria-hidden="true" />
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-base font-bold text-gray-900 print:text-[12px]">{{ e.role }}</h3>
                <span class="text-xs font-medium text-gray-500 print:text-[10px]">{{ e.period }}</span>
              </div>
              <p class="mt-0.5 text-sm font-semibold text-violet-700 print:text-[11px]">{{ e.company }}</p>
              <p v-if="e.description" class="mt-1.5 text-sm leading-relaxed text-gray-600 print:text-[11px] print:leading-relaxed">{{ e.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="cv.education?.length">
          <h2 class="cv-section-title"><span class="cv-section-icon"><GraduationCap :size="14" :stroke-width="2" /></span> Pendidikan</h2>
          <div class="mt-5 space-y-6">
            <div v-for="(e, i) in cv.education" :key="i" class="relative border-l-2 border-violet-200 pl-5">
              <span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-violet-600" aria-hidden="true" />
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-base font-bold text-gray-900 print:text-[12px]">{{ e.degree }}</h3>
                <span v-if="e.period" class="text-xs font-medium text-gray-500 print:text-[10px]">{{ e.period }}</span>
              </div>
              <p class="mt-0.5 text-sm font-semibold text-violet-700 print:text-[11px]">{{ e.school }}</p>
              <p v-if="e.description" class="mt-1.5 text-sm leading-relaxed text-gray-600 print:text-[11px] print:leading-relaxed">{{ e.description }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>

    <p v-else class="py-20 text-center text-sm text-text-muted">CV sedang disiapkan.</p>
  </div>
</template>

<style scoped>
.cv-section-title {
  @apply flex items-center gap-2.5 text-sm font-bold uppercase tracking-wide text-gray-900;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.cv-section-icon {
  @apply flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 text-violet-700;
}

.cv-sidebar-title {
  @apply text-[11px] font-bold uppercase tracking-widest text-white/90;
}

.cv-contact-row {
  @apply flex items-start gap-2.5 text-sm leading-snug text-white/95 print:text-xs;
}

@page {
  margin: 8mm;
}

@media print {
  .cv-sheet {
    break-inside: auto;
  }
  .cv-sheet section {
    break-inside: avoid;
  }
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
