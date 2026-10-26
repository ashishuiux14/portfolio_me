// Single source for every list on the site, so cards, routes and nav never disagree.

export const CONTACT = {
  email: 'design.ashishd@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ashishd-uiux',
  linkedinHandle: 'ashishd-uiux',
  resume: '/Ashish_UX_UI_Resume.pdf',
  location: 'Chicago, IL · open to remote',
  classic: 'https://classic-portfolio-me.adixit4.workers.dev',
};

// Case studies keep their existing HTML pages (public/*.html) for now.
export const CASE_STUDIES = [
  {
    slug: 'atelier', name: 'Atelier', tag: 'Flagship · B2B SaaS', year: '2026',
    sub: 'A second brain for the solo principal architect: projects, WhatsApp groups and client meetings in one place.',
    src: '/atelier-case-study.html', cover: '/atelier-cover.svg',
  },
  {
    slug: '3d-hub', name: '3D Hub', tag: 'Mobile app', year: '2024',
    sub: 'A social platform for 3D printing enthusiasts, built in soft neumorphism.',
    src: '/3d-hub-case-study.html', cover: '/hub-hero.png',
  },
  {
    slug: 'travelogue', name: 'Travelogue', tag: 'Mobile app', year: '2025',
    sub: 'A social travel app for collaborative planning, storytelling and itinerary access.',
    src: '/travelogue-case-study.html', cover: '/travelogue-hero.png',
  },
  {
    slug: 'cleanero', name: 'Cleaneró', tag: 'Mobile + web', year: '2023',
    sub: 'An end-to-end cleaning service platform: research, user flows, visual design and handoff.',
    src: '/cleanero-case-study.html', cover: '/cleanero-hero-final.png',
  },
];

export const PRINTS = [
  {
    slug: 'iphone-dock', name: 'Charging dock', tag: '3D printing · industrial design', year: '2024',
    sub: 'A 3-in-1 dock for iPhone, AirPods and Apple Watch, taken from sketch to a finished product.',
    src: '/iphone-dock-case-study.html', cover: '/iphone-dock-hero.png',
  },
];

export const LAB = [
  {
    slug: 'soft-ui', n: '01', name: 'Soft UI language',
    sub: 'Neumorphism, skeuomorphism and glass: one light source, three materials, and depth that always means something.',
  },
  {
    slug: 'controls', n: '02', name: 'Controls',
    sub: 'Toggle, submit button, stepper, rotary switch and date picker, each built in clay and in aluminium.',
  },
  {
    slug: 'seat-picker', n: '03', name: 'Seat picker',
    sub: 'Draw what you can book boldest: a line-weight rule from architecture, applied to a seat map.',
  },
  {
    slug: 'crosshair', n: '04', name: 'Crosshair',
    sub: 'AutoCAD’s tunable crosshair, pickbox and snap markers against Figma’s arrow, on the same canvas.',
  },
];

export const ALL_DETAIL_PAGES = [...CASE_STUDIES, ...PRINTS];
