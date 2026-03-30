export interface NumberFrame {
  value: string;
  context: string;
}

export const NUMBER_SEQUENCE: NumberFrame[] = [
  { value: '$3M', context: 'annual savings · 900MW plant' },
  { value: '90 min', context: 'was: months' },
  { value: 'Bank-wide', context: 'agentic AI platform' },
] as const;

export const HERO = {
  name: 'Harmilap Singh Dhaliwal',
  title: 'AI & Data Science Lead — RBC',
  tagline: 'I architect AI platforms. I lead teams that ship them.',
  location: 'Toronto, Canada',
  links: {
    linkedin: 'https://www.linkedin.com/in/harmilapsingh',
    github: 'https://github.com/rogerthatroach',
    email: 'harmilapsingh@gmail.com',
  },
} as const;

export const HERO_SUMMARY = [
  '5 awards',
  '4 production systems',
  '8+ years',
] as const;

