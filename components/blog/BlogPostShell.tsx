import type { BlogPostMeta } from '@/data/posts';
import { POSTS } from '@/data/posts';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { PROJECTS } from '@/data/projects';
import PostLayout from './PostLayout';
import AgenticAiPost from '@/data/posts/agentic-ai.mdx';
import TextToSqlPost from '@/data/posts/text-to-sql.mdx';
import ClosedLoopPost from '@/data/posts/closed-loop.mdx';
import EnterpriseAgenticAiPost from '@/data/posts/enterprise-agentic-ai.mdx';
import EnterpriseAgenticAiFrameworkPost from '@/data/posts/enterprise-agentic-ai-framework.mdx';
import ParAssistBuildingPost from '@/data/posts/par-assist-building.mdx';
import CommodityTaxCfoTrustPost from '@/data/posts/commodity-tax-cfo-trust.mdx';
import CommodityTaxCfoTrustFrameworkPost from '@/data/posts/commodity-tax-cfo-trust-framework.mdx';
import AstraeusRouterPost from '@/data/posts/astraeus-llm-as-router.mdx';
import AstraeusRouterFrameworkPost from '@/data/posts/astraeus-llm-as-router-framework.mdx';
import AegisVelocityPost from '@/data/posts/aegis-v2-velocity.mdx';
import AegisFrameworkPost from '@/data/posts/aegis-decomposition-framework.mdx';
import CommodityTaxProvenancePost from '@/data/posts/commodity-tax-provenance.mdx';

// Only published post bodies are imported into this server-side registry. Keeping
// the registry static ensures the complete article appears in exported/no-JS HTML
// without reintroducing draft bodies into a shared client bundle.
const POST_COMPONENTS: Record<string, React.ComponentType> = {
  'agentic-ai': AgenticAiPost,
  'text-to-sql': TextToSqlPost,
  'closed-loop': ClosedLoopPost,
  'enterprise-agentic-ai-architecture': EnterpriseAgenticAiPost,
  'enterprise-agentic-ai-framework': EnterpriseAgenticAiFrameworkPost,
  'par-assist-building': ParAssistBuildingPost,
  'commodity-tax-cfo-trust': CommodityTaxCfoTrustPost,
  'commodity-tax-cfo-trust-framework': CommodityTaxCfoTrustFrameworkPost,
  'astraeus-llm-as-router': AstraeusRouterPost,
  'astraeus-llm-as-router-framework': AstraeusRouterFrameworkPost,
  'aegis-v2-velocity': AegisVelocityPost,
  'aegis-decomposition-framework': AegisFrameworkPost,
  'commodity-tax-provenance': CommodityTaxProvenancePost,
};

interface BlogPostShellProps {
  slug: string;
  meta: BlogPostMeta;
}

export default function BlogPostShell({ slug, meta }: BlogPostShellProps) {
  const Content = POST_COMPONENTS[slug];
  const post = POSTS.find((p) => p.meta.slug === slug);

  // Find the case study that links to this blog post via either the
  // canonical formal post (blogPostSlug) or the practitioner companion
  // (companionBlogPostSlug). Both registers link back to the same case study.
  const caseStudy = CASE_STUDIES.find(
    (cs) => cs.blogPostSlug === slug || cs.companionBlogPostSlug === slug,
  );
  const project = caseStudy ? PROJECTS.find((p) => p.id === caseStudy.projectId) : undefined;
  const relatedProject = project && caseStudy
    ? { title: project.title, path: `/projects/${project.id}` }
    : undefined;

  if (!Content) return null;

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
