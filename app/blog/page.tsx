import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { POSTS } from '@/data/posts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PostCard from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: 'Writing — Harmilap Singh Dhaliwal',
  description: 'Technical whitepapers on agentic AI, text-to-SQL, and closed-loop optimization.',
};

export default function BlogIndexPage() {
  const published = POSTS
    .filter((p) => p.meta.status === 'published')
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Writing</h1>
        <p className="mt-2 text-base text-text-secondary">
          Technical explorations — architecture patterns, formal guarantees, and the systems thinking behind the work.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((post, i) => (
            <PostCard key={post.meta.slug} post={post.meta} index={i} />
          ))}
        </div>

        {published.length === 0 && (
          <p className="mt-16 text-center text-sm text-text-tertiary">
            Posts coming soon.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
