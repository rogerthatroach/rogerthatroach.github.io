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
  tagline: 'Architecting agentic AI inside RBC’s CFO Group.',
  bio: `Built RBC’s first bank-wide production agentic AI in the last year, alongside a multi-stage LLM analytics platform shipped to production. ${YEARS_EXPERIENCE} years of progressive AI/ML, from 900MW power plants in Japan to bank-wide platforms in Toronto. Same closed-loop pattern. Four abstraction levels.`,
  location: 'Toronto, ON',
  links: {
    linkedin: 'https://www.linkedin.com/in/harmilapsingh',
    github: 'https://github.com/rogerthatroach',
    email: 'harmilapsingh@gmail.com',
  },
} as const;

export const HERO_SUMMARY = [
  `${AWARDS_COUNT} awards`,
  `${PRODUCTION_SYSTEMS_COUNT} production Gen AI systems`,
  `${YEARS_EXPERIENCE} years`,
] as const;

/**
 * Industries signal for business-audience readers pattern-matching on fit.
 * Rendered as a small line beneath the bio in Hero.
 */
export const INDUSTRIES = ['Banking', 'Insurance', 'Utilities', 'Retail'] as const;
