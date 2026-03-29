export interface Award {
  title: string;
  org: string;
  year: string;
  detail?: string;
}

export const AWARDS: Award[] = [
  {
    title: 'CFO One RBC Team Award',
    org: 'RBC',
    year: '2025',
  },
  {
    title: 'CFO Quarterly Team Award',
    org: 'RBC',
    year: 'Q4 2023',
    detail: 'Automating Commodity Tax Return process',
  },
  {
    title: 'Innovation Pride Award',
    org: 'TCS',
    year: '2019',
    detail: '2nd out of 600 — Computer Vision Hackathon',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: '2019',
    detail: 'Successful deployment of Digital Twin application',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: '2017',
    detail: 'Groundbreaking ML research for Digital Twin',
  },
];
