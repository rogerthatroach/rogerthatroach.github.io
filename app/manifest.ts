import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/data/site';

// Next 16 requires force-static on metadata routes under output:'export'.
export const dynamic = 'force-static';

// Web app manifest — declares name/theme/icons so iOS home-screen saves and
// Android install prompts get a proper icon instead of a screenshot.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: 'HSD',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5f2',
    theme_color: '#f8f5f2',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
