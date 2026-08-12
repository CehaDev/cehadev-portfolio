export interface TechItem {
  name: string
  color: string
  glyph: string
  icon?: string
}

export const techIcons: Record<string, TechItem> = {
  javascript: { name: 'JavaScript', color: '#F7DF1E', glyph: 'JS' },
  typescript: { name: 'TypeScript', color: '#3178C6', glyph: 'TS' },
  vue: { name: 'Vue.js', color: '#4FC08D', glyph: 'Vue' },
  nuxt: { name: 'Nuxt.js', color: '#00DC82', glyph: 'Nuxt' },
  tailwind: { name: 'Tailwind CSS', color: '#38BDF8', glyph: 'Tail' },
  node: { name: 'Node.js', color: '#5FA04E', glyph: 'Node' },
  html5: { name: 'HTML5', color: '#E34F26', glyph: 'HTML5' },
  css3: { name: 'CSS3', color: '#1572B6', glyph: 'CSS3' },
  php: { name: 'PHP', color: '#777BB4', glyph: 'PHP' },
  mysql: { name: 'MySQL', color: '#4479A1', glyph: 'MySQL' },
  git: { name: 'Git & GitHub', color: '#FFFFFF', glyph: 'Git' },
  linux: { name: 'Linux', color: '#FCC624', glyph: 'Linux' }
}

export const homeSkills = [
  { name: 'JavaScript', level: 90, tech: 'javascript' },
  { name: 'Vue.js', level: 85, tech: 'vue' },
  { name: 'Nuxt.js', level: 85, tech: 'nuxt' },
  { name: 'Tailwind CSS', level: 90, tech: 'tailwind' },
  { name: 'Node.js', level: 80, tech: 'node' },
  { name: 'Linux', level: 75, tech: 'linux' },
  { name: 'Git & GitHub', level: 85, tech: 'git' }
]

export const technicalSkills = [
  { name: 'JavaScript', level: 90, tech: 'javascript' },
  { name: 'CSS3', level: 90, tech: 'css3' },
  { name: 'Vue.js', level: 85, tech: 'vue' },
  { name: 'Node.js', level: 80, tech: 'node' },
  { name: 'Nuxt.js', level: 85, tech: 'nuxt' },
  { name: 'PHP', level: 70, tech: 'php' },
  { name: 'Tailwind CSS', level: 90, tech: 'tailwind' },
  { name: 'MySQL', level: 75, tech: 'mysql' },
  { name: 'HTML5', level: 95, tech: 'html5' },
  { name: 'Git & GitHub', level: 85, tech: 'git' }
]

export const skillCategories = [
  { id: 'all', label: 'All Skills' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'tools', label: 'Tools & Others' }
]

export const skillsSummary = [
  { label: 'Technologies', value: '10+', icon: 'Code2' },
  { label: 'Years Experience', value: '2+', icon: 'Clock' },
  { label: 'Projects Completed', value: '15+', icon: 'FolderGit2' },
  { label: 'Continuous Learning', value: '∞', icon: 'GraduationCap' }
]

export const toolsList = ['VS Code', 'Figma', 'Postman', 'Docker', 'Git', 'GitHub', 'NPM', 'ESLint', 'Prettier', 'Vite', 'Netlify', 'Chrome DevTools']

export const softSkills = ['Problem Solving', 'Communication', 'Teamwork', 'Time Management', 'Adaptability', 'Detail Oriented']
