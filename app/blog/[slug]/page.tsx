import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS, isPostPublic } from '@/data/posts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogPostShell from '@/components/blog/BlogPostShell';

export function generateStaticParams() {
  return POSTS.filter((p) => isPostPublic(p)).map((p) => ({
    slug: p.meta.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.abstract,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.abstract,
      type: 'article',
      publishedTime: post.meta.date,
      authors: ['Harmilap Singh Dhaliwal'],
      tags: post.meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.abstract,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen">
        <BlogPostShell slug={params.slug} meta={post.meta} />
      </main>
      <Footer />
    </>
  );
}
