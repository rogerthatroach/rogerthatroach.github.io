import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { POSTS, isPostPublic, type BlogPost } from '@/data/posts';
import { PROJECTS } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import type { AccordionGroup } from '@/components/blog/ProjectAccordion';

export const metadata: Metadata = {
  title: 'Writings — Harmilap Singh Dhaliwal',
  description: 'Technical whitepapers on agentic AI, text-to-SQL, and closed-loop optimization.',
  alternates: { canonical: '/blog' },
};

/**
 * Blog index — posts grouped by the project they're anchored on.
 *
 * Each post carries an optional `projectId` on its metadata (see
 * `BlogPostMeta` in `data/posts/index.ts`). The index groups posts by
 * project so multi-post projects (Prometheus has 3, Commodity Tax has
 * 2) read as a set, not as scattered cards. Cross-cutting pattern
 * posts without a projectId fall into a final "Patterns" group.
 *
 * Group ordering mirrors the projects-chronological data with newest-
 * first (Prometheus → Astraeus → Aegis → Commodity Tax → Document
 * Intelligence → Combustion Tuning → Patterns).
 */

type ProjectId = NonNullable<BlogPost['meta']['projectId']>;

// Era maps a project to a color pair used for the section header's
// accent bar + mono eyebrow. Matches the era palette used in the
// Journey section so the two surfaces read the same vocabulary.
const PROJECT_ERA: Record<ProjectId, { label: string; dark: string; light: string }> = {
  'par-assist':           { label: 'Intelligent Systems',   dark: '#93c5fd', light: '#1e40af' },
  astraeus:               { label: 'Intelligent Systems',   dark: '#93c5fd', light: '#1e40af' },
  aegis:                  { label: 'Intelligent Systems',   dark: '#93c5fd', light: '#1e40af' },
  'commodity-tax':        { label: 'Enterprise Analytics',  dark: '#fcd34d', light: '#92400e' },
  'document-intelligence':{ label: 'Cloud ML',              dark: '#67e8f9', light: '#155e75' },
  'combustion-tuning':    { label: 'Foundation',            dark: '#fca5a5', light: '#991b1b' },
};

export default function BlogIndexPage() {
  // NB: wrap `isPostPublic` in an arrow; `.filter(isPostPublic)` would
  // pass (element, index, array) and the array index would clobber the
  // function's default `now` parameter (see data/posts/index.ts).
  const published = POSTS.filter((p) => isPostPublic(p));

  // Group posts by projectId. PROJECTS is already newest-first (PAR
  // Assist → Combustion Tuning); pattern posts fall into a final group.
  // Pass only `meta` shapes through to the accordion (client component
  // boundary — keep the payload JSON-friendly and minimal).
  const groups: AccordionGroup[] = [];
  for (const project of PROJECTS) {
    const projectPosts = published
      .filter((p) => p.meta.projectId === project.id)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
    if (projectPosts.length === 0) continue;
    groups.push({
      projectId: project.id,
      title: project.title,
      description: project.caption,
      deepDivePath: project.deepDivePath,
      era: PROJECT_ERA[project.id as ProjectId],
      posts: projectPosts.map((p) => p.meta),
    });
  }

  const patternPosts = published
    .filter((p) => !p.meta.projectId)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  if (patternPosts.length > 0) {
    groups.push({
      projectId: null,
      title: 'Patterns',
      posts: patternPosts.map((p) => p.meta),
    });
  }

  return (
    <>
      <Nav />
      <main id="main-content" className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Home
        </Link>

        {groups.length === 0 ? (
          <p className="mt-16 text-center text-sm text-text-tertiary">Posts coming soon.</p>
        ) : (
          <BlogIndexClient groups={groups} />
        )}
      </main>
      <Footer />
    </>
  );
}
