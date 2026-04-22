/**
 * Categorized skill inventory for the /resume Skill Grid.
 *
 * Five categories (per INTERACTIVE_RESUME_HANDOVER_FINAL.md §4):
 *   - GenAI & Agentic, Traditional ML & DL, Data Engineering,
 *     Cloud & Platforms, Viz & Frontend.
 *
 * "Leadership" is NOT a filter category — it's a story shape, surfaced
 * via transitionStory + teamContext fields in data/timeline.ts, not here.
 *
 * Each skill optionally carries:
 *   - firstShipped year (more honest than a proficiency bar)
 *   - anchorProject + anchorLink (click-through to the project/blog
 *     where the skill appears in context)
 *
 * Source: docs/career/RESUME_RAW.md §4.
 */

export type SkillCategory =
  | 'genai'
  | 'ml-dl'
  | 'data-eng'
  | 'cloud'
  | 'viz-frontend';

export interface SkillCategoryMeta {
  id: SkillCategory;
  label: string;
  description: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Year first shipped to production (where known). */
  firstShipped?: number;
  /** Anchor artifact — the project where this skill is best demonstrated. */
  anchorProject?: string;
  /** Optional link to the anchor project's case study or blog post. */
  anchorLink?: string;
}

export const SKILL_CATEGORIES: SkillCategoryMeta[] = [
  {
    id: 'genai',
    label: 'GenAI & Agentic',
    description: 'Agentic orchestration, multi-layer RAG, text-to-SQL, embeddings.',
  },
  {
    id: 'ml-dl',
    label: 'Traditional ML & DL',
    description: 'Regression, classification, clustering, optimization, deep learning.',
  },
  {
    id: 'data-eng',
    label: 'Data Engineering',
    description: 'Distributed processing, relational + vector stores, ETL pipelines.',
  },
  {
    id: 'cloud',
    label: 'Cloud & Platforms',
    description: 'GCP + Vertex AI, enterprise managed platforms.',
  },
  {
    id: 'viz-frontend',
    label: 'Viz & Frontend',
    description: 'BI dashboards, React LLM frontends, statistical visualization.',
  },
];

