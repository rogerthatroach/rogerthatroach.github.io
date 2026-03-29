export interface TimelineNode {
  id: string;
  era: string;
  period: string;
  org: string;
  role: string;
  description: string;
  skills: string[];
  milestone?: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
}

export const TIMELINE: TimelineNode[] = [
  {
    id: 'rbc-lead',
    era: 'Agentic AI',
    period: '2025 – Present',
    org: 'Royal Bank of Canada',
    role: 'AI & Data Science Lead — CFO Group',
    description:
      'Architecting enterprise agentic AI systems. Conceived PAR Assist, shipped Astraeus, built Aegis v2 in two weeks, leading the Amplify intern program. 70% hands-on.',
    skills: ['LangGraph', 'MCP', 'RAG', 'Text-to-SQL', 'Embeddings', 'React', 'Multi-Agent Orchestration'],
    milestone: 'Bank-wide AI platform',
    accent: 'purple',
  },
  {
    id: 'rbc-senior',
    era: 'Enterprise Analytics',
    period: '2022 – 2025',
    org: 'Royal Bank of Canada',
    role: 'Senior Data Scientist — CFO Group',
    description:
      'Overhauled the Commodity Tax process (months → 90 min). Productionized Aegis v1. Built the data foundations for Astraeus. Earned trust with CFO stakeholders.',
    skills: ['PySpark', 'SQL', 'Tableau', 'Financial Modeling', 'Aegis v1'],
    milestone: 'Months → 90 min',
    accent: 'amber',
  },
  {
    id: 'quantiphi',
    era: 'Cloud ML',
    period: '2021 – 2022',
    org: 'Quantiphi Inc.',
    role: 'Machine Learning Engineer',
    description:
      'Deployed ML models on Google Cloud for insurance and financial clients. Document verification pipelines, Vertex AI, entity extraction at scale.',
    skills: ['GCP', 'Vertex AI', 'AutoML', 'Document AI', 'SQL', 'Tableau'],
    accent: 'cyan',
  },
  {
    id: 'tcs',
    era: 'Foundation',
    period: '2016 – 2019',
    org: 'Tata Consultancy Services',
    role: 'Data Scientist',
    description:
      'Built a Digital Twin for a 900MW coal power plant in Japan — $3M annual savings. Won 2nd/600 in a computer vision hackathon. Where the ML journey began.',
    skills: ['R', 'Python', 'ggplot2', 'Regression', 'Classification', 'Clustering', 'CNNs', 'TensorFlow'],
    milestone: '$3M/year savings',
    accent: 'emerald',
  },
];
