export interface Company {
  id: string;
  name: string;
  shortName: string;
  period: string;
  role: string;
  /** Brand accent color. Used as the default text color and starting point
   *  for both themes. */
  accent: string;
  /** Darker override used in light mode when `accent` fails WCAG AA on the
   *  warm-paper bg (e.g., Quantiphi's #FF6A00 too light). Falls back to accent. */
  accentLight?: string;
  /** Brighter override used in dark mode when `accent` fails WCAG AA on the
   *  near-black bg (e.g., RBC's #0051A5 too dark). Falls back to accent. */
  accentDark?: string;
  /** Optional external profile link (company website or LinkedIn) */
  href?: string;
  /** Optional logo path (relative to /public). When set, Hero renders the
   *  logo next to the shortName. */
  logo?: string;
}

/** Work history, newest first. Rendered in Hero as a horizontal strip. */
export const COMPANIES: Company[] = [
  {
    id: 'rbc',
    name: 'Royal Bank of Canada',
    shortName: 'RBC',
    period: '2022 – Present',
    role: 'AI & Data Science Lead (2025–), Sr. Data Scientist (2022–2025)',
    accent: '#0051A5',
    accentDark: '#60a5fa', // RBC blue too dark on near-black; use blue-400 for dark mode
    href: 'https://www.rbc.com/',
    logo: '/images/logos/rbc.svg',
  },
  {
    id: 'quantiphi',
    name: 'Quantiphi Inc.',
    shortName: 'QUANTIPHI',
    period: '2021 – 2022',
    role: 'Machine Learning Engineer',
    accent: '#FF6A00',
    accentLight: '#9a3412', // orange too light on warm-paper bg; use orange-800 for light mode
    href: 'https://quantiphi.com/',
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    shortName: 'TCS',
    period: '2016 – 2019',
    role: 'Data Scientist',
    accent: '#E31837',
    accentLight: '#991b1b', // push to red-800 to comfortably clear AA on light bg
    accentDark: '#f87171',  // and lighter for dark bg
    href: 'https://www.tcs.com/',
    logo: '/images/logos/tcs.svg',
  },
];
