/**
 * Education + credentials. Source: docs/career/CAREER_KNOWLEDGE_BASE.md
 * and docs/career/RESUME_RAW.md.
 *
 * Active credentials only — GCP Associate Cloud Engineer expired
 * Jan 2024 and is intentionally omitted per the 2026-04-21 audit.
 */

export interface Education {
  degree: string;
  institution: string;
  years: string;
  detail?: string;
}

export interface Credential {
  title: string;
  issuer: string;
  year: string;
  note?: string;
}

export const EDUCATION: Education[] = [
  {
    degree: 'Post-Graduate Certificate, Big Data Analytics',
    institution: 'Georgian College',
    years: '2021',
    detail: 'Barrie, Ontario. Bridge from India ML career to Canadian cloud + banking stack.',
  },
  {
    degree: 'B.Eng, Electronics & Communications Engineering',
    institution: 'Thapar University',
    years: '2012 – 2016',
    detail: 'Patiala, India. Electrical engineering foundations — signal processing, control systems, embedded.',
  },
];

export const CREDENTIALS: Credential[] = [
  {
    title: 'Data Science Specialization (9-course sequence)',
    issuer: 'Johns Hopkins (Coursera)',
    year: '2020',
    note: 'Capstone: n-gram language model deployed as an R/Shiny app.',
  },
];
