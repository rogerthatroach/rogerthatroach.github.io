import {
  DIGITAL_TWIN_SAVINGS,
  COMMODITY_TAX_EFFICIENCY_COMPACT,
  PAR_ASSIST_SCALE,
  AWARDS_COUNT,
  PRODUCTION_SYSTEMS_COUNT,
  YEARS_EXPERIENCE,
} from './canonical';

export interface NumberFrame {
  value: string;
  context: string;
}

export const NUMBER_SEQUENCE: NumberFrame[] = [
  { value: DIGITAL_TWIN_SAVINGS, context: 'annual savings · 900MW plant' },
  { value: COMMODITY_TAX_EFFICIENCY_COMPACT, context: 'was: months' },
  { value: PAR_ASSIST_SCALE, context: 'agentic AI platform' },
] as const;

export const HERO = {
  name: 'Harmilap Singh Dhaliwal',
  title: 'AI & Data Science Lead — RBC',
  tagline: 'Architecting agentic AI for RBC CFO Group — the bank’s largest function.',
  bio: 'Eight years from 900MW power plants in Japan to bank-wide AI platforms in Toronto. Same closed loop. Four abstraction levels.',
  location: 'Toronto, Canada',
  links: {
    linkedin: 'https://www.linkedin.com/in/harmilapsingh',
    github: 'https://github.com/rogerthatroach',
    email: 'harmilapsingh@gmail.com',
  },
} as const;

export const HERO_SUMMARY = [
  `${AWARDS_COUNT} awards`,
  `${PRODUCTION_SYSTEMS_COUNT} production systems`,
  `${YEARS_EXPERIENCE} years`,
] as const;

/**
 * Industries signal for business-audience readers pattern-matching on fit.
 * Rendered as a small line beneath the bio in Hero.
 */
export const INDUSTRIES = ['Banking', 'Insurance', 'Utilities', 'Retail'] as const;
