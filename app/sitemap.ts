import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { POSTS, isPostPublic } from '@/data/posts';

const SITE_URL = 'https://rogerthatroach.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/resume/arc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/now`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/colophon`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = POSTS.filter((p) => isPostPublic(p)).map((p) => ({
    url: `${SITE_URL}/blog/${p.meta.slug}`,
    lastModified: new Date(p.meta.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
