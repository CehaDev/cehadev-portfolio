export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  tags: string[]
  tech: string[]
  category: string
  year: string
  role: string
  duration: string
  featured?: boolean
  liveUrl: string
  githubUrl: string
}

export const projects: Project[] = [
  {
    slug: 'magerans',
    title: 'Magerans',
    tagline: 'Platform kolaborasi project & manajemen kerja tim secara real-time.',
    description:
      'Platform kolaborasi yang membantu tim mengelola project, berkomunikasi real-time, dan menyelesaikan pekerjaan lebih efisien dalam satu tempat.',
    tags: ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'TypeScript'],
    tech: ['nuxt', 'vue', 'tailwind', 'typescript', 'node', 'mysql', 'git', 'linux'],
    category: 'Web App',
    year: '2025',
    role: 'Full-Stack Developer',
    duration: '4 Bulan',
    featured: true,
    liveUrl: 'https://magerans.example.com',
    githubUrl: 'https://github.com/cehadev/magerans'
  },
  {
    slug: 'cehava-store',
    title: 'Cehava Store',
    tagline: 'Toko online modern dengan manajemen produk dan checkout yang mulus.',
    description:
      'Aplikasi e-commerce dengan katalog produk, keranjang belanja, pembayaran, dan dashboard admin untuk mengelola toko.',
    tags: ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'Node.js'],
    tech: ['nuxt', 'vue', 'tailwind', 'node', 'mysql'],
    category: 'E-Commerce',
    year: '2025',
    role: 'Full-Stack Developer',
    duration: '3 Bulan',
    liveUrl: 'https://cehava-store.example.com',
    githubUrl: 'https://github.com/cehadev/cehava-store'
  },
  {
    slug: 'devboard',
    title: 'DevBoard',
    tagline: 'Dashboard analitik developer dengan visualisasi data real-time.',
    description:
      'Dashboard analitik untuk memantau performa aplikasi, metrik pengguna, dan log sistem dengan grafik interaktif.',
    tags: ['Vue.js', 'Node.js', 'Tailwind CSS'],
    tech: ['vue', 'node', 'tailwind', 'javascript'],
    category: 'Dashboard',
    year: '2024',
    role: 'Frontend Developer',
    duration: '2 Bulan',
    liveUrl: 'https://devboard.example.com',
    githubUrl: 'https://github.com/cehadev/devboard'
  },
  {
    slug: 'nutech-api',
    title: 'NuTech API',
    tagline: 'REST API cepat dan aman untuk aplikasi mobile & web.',
    description:
      'Backend REST API dengan autentikasi JWT, rate limiting, dokumentasi otomatis, dan struktur modular yang mudah dikembangkan.',
    tags: ['Node.js', 'TypeScript', 'MySQL'],
    tech: ['node', 'typescript', 'mysql', 'git'],
    category: 'Backend',
    year: '2024',
    role: 'Backend Developer',
    duration: '2 Bulan',
    liveUrl: 'https://nutech-api.example.com',
    githubUrl: 'https://github.com/cehadev/nutech-api'
  },
  {
    slug: 'portfoliokit',
    title: 'PortfolioKit',
    tagline: 'Starter kit portfolio developer dengan tema gelap modern.',
    description:
      'Template portfolio open-source yang bisa dikustomisasi penuh, dibangun dengan Nuxt dan Tailwind, siap deploy dalam hitungan menit.',
    tags: ['Nuxt.js', 'Tailwind CSS', 'TypeScript'],
    tech: ['nuxt', 'tailwind', 'typescript', 'git'],
    category: 'Open Source',
    year: '2025',
    role: 'Creator',
    duration: '1 Bulan',
    liveUrl: 'https://portfoliokit.example.com',
    githubUrl: 'https://github.com/cehadev/portfoliokit'
  },
  {
    slug: 'taskflow-mobile',
    title: 'TaskFlow Mobile',
    tagline: 'Aplikasi manajemen tugas harian yang ringan dan cepat.',
    description:
      'Aplikasi mobile-first untuk mengelola tugas harian dengan notifikasi, tag prioritas, dan sinkronisasi cloud.',
    tags: ['Vue.js', 'Node.js', 'Tailwind CSS'],
    tech: ['vue', 'node', 'tailwind', 'mysql'],
    category: 'Mobile App',
    year: '2024',
    role: 'Full-Stack Developer',
    duration: '3 Bulan',
    liveUrl: 'https://taskflow.example.com',
    githubUrl: 'https://github.com/cehadev/taskflow'
  }
]

