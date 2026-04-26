export interface Award {
  title: string;
  org: string;
  year: string;
  detail?: string;
  /**
   * Optional path to an award image (certificate photo, trophy photo,
   * announcement image) relative to /public. Rendered as a small
   * thumbnail on the award card. When unset, the card renders a Trophy
   * icon placeholder. Drop files at public/images/awards/{slug}.jpg or
   * .webp. Roughly square, 400-600px on the long side, <80KB.
   */
  imagePath?: string;
}

export const AWARDS: Award[] = [
  {
    title: 'CFO One RBC Team Award',
    org: 'RBC',
    year: '2025',
    detail: 'LLM/AI initiatives, esp. Aegis v1 productionization',
  },
  {
    title: 'CFO Group RBC Quarterly Team Award',
    org: 'RBC',
    year: 'Q4 2023',
    detail: 'Automating Commodity Tax Return process',
  },
  {
    title: 'Innovation Pride Award',
    org: 'TCS',
    year: 'Sep 2019',
    detail: '2nd out of 600 — Computer Vision Hackathon',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: 'Jan 2019',
    detail: 'Successful deployment of Digital Twin application',
  },
  {
    title: 'Star of the Month',
    org: 'TCS',
    year: 'Nov 2017',
    detail: 'Groundbreaking ML research for Digital Twin',
  },
];
