import type { BlogPostMeta } from '@/data/posts';
import { POSTS } from '@/data/posts';
import { PROJECTS } from '@/data/projects';
import PostLayout from './PostLayout';

type PostModule = { default: React.ComponentType };

// Only published post bodies are imported into this server-side registry. Keeping
// the registry explicit ensures drafts remain absent. Route-selective imports keep
// unrelated client visualizations out of each article bundle while preserving the
// complete server-rendered body in exported HTML.
const POST_LOADERS: Record<string, () => Promise<PostModule>> = {
  'agentic-ai': () => import('@/data/posts/agentic-ai.mdx'),
  'text-to-sql': () => import('@/data/posts/text-to-sql.mdx'),
  'closed-loop': () => import('@/data/posts/closed-loop.mdx'),
  'enterprise-agentic-ai-architecture': () => import('@/data/posts/enterprise-agentic-ai.mdx'),
  'enterprise-agentic-ai-framework': () => import('@/data/posts/enterprise-agentic-ai-framework.mdx'),
  'funding-request-drafting-platform-building': () => import('@/data/posts/funding-request-drafting-platform-building.mdx'),
  'commodity-tax-cfo-trust': () => import('@/data/posts/commodity-tax-cfo-trust.mdx'),
  'workforce-analytics-model-boundary': () => import('@/data/posts/workforce-analytics-llm-as-router.mdx'),
  'workforce-analytics-boundary-decisions': () => import('@/data/posts/workforce-analytics-routing-framework.mdx'),
  'financial-benchmarking-refactor': () => import('@/data/posts/financial-benchmarking-refactor-velocity.mdx'),
  'financial-benchmarking-query-decisions': () => import('@/data/posts/financial-benchmarking-decomposition-framework.mdx'),
  'commodity-tax-provenance': () => import('@/data/posts/commodity-tax-provenance.mdx'),
};

interface BlogPostShellProps {
  slug: string;
  meta: BlogPostMeta;
}

export default async function BlogPostShell({ slug, meta }: BlogPostShellProps) {
  const loadContent = POST_LOADERS[slug];
  const post = POSTS.find((p) => p.meta.slug === slug);

  // Every register carries its canonical project id in post metadata. Use it
  // directly so technical, practitioner, and builder routes all expose the
  // same project relationship.
  const project = meta.projectId
    ? PROJECTS.find((candidate) => candidate.id === meta.projectId)
    : undefined;
  const relatedProject = project
    ? { title: project.title, path: `/projects/${project.id}` }
    : undefined;

  if (!loadContent) return null;

  const { default: Content } = await loadContent();

  return (
    <PostLayout
      meta={meta}
      references={post?.references}
      furtherReading={post?.furtherReading}
      relatedProject={relatedProject}
    >
      <Content />
    </PostLayout>
  );
}
