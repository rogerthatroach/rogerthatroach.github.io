'use client';

import dynamic from 'next/dynamic';
import type { BlogPostMeta } from '@/data/posts';
import { POSTS } from '@/data/posts';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { PROJECTS } from '@/data/projects';
import PostLayout from './PostLayout';

// Post content components — SSR enabled so equations render into static HTML.
// Interactive diagrams inside each post use their own ssr:false via next/dynamic.
const POST_COMPONENTS: Record<string, React.ComponentType> = {
  'agentic-ai': dynamic(() => import('@/data/posts/agentic-ai.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'text-to-sql': dynamic(() => import('@/data/posts/text-to-sql.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'closed-loop': dynamic(() => import('@/data/posts/closed-loop.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'enterprise-agentic-ai-architecture': dynamic(() => import('@/data/posts/enterprise-agentic-ai.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'par-assist-building': dynamic(() => import('@/data/posts/par-assist-building.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'commodity-tax-cfo-trust': dynamic(() => import('@/data/posts/commodity-tax-cfo-trust.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'astraeus-llm-as-router': dynamic(() => import('@/data/posts/astraeus-llm-as-router.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'combustion-tuning-operators': dynamic(() => import('@/data/posts/combustion-tuning-operators.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'document-intelligence-accuracy-cliff': dynamic(() => import('@/data/posts/document-intelligence-accuracy-cliff.mdx'), {
    loading: () => <PostSkeleton />,
  }),
  'aegis-v2-velocity': dynamic(() => import('@/data/posts/aegis-v2-velocity.mdx'), {
    loading: () => <PostSkeleton />,
  }),
};

function PostSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
      <div className="h-4 w-full animate-pulse rounded bg-surface" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-surface" />
      <div className="h-32 w-full animate-pulse rounded bg-surface" />
    </div>
  );
}

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
