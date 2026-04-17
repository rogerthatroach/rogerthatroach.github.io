export interface Company {
  id: string;
  name: string;
  shortName: string;
  period: string;
  role: string;
  /** Brand accent color, used as text and subtle background tint */
  accent: string;
  /** Optional external profile link (company website or LinkedIn) */
  href?: string;
}

/**
 * Work history, newest first. Rendered in Hero as a horizontal strip.
 *
 * NOTE on logos: we render text treatments (shortName in brand color),
 * not raw SVG logos. Reasons: trademarks, maintenance, and the site's
 * wabi-sabi aesthetic. If actual logo SVGs become available, extend
 * Company with `logo?: string` and render conditionally.
 */
export const COMPANIES: Company[] = [
  {
    id: 'rbc',
    name: 'Royal Bank of Canada',
    shortName: 'RBC',
    period: '2022 – Present',
    role: 'AI & Data Science Lead (2025–), Sr. Data Scientist (2022–2025)',
    accent: '#0051A5',
    href: 'https://www.rbc.com/',
  },
  {
    id: 'quantiphi',
    name: 'Quantiphi Inc.',
    shortName: 'QUANTIPHI',
    period: '2021 – 2022',
    role: 'Machine Learning Engineer',
    accent: '#FF6A00',
    href: 'https://quantiphi.com/',
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    shortName: 'TCS',
    period: '2016 – 2019',
    role: 'Data Scientist',
    accent: '#E31837',
    href: 'https://www.tcs.com/',
  },
];
