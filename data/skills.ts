/**
 * Selected capabilities for the /resume skill grid.
 *
 * This is an evidence map, not an exhaustive tool inventory. Each entry names
 * the public work that best demonstrates the capability; dates and proficiency
 * scores are deliberately omitted because neither establishes current depth.
 */

export type SkillCategory =
  | 'agent-workflows'
  | 'retrieval-query'
  | 'ml-optimization'
  | 'data-automation'
  | 'cloud-delivery'
  | 'interfaces-analysis';

export interface SkillCategoryMeta {
  id: SkillCategory;
  label: string;
  description: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  evidence: string;
  anchorLink?: string;
}

export const SKILL_TAXONOMY_SUMMARY =
  'Selected capabilities tied to public project evidence. Filters change the lens, not a proficiency score.';

export const SKILL_CATEGORIES: SkillCategoryMeta[] = [
  {
    id: 'agent-workflows',
    label: 'Agent workflows',
    description:
      'Stateful orchestration, bounded tool use, evaluation, and human review in production finance systems.',
  },
  {
    id: 'retrieval-query',
    label: 'Retrieval & query',
    description:
      'Scoped semantic retrieval, catalog ranking, and reviewed text-to-SQL paths.',
  },
  {
    id: 'ml-optimization',
    label: 'ML & optimization',
    description:
      'Regression, classification, computer vision, and bounded search from production and research work.',
  },
  {
    id: 'data-automation',
    label: 'Data & automation',
    description:
      'Python, SQL, distributed processing, and compiled compute behind repeatable data products.',
  },
  {
    id: 'cloud-delivery',
    label: 'Cloud & delivery',
    description:
      'Managed cloud services, API integration, access controls, and traceable operations.',
  },
  {
    id: 'interfaces-analysis',
    label: 'Interfaces & analysis',
    description:
      'Analyst-facing review surfaces, financial analytics, and production frontends.',
  },
];

