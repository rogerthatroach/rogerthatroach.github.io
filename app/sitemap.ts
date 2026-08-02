import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { POSTS, isPostPublic } from '@/data/posts';
import { PAPERS, isPaperPublic } from '@/data/papers';

// Next 16 requires force-static on metadata routes under output:'export'.
export const dynamic = 'force-static';

const SITE_URL = 'https://rogerthatroach.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/platform`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/now`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/colophon`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/papers`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const paperRoutes: MetadataRoute.Sitemap = PAPERS.filter(isPaperPublic).map((p) => ({
    url: `${SITE_URL}/papers/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = POSTS.filter((p) => isPostPublic(p)).map((p) => ({
    url: `${SITE_URL}/blog/${p.meta.slug}`,
    lastModified: new Date(p.meta.updated ?? p.meta.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes, ...paperRoutes];
}
