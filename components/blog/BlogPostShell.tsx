import type { BlogPostMeta } from '@/data/posts';
import { POSTS } from '@/data/posts';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
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
  'par-assist-building': () => import('@/data/posts/par-assist-building.mdx'),
  'commodity-tax-cfo-trust': () => import('@/data/posts/commodity-tax-cfo-trust.mdx'),
  'commodity-tax-cfo-trust-framework': () => import('@/data/posts/commodity-tax-cfo-trust-framework.mdx'),
  'astraeus-llm-as-router': () => import('@/data/posts/astraeus-llm-as-router.mdx'),
  'astraeus-llm-as-router-framework': () => import('@/data/posts/astraeus-llm-as-router-framework.mdx'),
  'aegis-v2-velocity': () => import('@/data/posts/aegis-v2-velocity.mdx'),
  'aegis-decomposition-framework': () => import('@/data/posts/aegis-decomposition-framework.mdx'),
  'commodity-tax-provenance': () => import('@/data/posts/commodity-tax-provenance.mdx'),
};

interface BlogPostShellProps {
  slug: string;
  meta: BlogPostMeta;
}

export default async function BlogPostShell({ slug, meta }: BlogPostShellProps) {
  const loadContent = POST_LOADERS[slug];
  const post = POSTS.find((p) => p.meta.slug === slug);

  // Find the case study that links to this blog post via either the
  // canonical technical post (blogPostSlug) or the practitioner companion
  // (companionBlogPostSlug). Both reader paths link back to the same case study.
  const caseStudy = CASE_STUDIES.find(
    (cs) => cs.blogPostSlug === slug || cs.companionBlogPostSlug === slug,
  );
  const project = caseStudy ? PROJECTS.find((p) => p.id === caseStudy.projectId) : undefined;
  const relatedProject = project && caseStudy
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