export const SKILLS: Skill[] = [
  // Agent workflows
  {
    name: 'LangGraph',
    category: 'agent-workflows',
    evidence: 'AI/LLM drafting · one reviewed orchestration graph',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'MCP tool contracts',
    category: 'agent-workflows',
    evidence: 'AI/LLM drafting · bounded typed tool routines',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'Stateful workflow orchestration',
    category: 'agent-workflows',
    evidence: 'AI/LLM drafting · retained drafting and clarification path',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'Human-in-the-loop review',
    category: 'agent-workflows',
    evidence: 'AI/LLM drafting · author review, clarification, and stop paths',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'LLM evaluation',
    category: 'agent-workflows',
    evidence: 'Production finance AI · LLM-as-judge plus extensive human testing',
    anchorLink: '/platform',
  },

  // Retrieval and query systems
  {
    name: 'Dense semantic retrieval',
    category: 'retrieval-query',
    evidence: 'AI/LLM drafting · retrieval scoped by field group',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'Embeddings and similarity ranking',
    category: 'retrieval-query',
    evidence: 'Financial peer benchmarking · bounded KPI candidate retrieval',
    anchorLink: '/projects/financial-peer-benchmarking',
  },
  {
    name: 'Text-to-SQL',
    category: 'retrieval-query',
    evidence: 'Financial peer benchmarking · five-stage accept-or-clarify path',
    anchorLink: '/projects/financial-peer-benchmarking',
  },
  {
    name: 'Intent parsing and routing',
    category: 'retrieval-query',
    evidence: 'Peer benchmarking and workforce analytics · typed supported scopes',
    anchorLink: '/projects/workforce-analytics',
  },
  {
    name: 'Parameterized query construction',
    category: 'retrieval-query',
    evidence: 'Financial peer benchmarking · reviewed patterns with bound values',
    anchorLink: '/projects/financial-peer-benchmarking',
  },

  // Machine learning and optimization
  {
    name: 'Regression modeling',
    category: 'ml-optimization',
    evidence: 'Combustion Tuning · 84 independent models',
    anchorLink: '/projects/combustion-tuning',
  },
  {
    name: 'Particle Swarm Optimization',
    category: 'ml-optimization',
    evidence: 'Combustion Tuning · bounded candidates for operator review',
    anchorLink: '/projects/combustion-tuning',
  },
  {
    name: 'Random Forest classification',
    category: 'ml-optimization',
    evidence: 'Document Intelligence · checked-versus-unchecked classification',
    anchorLink: '/projects/document-intelligence',
  },
  {
    name: 'OpenCV',
    category: 'ml-optimization',
    evidence: 'Document Intelligence · pixel-level checkbox localization',
    anchorLink: '/projects/document-intelligence',
  },
  {
    name: 'Model selection and cross-validation',
    category: 'ml-optimization',
    evidence: 'Combustion Tuning · fold-level model comparison and error analysis',
    anchorLink: '/projects/combustion-tuning',
  },
  // Data and automation
  {
    name: 'Python',
    category: 'data-automation',
    evidence: 'Industrial ML, finance automation, and production AI systems',
    anchorLink: '/projects',
  },
  {
    name: 'SQL',
    category: 'data-automation',
    evidence: 'Commodity Tax, peer benchmarking, and workforce analytics data paths',
    anchorLink: '/projects/financial-peer-benchmarking',
  },
  {
    name: 'PySpark',
    category: 'data-automation',
    evidence: 'Commodity Tax · deterministic General Ledger pipeline',
    anchorLink: '/projects/commodity-tax',
  },
  {
    name: 'ETL and data pipelines',
    category: 'data-automation',
    evidence: 'Combustion, document, and finance automation work',
    anchorLink: '/projects',
  },
  {
    name: 'Cython',
    category: 'data-automation',
    evidence: 'Workforce analytics · deterministic event-level calculations',
    anchorLink: '/projects/workforce-analytics',
  },
  // Cloud and delivery
  {
    name: 'Google Cloud',
    category: 'cloud-delivery',
    evidence: 'Document Intelligence · client-delivery environment',
    anchorLink: '/projects/document-intelligence',
  },
  {
    name: 'Vertex AI',
    category: 'cloud-delivery',
    evidence: 'Document classification and entity-extraction work',
    anchorLink: '/projects/document-intelligence',
  },
  {
    name: 'Document AI',
    category: 'cloud-delivery',
    evidence: 'Humana · OCR and document structure',
    anchorLink: '/projects/document-intelligence',
  },
  {
    name: 'Foundation-model API integration',
    category: 'cloud-delivery',
    evidence: 'Production finance AI · approved model endpoints',
    anchorLink: '/platform',
  },
  {
    name: 'Entitlement-aware data access',
    category: 'cloud-delivery',
    evidence: 'Workforce analytics · authorized record scope resolved before calculation',
    anchorLink: '/projects/workforce-analytics',
  },
  {
    name: 'Tracing and structured logging',
    category: 'cloud-delivery',
    evidence: 'Production finance AI · bespoke operational evidence',
    anchorLink: '/platform',
  },
  {
    name: 'API service design',
    category: 'cloud-delivery',
    evidence: 'AI/LLM workforce analytics and drafting · production application services',
    anchorLink: '/platform',
  },

  // Interfaces and analysis
  {
    name: 'Tableau',
    category: 'interfaces-analysis',
    evidence: 'Commodity Tax and enterprise finance automation',
    anchorLink: '/projects/commodity-tax',
  },
  {
    name: 'React',
    category: 'interfaces-analysis',
    evidence: 'AI/LLM drafting frontend integration and this portfolio',
    anchorLink: '/projects/funding-request-drafting',
  },
  {
    name: 'Financial analytics',
    category: 'interfaces-analysis',
    evidence: 'Commodity Tax, financial peer benchmarking, and workforce analytics',
    anchorLink: '/projects',
  },
  {
    name: 'Analyst inspection workflows',
    category: 'interfaces-analysis',
    evidence: 'Commodity Tax · analyst investigation beside calculation',
    anchorLink: '/projects/commodity-tax',
  },
];
