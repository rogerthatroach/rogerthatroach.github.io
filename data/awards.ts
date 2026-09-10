export interface Award {
  title: string;
  org: string;
  year: string;
  detail?: string;
  /** Optional public image path; the card uses an icon when absent. */
  imagePath?: string;
}

export const AWARDS: Award[] = [
  {
    title: 'CFO One RBC Team Award',
    org: 'RBC',
    year: '2025',
    detail: 'Team recognition for AI/ML delivery, including the first version of the financial peer benchmarking product.',
  },
  {
    title: 'CFO Group RBC Quarterly Team Award',
    org: 'RBC',
    year: 'Q4 2023',
    detail: 'Team recognition for the Commodity Tax return automation.',
  },
  {
    title: 'Innovation Pride Award',
    org: 'TCS',
    year: 'Sep 2019',
    detail: 'Second place among 600 participants in a computer vision hackathon.',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: 'Jan 2019',
    detail: 'Deployment of the Digital Twin application.',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: 'Nov 2017',
    detail: 'Machine-learning research for the Digital Twin.',
  },
];