export const SKILLS: Skill[] = [
  // ─── GenAI & Agentic ───
  { name: 'LangGraph', category: 'genai', firstShipped: 2026, anchorProject: 'PAR Assist', anchorLink: '/projects/par-assist' },
  { name: 'MCP (Model Context Protocol)', category: 'genai', firstShipped: 2026, anchorProject: 'PAR Assist', anchorLink: '/projects/par-assist' },
  { name: 'Multi-layer RAG', category: 'genai', firstShipped: 2024, anchorProject: 'EDS Automation → PAR Assist', anchorLink: '/projects/par-assist' },
  { name: 'Text-to-SQL', category: 'genai', firstShipped: 2025, anchorProject: 'Aegis v2', anchorLink: '/projects/aegis' },
  { name: 'Embeddings / semantic search', category: 'genai', firstShipped: 2025, anchorProject: 'Aegis v2 KPI disambiguation', anchorLink: '/projects/aegis' },
  { name: 'Prompt engineering', category: 'genai', firstShipped: 2024, anchorProject: 'All RBC GenAI work' },
  { name: 'LLM evaluation', category: 'genai', firstShipped: 2025, anchorProject: 'Aegis v2 + Astraeus' },
  { name: 'Intent parsing / routing', category: 'genai', firstShipped: 2025, anchorProject: 'Astraeus (GPT for routing only)', anchorLink: '/projects/astraeus' },
  { name: 'BERT / early transformers', category: 'genai', firstShipped: 2021, anchorProject: 'IBM DataJam (side)' },

  // ─── Traditional ML & DL ───
  { name: 'TensorFlow', category: 'ml-dl', firstShipped: 2017, anchorProject: 'TCS — Combustion Tuning' },
  { name: 'PyTorch', category: 'ml-dl', firstShipped: 2018, anchorProject: 'TCS — LSTM on Ammonium Bisulphate deposition' },
  { name: 'scikit-learn', category: 'ml-dl', firstShipped: 2017, anchorProject: 'TCS' },
  { name: 'XGBoost', category: 'ml-dl', firstShipped: 2018, anchorProject: 'Transformer Life (85% MAPE)' },
  { name: 'Regression (multi-output)', category: 'ml-dl', firstShipped: 2017, anchorProject: 'Combustion — 84 models', anchorLink: '/projects/combustion-tuning' },
  { name: 'Classification', category: 'ml-dl', firstShipped: 2017, anchorProject: 'Coal classification (5 algorithms)' },
  { name: 'Clustering (kMeans)', category: 'ml-dl', firstShipped: 2018, anchorProject: 'Coal classification' },
  { name: 'PSO (Particle Swarm Optimization)', category: 'ml-dl', firstShipped: 2018, anchorProject: 'Combustion closed-loop', anchorLink: '/projects/combustion-tuning' },
  { name: 'LSTM / RNN', category: 'ml-dl', firstShipped: 2018, anchorProject: 'Ammonium Bisulphate deposition' },
  { name: 'CNN / Computer Vision', category: 'ml-dl', firstShipped: 2019, anchorProject: 'Math Notation Detection (2nd/600)' },
  { name: 'Feature engineering', category: 'ml-dl', firstShipped: 2017, anchorProject: '90+ sensors → Combustion models', anchorLink: '/projects/combustion-tuning' },

  // ─── Data Engineering ───
  { name: 'PostgreSQL (+ pgvector)', category: 'data-eng', firstShipped: 2026, anchorProject: 'PAR Assist storage', anchorLink: '/projects/par-assist' },
  { name: 'PySpark', category: 'data-eng', firstShipped: 2022, anchorProject: 'Commodity Tax automation', anchorLink: '/projects/commodity-tax' },
  { name: 'SQL', category: 'data-eng', firstShipped: 2018, anchorProject: 'Aegis v2 text-to-SQL (anchor)', anchorLink: '/projects/aegis' },
  { name: 'Hadoop / Spark', category: 'data-eng', firstShipped: 2022, anchorProject: 'Commodity Tax + Journal Entry automation (PySpark on Spark)', anchorLink: '/projects/commodity-tax' },
  { name: 'CDP (Cloudera Data Platform)', category: 'data-eng', firstShipped: 2023, anchorProject: 'Journal entry automation' },
  { name: 'ETL pipeline design', category: 'data-eng', firstShipped: 2017, anchorProject: 'TCS sensor pipelines', anchorLink: '/projects/combustion-tuning' },
  { name: 'Chunking & embedding pipelines', category: 'data-eng', firstShipped: 2026, anchorProject: 'PAR Assist document ingestion', anchorLink: '/projects/par-assist' },

  // ─── Cloud & Platforms ───
  { name: 'Google Cloud Platform', category: 'cloud', firstShipped: 2022, anchorProject: 'Humana Document Understanding', anchorLink: '/projects/document-intelligence' },
  { name: 'Vertex AI', category: 'cloud', firstShipped: 2022, anchorProject: 'Humana entity extraction', anchorLink: '/projects/document-intelligence' },
  { name: 'AutoML', category: 'cloud', firstShipped: 2022, anchorProject: 'Humana pipelines' },
  { name: 'Document AI', category: 'cloud', firstShipped: 2022, anchorProject: 'Humana OCR layer', anchorLink: '/projects/document-intelligence' },
  { name: 'BigQuery / BigTable', category: 'cloud', firstShipped: 2022, anchorProject: 'Humana data infrastructure', anchorLink: '/projects/document-intelligence' },
  { name: 'Dataiku', category: 'cloud', firstShipped: 2023, anchorProject: 'RBC managed Jupyter environment' },

  // ─── Viz & Frontend ───
  { name: 'Tableau', category: 'viz-frontend', firstShipped: 2022, anchorProject: 'Chick-fil-A → RBC CFO dashboards' },
  { name: 'React', category: 'viz-frontend', firstShipped: 2024, anchorProject: 'RBC LLM frontends' },
  { name: 'ggplot2', category: 'viz-frontend', firstShipped: 2017, anchorProject: 'TCS visualizations' },
  { name: 'matplotlib', category: 'viz-frontend', firstShipped: 2017 },
  { name: 'Shiny (R)', category: 'viz-frontend', firstShipped: 2020, anchorProject: 'Johns Hopkins capstone — n-gram language model' },
];
