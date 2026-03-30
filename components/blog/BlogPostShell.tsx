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

  // Find the case study that links to this blog post
  const caseStudy = CASE_STUDIES.find((cs) => cs.blogPostSlug === slug);
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
