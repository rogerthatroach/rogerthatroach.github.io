export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'Writings', href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'About', href: '/about' },
] as const;

export const DETAIL_RETURN_FALLBACKS = {
  blog: { prefix: '/blog/', href: '/blog', label: 'All writings' },
  projects: { prefix: '/projects/', href: '/projects', label: 'All projects' },
} as const;

export const RETURN_DESTINATION_LABELS = {
  home: 'home',
  resume: 'résumé',
  writings: 'writings',
  previousArticle: 'previous article',
  projects: 'projects',
  project: 'project',
  about: 'about',
  now: 'now',
  platform: 'platform',
  colophon: 'colophon',
  previousPage: 'previous page',
} as const;
