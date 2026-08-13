import { defineCollection, z } from '@nuxt/content'

const techItem = z.object({
  name: z.string(),
  level: z.number(),
  tech: z.string(),
  category: z.string().optional()
})

const statSchema = z.object({
  icon: z.string(),
  label: z.string(),
  sub: z.string(),
  end: z.number(),
  suffix: z.string().optional()
})

const featureCard = z.object({
  icon: z.string(),
  color: z.string(),
  title: z.string(),
  desc: z.string()
})

const processStep = z.object({
  num: z.string(),
  icon: z.string(),
  title: z.string(),
  desc: z.string()
})

const resultItem = z.object({
  icon: z.string(),
  value: z.string(),
  label: z.string()
})

const galleryItem = z.object({
  label: z.string(),
  seed: z.number()
})

const challengeItem = z.object({
  title: z.string(),
  desc: z.string()
})

const faqItem = z.object({
  q: z.string(),
  a: z.string()
})

const cvExperience = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  description: z.string()
})

const cvEducation = z.object({
  degree: z.string(),
  school: z.string(),
  period: z.string(),
  description: z.string().optional()
})

const cvLanguage = z.object({
  name: z.string(),
  level: z.string()
})

const cvCertification = z.object({
  name: z.string(),
  issuer: z.string(),
  year: z.string()
})

export const collections = {
  cv: defineCollection({
    type: 'data',
    source: 'cv.json',
    schema: z.object({
      fullName: z.string(),
      title: z.string(),
      photo: z.string().optional(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
      website: z.string(),
      linkedin: z.string(),
      github: z.string(),
      summary: z.string(),
      experiences: z.array(cvExperience),
      education: z.array(cvEducation),
      skills: z.array(z.string()),
      languages: z.array(cvLanguage),
      certifications: z.array(cvCertification)
    })
  }),

  site: defineCollection({
    type: 'data',
    source: 'site.json',
    schema: z.object({
      name: z.string(),
      role: z.string(),
      heroBadge: z.string(),
      heroTitle1: z.string(),
      heroTitleGradient: z.string(),
      heroSubtitle: z.string(),
      heroDescription: z.string(),
      aboutIntro: z.array(z.string()),
      aboutChecklist: z.array(z.string()),
      quote: z.string(),
      quoteHighlight: z.string(),
      stats: z.array(statSchema),
      email: z.string(),
      location: z.string(),
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
          label: z.string(),
          value: z.string()
        }))
        .optional()
    })
  }),

  skills: defineCollection({
    type: 'data',
    source: 'skills.json',
    schema: z.object({
      homeSkills: z.array(techItem),
      technicalSkills: z.array(techItem),
      marqueeTech: z.array(z.string()),
      skillsSummary: z.array(z.object({ label: z.string(), value: z.string(), icon: z.string() })),
      toolsList: z.array(z.string()),
      softSkills: z.array(z.string())
    })
  }),

  projects: defineCollection({
    type: 'data',
    source: 'projects/*.json',
    schema: z.object({
      slug: z.string(),
      title: z.string(),
      tagline: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      tech: z.array(z.string()),
      category: z.string(),
      year: z.string(),
      role: z.string(),
      duration: z.string(),
      featured: z.boolean().optional(),
      archived: z.boolean().optional(),
      liveUrl: z.string(),
      githubUrl: z.string(),
      detail: z
        .object({
          overview: z.string(),
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
