import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { POSTS, isPostPublic, type BlogPost } from '@/data/posts';
import { PROJECTS } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PostCard from '@/components/blog/PostCard';

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
 * project so multi-post projects (PAR Assist has 3, Commodity Tax has
 * 2) read as a set, not as scattered cards. Cross-cutting pattern
 * posts without a projectId fall into a final "Patterns" group.
 *
 * Group ordering mirrors the projects-chronological data with newest-
 * first (PAR Assist → Astraeus → Aegis → Commodity Tax → Document
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

interface ProjectGroup {
  projectId: ProjectId | null;  // null = cross-cutting patterns
  title: string;
  deepDivePath?: string;
  era?: { label: string; dark: string; light: string };
  posts: BlogPost[];
}

export default function BlogIndexPage() {
  // NB: wrap `isPostPublic` in an arrow; `.filter(isPostPublic)` would
  // pass (element, index, array) and the array index would clobber the
  // function's default `now` parameter (see data/posts/index.ts).
  const published = POSTS.filter((p) => isPostPublic(p));

  // Group posts by projectId. PROJECTS is already newest-first (PAR
  // Assist → Combustion Tuning); pattern posts fall into a final group.
  const groups: ProjectGroup[] = [];
  for (const project of PROJECTS) {
    const projectPosts = published
      .filter((p) => p.meta.projectId === project.id)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
    if (projectPosts.length === 0) continue;
    groups.push({
      projectId: project.id as ProjectId,
      title: project.title,
      deepDivePath: project.deepDivePath,
      era: PROJECT_ERA[project.id as ProjectId],
      posts: projectPosts,
    });
  }

  const patternPosts = published
    .filter((p) => !p.meta.projectId)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  if (patternPosts.length > 0) {
    groups.push({
      projectId: null,
      title: 'Patterns',
      posts: patternPosts,
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
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">Writings</h1>
        <p className="mt-2 max-w-2xl text-base text-text-secondary">
          Technical explorations — architecture patterns, formal guarantees, and the systems
          thinking behind the work. Grouped by project so posts about the same system read as
          a set.
        </p>

        {groups.length === 0 ? (
          <p className="mt-16 text-center text-sm text-text-tertiary">Posts coming soon.</p>
        ) : (
          <div className="mt-10 space-y-12">
            {groups.map((group) => (
              <ProjectSection key={group.projectId ?? 'patterns'} group={group} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function ProjectSection({ group }: { group: ProjectGroup }) {
  const isPatterns = group.projectId === null;
  const accent = group.era;

  return (
    <section
      aria-labelledby={`group-${group.projectId ?? 'patterns'}`}
      className="relative"
    >
      {/* Accent bar running down the left edge, era-coloured per group */}
      {!isPatterns && accent && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-full w-[3px] rounded-full sm:block"
          style={{
            background: `linear-gradient(to bottom, ${accent.dark}aa, ${accent.dark}00)`,
          }}
        />
      )}

      <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 sm:pl-6">
        {accent && (
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: accent.dark }}
          >
            <span className="dark:hidden" style={{ color: accent.light }}>
              {accent.label}
            </span>
            <span className="hidden dark:inline">{accent.label}</span>
          </p>
        )}
        <h2
          id={`group-${group.projectId ?? 'patterns'}`}
          className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
        >
          {group.title}
        </h2>
        <span className="font-mono text-xs text-text-tertiary">
          {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
        </span>
        {group.deepDivePath && (
          <Link
            href={group.deepDivePath}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-text-tertiary transition-colors hover:text-accent"
          >
            Case study
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        )}
      </header>

      <div className="grid gap-6 sm:grid-cols-2 sm:pl-6">
        {group.posts.map((post, i) => (
          <PostCard key={post.meta.slug} post={post.meta} index={i} />
        ))}
      </div>
    </section>
  );
}
