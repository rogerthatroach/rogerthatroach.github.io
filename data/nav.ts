export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'Writing', href: '/blog' },
  { label: 'Work', href: '/#work' },
  { label: 'Journey', href: '/#journey' },
  { label: 'About', href: '/#about' },
] as const;
