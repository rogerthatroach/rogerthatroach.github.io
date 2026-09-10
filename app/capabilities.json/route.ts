import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import {
  PRODUCTION_SYSTEMS_COUNT,
  PUBLIC_AS_OF_DATE,
  YEARS_EXPERIENCE,
} from '@/data/canonical';
import { isPostSlugPublic } from '@/data/posts';
import { PERSON_NAME, SITE_DESCRIPTION, SITE_URL } from '@/data/site';

// Machine-readable capabilities manifest generated from the same typed data
// as the human-facing case studies. Linked from public/llms.txt and <head>.
export const dynamic = 'force-static';

export function GET(): Response {
  const projects = PROJECTS.map((p) => {
    const cs = CASE_STUDIES.find((c) => c.projectId === p.id);
    return {
      slug: p.id,
      title: p.title,
      subtitle: p.subtitle,
      role: p.role,
      era: cs?.era,
      timeline: cs?.timeline,
      status: cs?.status ?? 'not-specified',
      stack: p.stack,
      metric: { value: p.heroMetric.value, label: p.heroMetric.label },
      problem: cs?.narrative.problem,
      contribution: cs?.narrative.contribution,
      decision: cs?.narrative.decision?.selectedApproach,
      outcomeAndState: cs?.narrative.outcomeAndState ?? p.caption,
      limits: cs?.narrative.limits,
      url: `${SITE_URL}/projects/${p.id}`,
      deepDive: isPostSlugPublic(cs?.blogPostSlug)
        ? `${SITE_URL}/blog/${cs?.blogPostSlug}`
        : undefined,
    };
  });

  const approachTaxonomy = {
    modeling:
      'Combustion Tuning used 84 regression models and bounded optimization. Document Intelligence used OCR, computer vision, and a Random Forest for checkbox detection. Financial peer benchmarking uses a guarded text-to-SQL path. Commodity Tax is deterministic process automation. The AI/LLM workforce analytics and drafting platforms use models only inside declared workflow boundaries.',
    retrieval:
      'The AI/LLM drafting platform routes requests to a configured field group before dense semantic retrieval within that scope. The AI/LLM workforce analytics platform uses model-assisted intent routing around code-owned entitlement, data access, and calculation. No shipped sparse, hybrid, or reciprocal-rank-fusion path is claimed.',
    modelAdaptation:
      'The regulated-finance systems consume approved foundation-model endpoints. No fine-tuning work is claimed.',
    evaluation:
      'Model-assisted systems use LLM-as-judge alongside extensive human testing, with evidence prepared for Model Risk review. Bespoke tracing and logging support investigation; scores do not replace accountable review.',
    responsibilityBoundaries:
      'Model-mediated interpretation and drafting are separated from deterministic calculation, authorization, reviewed query construction, and human action. The exact boundary differs by system and remains subject to configuration, testing, monitoring, and review.',
  };

  const manifest = {
    name: PERSON_NAME,
    title: 'Machine learning engineer and AI/data science lead',
    url: SITE_URL,
    summary: SITE_DESCRIPTION,
    experience: {
      asOf: PUBLIC_AS_OF_DATE,
      aiAndMachineLearning: `${YEARS_EXPERIENCE} years`,
      regulatedFinanceProductionAi: '~4 years',
      agenticAndLlmSystems: '18 months',
      productionAiSystemsAtRbc: PRODUCTION_SYSTEMS_COUNT,
    },
    projects,
    approachTaxonomy,
    links: {
      site: SITE_URL,
      resume: `${SITE_URL}/resume`,
      writings: `${SITE_URL}/blog`,
      llms: `${SITE_URL}/llms.txt`,
      sitemap: `${SITE_URL}/sitemap.xml`,
    },
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
