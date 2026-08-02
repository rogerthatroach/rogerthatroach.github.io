import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const META_TITLE = 'About';
const META_DESCRIPTION =
  'Leadership philosophy, beliefs about building AI systems in regulated environments, and resume.';
const META_PATH = '/about';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: META_PATH },
  openGraph: {
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    url: META_PATH,
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      {/* Priority-hinted preload for the portrait (LCP candidate on /about). */}
      <link
        {...({
          rel: 'preload',
          as: 'image',
          href: '/images/portrait.webp',
          type: 'image/webp',
          fetchPriority: 'high',
        } as React.HTMLAttributes<HTMLLinkElement>)}
      />
      <Nav />
      <div className="pt-16">
        <AboutSection />
      </div>
      <Footer />
    </main>
  );
}
