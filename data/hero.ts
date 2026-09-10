import {
  AWARDS_COUNT,
  PRODUCTION_SYSTEMS_COUNT,
  YEARS_EXPERIENCE,
} from './canonical';

export const HERO = {
  name: 'Harmilap Singh Dhaliwal',
  title: 'AI & Data Science Lead — RBC',
  tagline: 'Hands-on production AI leadership, from industrial ML to regulated finance.',
  bio: `Across ${YEARS_EXPERIENCE} years, I have built production ML and AI systems in power generation, cloud document intelligence, and regulated finance. At RBC, I conceived, architected, and built the AI/LLM Drafting Platform end to end for project funding requests. It was the first true agentic AI platform approved for production at the bank and launched across the full CFO Group in all geographies. My work stays hands-on across architecture, implementation, evaluation, and production follow-through.`,
  location: 'Toronto, ON',
  actions: {
    projects: 'Read case studies',
    resume: 'View résumé',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/harmilapsingh',
    github: 'https://github.com/rogerthatroach',
    email: 'harmilapsingh@gmail.com',
  },
} as const;

export const HERO_SUMMARY = [
  `${AWARDS_COUNT} awards`,
  `${PRODUCTION_SYSTEMS_COUNT} production AI systems`,
  `${YEARS_EXPERIENCE} years`,
] as const;
