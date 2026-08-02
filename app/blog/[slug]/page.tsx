import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS, isPostPublic } from '@/data/posts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogPostShell from '@/components/blog/BlogPostShell';

const SITE_URL = 'https://rogerthatroach.github.io';
const MAX_META_DESCRIPTION_LENGTH = 160;

function truncateDescription(text: string): string {
  const normalized = text.trim().replace(/\s+/g, ' ');
  if (normalized.length <= MAX_META_DESCRIPTION_LENGTH) return normalized;

  const candidate = normalized.slice(0, MAX_META_DESCRIPTION_LENGTH - 1);
  const lastBoundary = candidate.lastIndexOf(' ');
  const truncated = lastBoundary > 0 ? candidate.slice(0, lastBoundary) : candidate;
  return `${truncated.trimEnd()}…`;
}

export function generateStaticParams() {
  return POSTS.filter((p) => isPostPublic(p)).map((p) => ({
    slug: p.meta.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post || !isPostPublic(post)) return {};

  const description = truncateDescription(post.meta.abstract);

  return {
    title: post.meta.title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.meta.title,
      description,
      url: `/blog/${params.slug}`,
      siteName: 'Harmilap Singh Dhaliwal',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updated ?? post.meta.date,
      authors: ['Harmilap Singh Dhaliwal'],
      tags: post.meta.tags,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description,
      images: ['/og-image.png'],
    },
  };
}

// BlogPosting JSON-LD — pre-rendered server-side so Google's rich-result
// crawler sees Article schema (not just the global Person). Author refs
// the single Person entity by @id (defined in app/layout.tsx).
function blogPostingJsonLd(slug: string) {
  const post = POSTS.find((p) => p.meta.slug === slug);
  if (!post) return null;
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description: post.meta.abstract,
    datePublished: post.meta.date,
    dateModified: post.meta.updated ?? post.meta.date,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Harmilap Singh Dhaliwal' },
    keywords: post.meta.tags.join(', '),
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: 'en',
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post) notFound();

  const jsonLd = blogPostingJsonLd(params.slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Nav />
      <main id="main-content" className="min-h-screen">
        <BlogPostShell slug={params.slug} meta={post.meta} />
      </main>
      <Footer />
    </>
  );
}
