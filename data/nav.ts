export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Work', href: '/#work' },
  { label: 'Journey', href: '/#journey' },
  { label: 'About', href: '/#about' },
  { label: 'Writing', href: '/blog' },
] as const;
