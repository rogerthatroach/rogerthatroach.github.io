import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

// Machine-readable capabilities manifest, generated at build time (static
// export). On-brand for an agentic-AI author: the portfolio becomes
// agent-consumable + verifiable. Sourced entirely from the same typed data
// the human-facing case studies render, so it can't drift from the site.
// Linked from public/llms.txt and <head>.
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

  // Verified "what I've actually built / used" notes — the honest taxonomy
  // that already appears across the case studies and blog posts. Kept here so
  // an agent reading the manifest doesn't over-generalize from buzzwords.
  const approachTaxonomy = {
    modeling:
      'TCS digital-twin work was regression (84 models); Humana was classification; Aegis is NL→SQL extraction + ranking; Astraeus / PAR Assist / ARGUS are LLM pipelines; Commodity Tax was process automation. Task type is matched to the problem, not assumed.',
    retrieval:
      'PAR Assist and Astraeus use an LLM-as-router (the LLM does keyword/fuzzy matching to scope a subset) followed by dense RAG — not BM25, sparse, hybrid, or RRF.',
    fineTuning:
      'In regulated-finance production the work is consuming foundation-model API endpoints; fine-tuning was out of scope by policy, not framed as a deliberate technical choice.',
    evaluation:
      'RAG/LLM evaluation = LLM-as-judge plus extensive human testing, feeding mandatory Model Risk (MRM) documentation. Bespoke logging and monitoring; no third-party eval libraries.',
    dataBoundary:
      'In Astraeus the LLM never touches operational data by construction — GPT is used only for parse / route / metadata extraction / synthesis; deterministic code handles all data access.',
  };

  const manifest = {
    name: 'Harmilap Singh Dhaliwal',
    title: 'AI/ML Engineering Lead — production AI in regulated finance',
    url: SITE_URL,
    summary:
      'Eight years of production AI/ML — industrial Digital Twins → cloud document intelligence → financial NL→SQL and agentic AI in a major Canadian bank. Three production AI systems at RBC; last year-plus on agentic AI.',
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