export const mageransDetail = {
  overview: `Magerans adalah platform kolaborasi yang dirancang untuk membantu tim kecil dan menengah bekerja bersama secara lebih terorganisir. Aplikasi ini menggabungkan manajemen project, komunikasi real-time, dan pelacakan tugas dalam satu dashboard yang intuitif dan responsif.

Dibangun dengan Nuxt 3 di sisi frontend dan Node.js di sisi backend, Magerans menghadirkan pengalaman yang cepat berkat SSR dan optimasi performa. Desainnya mengutamakan kejelasan, aksesibilitas, dan konsistensi di semua perangkat.`,
  featureHighlights: [
    { icon: 'Search', color: '#38BDF8', title: 'Pencarian Cepat', desc: 'Temukan project dan tugas dengan pencarian instan.' },
    { icon: 'LayoutDashboard', color: '#8B5CF6', title: 'Dashboard Intuitif', desc: 'Semua informasi penting dalam satu tampilan.' },
    { icon: 'MessageSquare', color: '#22C55E', title: 'Kolaborasi Tim', desc: 'Diskusi dan komentar di setiap tugas.' },
    { icon: 'ShieldCheck', color: '#F59E0B', title: 'Keamanan Terjamin', desc: 'Autentikasi aman dan proteksi data lengkap.' }
  ],
  mainFeatures: [
    { icon: 'Search', color: '#38BDF8', title: 'Pencarian Layanan', desc: 'Cari layanan dan project dengan cepat menggunakan pencarian cerdas dengan filter kategori.' },
    { icon: 'FolderKanban', color: '#8B5CF6', title: 'Manajemen Project', desc: 'Kelola project dari perencanaan hingga selesai dengan kanban board yang fleksibel.' },
    { icon: 'MessageSquare', color: '#22C55E', title: 'Chat Real-time', desc: 'Komunikasi tim real-time dengan pesan, reaksi, dan mention antar anggota.' },
    { icon: 'Star', color: '#F59E0B', title: 'Sistem Review', desc: 'Berikan dan terima ulasan untuk menjaga kualitas hasil kerja.' },
    { icon: 'Bell', color: '#F43F5E', title: 'Notifikasi', desc: 'Notifikasi otomatis untuk setiap update tugas, pesan, dan aktivitas tim.' }
  ],
  techStack: ['nuxt', 'vue', 'tailwind', 'typescript', 'node', 'mysql', 'git', 'linux'],
  process: [
    { num: '01', icon: 'ClipboardList', title: 'Perencanaan', desc: 'Menentukan kebutuhan, scope, dan roadmap fitur.' },
    { num: '02', icon: 'PenTool', title: 'Desain UI/UX', desc: 'Membuat wireframe hingga hi-fi mockup di Figma.' },
    { num: '03', icon: 'Code2', title: 'Pengembangan', desc: 'Implementasi frontend & backend dengan best practice.' },
    { num: '04', icon: 'Bug', title: 'Pengujian', desc: 'Unit test, integration test, dan manual QA.' },
    { num: '05', icon: 'Rocket', title: 'Deployment', desc: 'Deploy ke produksi dengan CI/CD dan monitoring.' }
  ],
  results: [
    { icon: 'Users', value: '1.000+', label: 'Pengguna Terdaftar' },
    { icon: 'FolderCheck', value: '500+', label: 'Project Selesai' },
    { icon: 'Star', value: '4.8/5', label: 'Rating Rata-rata' },
    { icon: 'Activity', value: '99.9%', label: 'Uptime Aplikasi' }
  ]
}
