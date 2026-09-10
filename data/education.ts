/** Active education and credential entries displayed on the résumé. */

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
    detail: 'Barrie, Ontario.',
  },
  {
    degree: 'B.Eng, Electronics & Communications Engineering',
    institution: 'Thapar University',
    years: '2012 – 2016',
    detail: 'Patiala, India.',
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
