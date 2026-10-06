// ─────────────────────────────────────────────────────────────
//  Semua isi website ada di file ini.
//  Cari tanda "TODO" untuk bagian yang masih placeholder.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Hafidz Asmar Meisanda',
  firstName: 'Hafidz',
  role: 'Full-stack web developer',
  study: 'Informatics Management',
  campus: 'Politeknik Praktisi Bandung',
  degree: 'D3',
  semester: 5,
  graduation: 2027,
  city: 'Bandung, West Java',
  email: 'asmarhafidz81@gmail.com',
  cvUrl: '/Hafidz-Asmar-Meisanda-CV.pdf', // file ada di /public; ganti file itu kalau CV diperbarui
  photo: '/me.jpg', // file ada di /public/me.jpg
}

export const socials = [
  { label: 'GitHub', handle: '@Apiii30', url: 'https://github.com/Apiii30' },
  { label: 'LinkedIn', handle: 'hafidz-asmar-meisanda', url: 'https://www.linkedin.com/in/hafidz-asmar-meisanda-750a12295/' },
  { label: 'Instagram', handle: '@asmarhafidz_', url: 'https://www.instagram.com/asmarhafidz_/' },
]

// Bisa ditambah: screenshot (image: '/projects/nama.png') dan proyek baru.
// `highlight` muncul sebagai stiker di pojok kartu.
// `repo` hanya untuk repo PUBLIK — repo privat bikin pengunjung kena 404, jadi isi null.
export const projects = [
  {
    title: 'Webkeun',
    year: '2026',
    highlight: 'my own business',
    blurb:
      'My own small web studio, just getting started. I build sites for UMKM, company profiles and personal portfolios — domain, hosting and basic SEO included, done in 3–7 days. First clients: a coffee shop and a logistics company.',
    tags: ['Next.js', 'SEO', 'Freelance'],
    live: 'https://webkeun.id',
    repo: null,
  },
  {
    title: 'Wedding Invitation',
    year: '2026',
    blurb:
      'A digital wedding invitation for a real couple. Every guest gets a personal link to RSVP and leave a wish; the couple run the guest list, WhatsApp invites and RSVPs from an admin dashboard.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    live: 'https://the-wedding-of-frisca-arif.vercel.app',
    repo: 'https://github.com/Apiii30/wedding-invitation',
  },
  {
    title: 'PrakVote',
    year: '2025',
    highlight: 'used in a real election',
    blurb:
      "The voting app for our campus BEM chairperson election. Candidate pages, one vote per device, and a live results board — all on Firebase. The first version ran on Express + Vercel KV.",
    tags: ['JavaScript', 'Firebase', 'Vercel'],
    live: 'https://voting-web-xi.vercel.app',
    repo: 'https://github.com/Apiii30/voting-web',
  },
]

// ── Rak skill 3D ─────────────────────────────────────────────
// Buku, per rak dari atas ke bawah.
export const bookshelfRows = [
  ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind'],
  ['Bootstrap', 'Node.js', 'Express', 'Laravel'],
  ['PHP', 'PostgreSQL', 'MySQL'],
]
// Pajangan di sebelah buku rak ketiga. Python = ular, Java = cangkir kopi,
// selain itu jadi balok huruf (atur huruf & warnanya di Room.jsx → BLOCKS).
export const shelfLanguages = ['Python', 'Java', 'Kotlin', 'C++']
// Stiker di kotak perkakas di rak paling bawah (warna di Room.jsx → STICKER_COLORS).
export const toolbox = ['Git', 'GitHub', 'Postman', 'VS Code', 'Figma']

// Semua skill yang punya benda di rak — chip dengan label ini ikut menyala saat bendanya di-hover.
export const shelfSkills = [...bookshelfRows.flat(), ...shelfLanguages, ...toolbox]

export const skillGroups = [
  { label: 'Front of the house', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind', 'Bootstrap'] },
  { label: 'Back of the house', items: ['Node.js', 'Express', 'PHP', 'Laravel', 'REST APIs'] },
  { label: 'Where data sleeps', items: ['PostgreSQL', 'MySQL'] },
  { label: 'Also speak', items: shelfLanguages },
  { label: 'Toolbox', items: toolbox },
  { label: 'Off the clock', items: ['Graphic design', 'Photo editing', 'Video editing'] },
]

export const experience = [
  {
    role: 'Full-stack Developer Intern',
    org: 'Ocean Young Guards',
    type: 'Internship · NGO',
    period: 'Jan – Jul 2026',
    points: [
      "Built the organization's public profile site with React and Tailwind CSS.",
      'Made an admin dashboard so the team can manage site content and volunteer data on their own.',
      'Designed the volunteer registration system: a REST API in Express.js on PostgreSQL, from sign-up to applicant management.',
      'Connected frontend and backend over REST, tested every endpoint in Postman, and kept it all in Git.',
    ],
    // Muncul sebagai kartu di Experience dan sebagai bingkai di dinding kamar 3D.
    certificate: {
      title: 'Certificate of Appreciation',
      issuer: 'Ocean Young Guards',
      issued: 'Aug 2026',
      image: '/certificates/ocean-young-guards.jpg',
      thumb: '/certificates/ocean-young-guards-sm.jpg',
    },
  },
  {
    role: 'Head of Communication & Information',
    org: 'HIMAMI · Informatics Management Student Association',
    type: 'Organization',
    period: '2024 – now',
    points: [
      "Lead the division that runs the association's Instagram and announcements.",
      'Design the visuals for HIMAMI events and activities.',
      "Build and maintain the association's official website.",
    ],
  },
]

// Sertifikat kursus / kelas online (yang tidak terikat ke satu pengalaman kerja).
// Muncul sebagai kartu di section Skills dan sebagai bingkai di atas rak buku 3D.
// `skill` harus sama dengan label chip/benda di rak — hover kartunya bikin benda itu ikut bergerak.
export const courses = [
  {
    title: 'Memulai Pemrograman dengan Python',
    issuer: 'Dicoding Indonesia',
    issued: 'Oct 2026',
    hours: 60,
    skill: 'Python',
    covers: 'Data types, control flow, OOP, PEP 8, unit testing and popular libraries.',
    credentialId: '98XW82300PM3',
    verifyUrl: 'https://www.dicoding.com/certificates/98XW82300PM3',
    image: '/certificates/dicoding-python.jpg',
    thumb: '/certificates/dicoding-python-sm.jpg',
  },
]

// Karya desain / editing. Section "Design" (dan menunya di nav) baru muncul kalau array ini terisi.
// Contoh: { title: 'Poster HIMAMI', kind: 'Poster', image: '/works/poster-himami.jpg' }
export const works = []
