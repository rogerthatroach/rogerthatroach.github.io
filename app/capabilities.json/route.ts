import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

// Machine-readable capabilities manifest generated from the same typed data
// as the human-facing case studies. Linked from public/llms.txt and <head>.
export const dynamic = 'force-static';

const SITE_URL = 'https://rogerthatroach.github.io';

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
      status: cs?.status ?? 'shipped',
      stack: p.stack,
      metric: { value: p.heroMetric.value, label: p.heroMetric.label },
      // problem/decision/impact come from the case study's TL;DR when present
      // (one honest sentence each); otherwise the project caption stands in.
      problem: cs?.tldr?.problem,
      decision: cs?.tldr?.decision,
      impact: cs?.tldr?.impact ?? p.caption,
      url: `${SITE_URL}/projects/${p.id}`,
      deepDive: cs?.blogPostSlug ? `${SITE_URL}/blog/${cs.blogPostSlug}` : undefined,
    };
  });

  // Current implementation taxonomy, kept alongside the project data so the
  // manifest does not imply techniques that the production systems did not use.
  const approachTaxonomy = {
    modeling:
      'TCS digital-twin work was regression (84 models); Humana was classification; Aegis is NL→SQL extraction + ranking; Astraeus / PAR Assist / ARGUS are LLM pipelines; Commodity Tax was process automation. Task type is matched to the problem, not assumed.',
    retrieval:
      'PAR Assist uses LLM-assisted routing to select a scoped field group, followed by dense semantic retrieval within that scope. Astraeus uses model-assisted intent routing around a deterministic compute path. Neither production path is presented as BM25, sparse, hybrid, or RRF.',
    fineTuning:
      'In regulated-finance production the work is consuming foundation-model API endpoints; fine-tuning was out of scope by policy, not framed as a deliberate technical choice.',
    evaluation:
      'RAG/LLM evaluation combines LLM-as-judge with extensive human testing, feeding evidence into Model Risk review. The systems use bespoke logging and monitoring rather than third-party evaluation libraries.',
    dataBoundary:
      'In Astraeus, scoped model stages handle gate, metadata extraction, answer shaping, and synthesis; a separate deterministic path owns entitlement resolution, data access, and calculation. Typed contracts, access controls, validation, logging, tests, and monitoring constrain the boundary; configuration and integration errors remain residual risks.',
  };

  const manifest = {
    name: 'Harmilap Singh Dhaliwal',
    title: 'AI/ML Engineering Lead — production AI in regulated finance',
    url: SITE_URL,
    summary:
      '8+ years in AI/ML — industrial digital twins → cloud document intelligence → financial NL→SQL and agentic AI in regulated finance. Three production AI systems at a major Canadian bank; approximately 1.5 years focused on agentic and LLM systems.',
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
