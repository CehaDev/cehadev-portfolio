import { defineCollection, z } from '@nuxt/content'

const L = z.union([z.string(), z.object({ id: z.string(), en: z.string().optional() })])
const LArr = z.array(L)

const techItem = z.object({
  name: L,
  level: z.number(),
  tech: z.string(),
  category: L.optional()
})

const statSchema = z.object({
  icon: z.string(),
  label: L,
  sub: L,
  end: z.number(),
  suffix: L.optional()
})

const featureCard = z.object({
  icon: z.string(),
  color: z.string(),
  title: L,
  desc: L
})

const processStep = z.object({
  num: z.string(),
  icon: z.string(),
  title: L,
  desc: L
})

const resultItem = z.object({
  icon: z.string(),
  value: L,
  label: L
})

const galleryItem = z.object({
  label: L,
  seed: z.number()
})

const challengeItem = z.object({
  title: L,
  desc: L
})

const faqItem = z.object({
  q: L,
  a: L
})

const cvExperience = z.object({
  role: L,
  company: L,
  period: L,
  description: L
})

const cvEducation = z.object({
  degree: L,
  school: L,
  period: L,
  description: L.optional()
})

const cvLanguage = z.object({
  name: L,
  level: L
})

const cvCertification = z.object({
  name: L,
  issuer: L,
  year: L
})

export const collections = {
  cv: defineCollection({
    type: 'data',
    source: 'cv.json',
    schema: z.object({
      fullName: z.string(),
      title: L,
      photo: z.string().optional(),
      email: z.string(),
      phone: z.string(),
      location: L,
      website: z.string(),
      linkedin: z.string(),
      github: z.string(),
      summary: L,
      experiences: z.array(cvExperience),
      education: z.array(cvEducation),
      skills: LArr,
      languages: z.array(cvLanguage),
      certifications: z.array(cvCertification)
    })
  }),

  site: defineCollection({
    type: 'data',
    source: 'site.json',
    schema: z.object({
      name: z.string(),
      role: L,
      heroBadge: L,
      heroTitle1: L,
      heroTitleGradient: L,
      heroSubtitle: L,
      heroDescription: L,
      aboutIntro: LArr,
      aboutChecklist: LArr,
      quote: L,
      quoteHighlight: L,
      stats: z.array(statSchema),
      email: z.string(),
      location: L,
      website: z.string(),
      phone: z.string(),
      socials: z.object({
        github: z.string(),
        linkedin: z.string(),
        instagram: z.string()
      }),
      cvUrl: z.string(),
      faqs: z.array(faqItem),
      projectStats: z
        .array(z.object({
          icon: z.string(),
          label: L,
          value: L
        }))
        .optional(),
      seo: z.record(z.string(), z.any()).optional(),
      headings: z.record(z.string(), z.any()).optional()
    })
  }),

  skills: defineCollection({
    type: 'data',
    source: 'skills.json',
    schema: z.object({
      homeSkills: z.array(techItem),
      technicalSkills: z.array(techItem),
      marqueeTech: LArr,
      skillsSummary: z.array(z.object({ label: L, value: L, icon: z.string() })),
      toolsList: LArr,
      softSkills: LArr
    })
  }),

  projects: defineCollection({
    type: 'data',
    source: 'projects/*.json',
    schema: z.object({
      slug: z.string(),
      title: L,
      tagline: L,
      description: L,
      tags: LArr,
      tech: z.array(z.string()),
      category: L,
      year: z.string(),
      role: L,
      duration: L,
      featured: z.boolean().optional(),
      archived: z.boolean().optional(),
      liveUrl: z.string(),
      githubUrl: z.string(),
      demo: z
        .object({
          enabled: z.boolean().optional(),
          type: z.string().optional(),
          title: L.optional(),
          note: L.optional()
        })
        .optional(),
      detail: z
        .object({
          overview: L,
          featureHighlights: z.array(featureCard).optional(),
          mainFeatures: z.array(featureCard).optional(),
          techStack: z.array(z.string()).optional(),
          process: z.array(processStep).optional(),
          challenges: z.array(challengeItem).optional(),
          results: z.array(resultItem).optional(),
          gallery: z.array(galleryItem).optional()
        })
        .optional()
    })
  })
}
