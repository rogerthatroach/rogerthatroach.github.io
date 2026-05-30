import { POSTS, isPostPublic } from '@/data/posts';

// RSS 2.0 feed for the blog, generated at build time (static export).
export const dynamic = 'force-static';

const SITE_URL = 'https://rogerthatroach.github.io';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET(): Response {
  const posts = POSTS.filter((p) => isPostPublic(p)).sort((a, b) =>
    b.meta.date.localeCompare(a.meta.date),
  );

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.meta.title)}</title>
      <link>${SITE_URL}/blog/${p.meta.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.meta.slug}</guid>
      <pubDate>${new Date(p.meta.date).toUTCString()}</pubDate>
      <description>${esc(p.meta.abstract)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Harmilap Singh Dhaliwal — Writings</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Technical whitepapers and practitioner deep-dives on production AI/ML.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
