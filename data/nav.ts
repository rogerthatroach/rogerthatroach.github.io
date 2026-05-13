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
