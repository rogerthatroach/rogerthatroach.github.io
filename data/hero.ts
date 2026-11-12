import {
  AWARDS_COUNT,
  DRAFTING_PLATFORM_NAME,
  PRODUCTION_SYSTEMS_COUNT,
  YEARS_EXPERIENCE,
} from './canonical';

export const HERO = {
  name: 'Harmilap Singh Dhaliwal',
  title: 'AI & Data Science Lead — RBC',
  tagline: 'Hands-on production AI leadership, from industrial ML to regulated finance.',
  bio: `I have built production ML and AI systems in power generation, cloud document intelligence, and regulated finance. At RBC, I conceived, architected, and built the ${DRAFTING_PLATFORM_NAME} for project funding requests. It was the first true agentic AI platform approved for production at the bank and launched organization-wide in May 2026.`,
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

export const HOME_PROJECTS_DESCRIPTION =
  `Six systems across ${YEARS_EXPERIENCE} years. From power plant combustion tuning to agentic AI launched organization-wide at RBC.`;

export const HERO_SUMMARY = [
  `${AWARDS_COUNT} awards`,
  `${PRODUCTION_SYSTEMS_COUNT} production AI systems`,
  `${YEARS_EXPERIENCE} years`,
] as const;
