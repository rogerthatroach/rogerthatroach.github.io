import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — Harmilap Singh Dhaliwal',
  description:
    'Leadership philosophy, beliefs about building AI systems in regulated environments, and resume.',
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Nav />
      <div className="pt-16">
        <AboutSection />
      </div>
      <Footer />
    </main>
  );
}
